import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import AuthenticationService from "../../../services/authentication.service";
import ProductService from "../../../services/product.service";
import ProductSellService from "../../../services/product.sell.service";
import authenticationHeader from "../../../services/authentication.header";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const CCPayment = ({ cart, action }) => {
  // reset form
  // form reference
  const formRef = useRef(null);

  let navigate = useNavigate();

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  // 1=cash/2=cc
  const [paymentType, setPaymentType] = useState(2);

  // local .jsx file variable, to store cart-type
  let cardType = "";

  const [amountToPay, setAmountToPay] = useState(0);

  const [bill, setBill] = useState(null);

  const years_ = Array.from([2023, 2024, 2025], (e) => {
    return {
      yearNumber: (e + "").substring(2),
      yearId: e,
    };
  });
  const months_ = Array.from({ length: 12 }, (e, i) => {
    return {
      monthNumber: i + 1 < 10 ? "0" + (i + 1) : i + 1 + "",
      monthId: i + 1,
    };
  });

  const successOptions = {
    autoClose: 2000,
    type: toast.TYPE.SUCCESS,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
  };
  const errorOptions = {
    autoClose: 2000,
    type: toast.TYPE.ERROR,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
  };

  useEffect(() => {
    setMonths(months_);
    setYears(years_);

    // get cart total
    var cartTotal_ = cart.reduce(
      (total, currentItem) =>
        (total =
          total +
          parseFloat(
            (currentItem.currentPrice * currentItem.qtyBuy).toFixed(2)
          )),
      0
    );
    setAmountToPay((Math.ceil(cartTotal_ * 20 - 0.5) / 20).toFixed(2));
  }, []);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = () => {
    const { ccNumber, cvvNumber, mm, yy } = form;
    const newErrors = {};

    // cc check
    if (!ccNumber || ccNumber === "")
      newErrors.ccNumber = "Credit Card Number is Required!";
    else {
      let accepted = false;

      // loop through the keys (visa, mastercard, amex, etc.)
      Object.keys(creditCardTypes).forEach(function (key) {
        var regex = creditCardTypes[key];
        console.log(regex);
        if (regex.test(ccNumber)) {
          accepted = true;
          cardType = key;
        }
      });
      if (!accepted) {
        newErrors.ccNumber = "Invalid CC Number!";
      }
    }

    // cvv check
    if (!cvvNumber || cvvNumber === "")
      newErrors.cvvNumber = "CVV Number is Required!";
    else {
      if (!checkCVV(ccNumber, cvvNumber)) {
        newErrors.cvvNumber = "Invalid CVV Number!";
      }
    }

    const re = /^\d*\.?\d*$/;
    if (!mm || mm === "" || mm === undefined)
      newErrors.mm = "Month is Required!";
    else {
      if (!re.test(mm)) {
        newErrors.mm = "Month is Invalid!";
      }
    }
    if (!yy || yy === "" || yy === undefined)
      newErrors.yy = "Year is Required!";
    else {
      if (!re.test(yy)) {
        newErrors.yy = "Year is Invalid!";
      }
    }

    return newErrors;
  };

  const resetErrors = () => {};
  const handleSubmit = (e) => {
    resetErrors();

    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log("form OK");
      var paymentDTO = {};
      var cartDTO = {
        products: [],
      };
      var billDTO = {
        billRefCode: "",
        payment: null,
        cart: null,
      };

      // prepare payment obj
      // cc
      paymentDTO = {
        paymentType: Number(paymentType), // 1=cash/2=cc
        amountPaid: Number(amountToPay),
        cardNumber: form.ccNumber,
        cardType: cardType,
        cardCVV: Number(form.cvvNumber),
        validMonth: Number(form.mm),
        validYear: Number(form.yy),
      };

      // bill - payment
      billDTO.payment = paymentDTO;

      // bill - cart
      // retrive cart from local storage
      cartDTO.products = JSON.parse(localStorage.getItem("my-cart") || null);
      billDTO.cart = cartDTO;

      // bill
      console.log(billDTO);

      // api call
      ProductSellService.billCreate(billDTO)
        .then((response) => {
          // console.log(response);

          if (
            response.data.billRefCode === "" ||
            response.data.billRefCode === null
          ) {
            console.log("Bill can not create...");
            toast("Server Error - Payment : Fail !", errorOptions);
          } else {
            // display bill when bill-create-success
            var billCustomerCopy = {
              billRefCode: response.data.billRefCode,
              billAmount: response.data.payment.amountPaid,
              paymentType: response.data.payment.paymentType,
              cart: response.data.cart.products,
            };
            setBill(billCustomerCopy);

            resetForm();

            toast("Payment : Success !", successOptions);

            // reset cart[] after successful payment
            // notify master : payment component
            action([]);

            navigate("/shopping");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    resetErrors();
    setAmountToPay(0);
  };

  const renderOptionsForMonth = () => {
    return months.map((dt, i) => {
      return (
        <option value={dt.monthNumber} key={i} name={dt.monthNumber}>
          {dt.monthNumber}
        </option>
      );
    });
  };

  const renderOptionsForYear = () => {
    return years.map((dt, i) => {
      return (
        <option value={dt.yearNumber} key={i} name={dt.yearNumber}>
          {dt.yearNumber}
        </option>
      );
    });
  };

  // cc types
  const creditCardTypes = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard:
      /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    discover:
      /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
    diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/,
  };

  // check cvv
  const checkCVV = (creditCardNumber, cvvNumber) => {
    // american express and cvv is 4 digits
    if (creditCardTypes.amex.test(creditCardNumber)) {
      if (/^\d{4}$/.test(cvvNumber)) return true;
    } else if (/^\d{3}$/.test(cvvNumber)) {
      // other card & cvv is 3 digits
      return true;
    }
  };
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="cardHeader">
            <i className="bi bi-credit-card-2-front-fill"></i>
            &nbsp; Pay By CreditCard
            <br />
            <span>$ {amountToPay}</span>
          </div>
        </div>
        <div className="card-body">
          <Form ref={formRef}>
            <div className="row">
              <div className="col-sm-1"></div>
              <div className="col-sm-10">
                <div>
                  <Form.Group controlId="ccNumber">
                    <Form.Control
                      className="ccNumber"
                      placeholder="xxxx-xxxx-xxxx-xxxx"
                      type="text"
                      isInvalid={!!errors.ccNumber}
                      onChange={(e) => setField("ccNumber", e.target.value)}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="errorDisplay"
                    >
                      {errors.ccNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <p></p>
                <div>
                  <Form.Group controlId="cvvNumber">
                    <Form.Control
                      className="cvvNumber"
                      placeholder="CVV"
                      type="text"
                      isInvalid={!!errors.cvvNumber}
                      onChange={(e) => setField("cvvNumber", e.target.value)}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="errorDisplay"
                    >
                      {errors.cvvNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <p></p>
                <div className="row">
                  <div className="col-sm-5">
                    <Form.Group controlId="mm">
                      <Form.Control
                        as="select"
                        isInvalid={!!errors.mm}
                        onChange={(e) => {
                          setField("mm", e.target.value);
                        }}
                      >
                        <option value="">MM</option>
                        {renderOptionsForMonth()}
                      </Form.Control>
                      <Form.Control.Feedback
                        type="invalid"
                        className="errorDisplay"
                      >
                        {errors.mm}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className="col-sm-1">
                    <span>/</span>
                  </div>
                  <div className="col-sm-6">
                    <Form.Group controlId="yy">
                      <Form.Control
                        as="select"
                        isInvalid={!!errors.yy}
                        onChange={(e) => {
                          setField("yy", e.target.value);
                        }}
                      >
                        <option value="">YY</option>
                        {renderOptionsForYear()}
                      </Form.Control>
                      <Form.Control.Feedback
                        type="invalid"
                        className="errorDisplay"
                      >
                        {errors.yy}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>
                <p></p>
                <div>
                  <hr />
                  <Button
                    className="btn btn-info payByBtn"
                    type="button"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Pay By Credit Card
                  </Button>
                </div>
              </div>
              <div className="col-sm-1"></div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CCPayment;

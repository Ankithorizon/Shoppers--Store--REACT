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

const CashPayment = ({ cart, action }) => {
  // reset form
  // form reference
  const formRef = useRef(null);

  let navigate = useNavigate();

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // 1=cash/2=cc
  const [paymentType, setPaymentType] = useState(1);

  const [amountToPay, setAmountToPay] = useState(0);
  const [bill, setBill] = useState(null);
  const [disable, setDisable] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState("");

  // dynamic class assignment to div
  // successPayment
  // failPayment
  const [responseType, setResponseType] = useState("");

  useEffect(() => {
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
    const { cashAmount } = form;
    const newErrors = {};

    // cash-amount check
    if (!cashAmount || cashAmount === "")
      newErrors.cashAmount = "Cash-Amount is Required!";
    else {
      if (!containsOnlyNumbersAndDecimal(cashAmount)) {
        newErrors.cashAmount = "Invalid Cash-Amount !";
      } else {
        if (cashAmount < amountToPay) {
          newErrors.cashAmount = "Cash-Amount is Short!";
        }
      }
    }
    return newErrors;
  };

  const containsOnlyNumbersAndDecimal = (cashAmount_) => {
    return /^\d.+$/.test(cashAmount_);
  };

  const handleSubmit = (e) => {
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
      // cash
      paymentDTO = {
        paymentType: Number(paymentType), // 1=cash/2=cc
        amountPaid: Number(form.cashAmount),
        // amountPaid: 0,
        cardNumber: null,
        cardType: null,
        cardCVV: 0,
        validMonth: 0,
        validYear: 0,
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
          if (
            response.data.billRefCode === "" ||
            response.data.billRefCode === null
          ) {
            setResponseType("failPayment");
            setPaymentResponse("Payment : Fail !");
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

            setResponseType("successPayment");
            setPaymentResponse("Cash-Payment : Success !");

            // reset cart[] after successful payment
            // notify master : payment component
            action([]);
          }
        })
        .catch((error) => {
          // console.log(error);
          // 500
          if (error.response.status === 500) {
            setResponseType("failPayment");
            setPaymentResponse(error.response.data);
          }
          // 400
          if (error.response.status === 400) {
            setResponseType("failPayment");
            setPaymentResponse("400 : Bad Request !");
          }
        });
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setAmountToPay(0);
    setDisable(true);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div className="payHeader">
            <i className="bi bi-credit-card-2-front-fill"></i>
            &nbsp; Pay By Cash
            <br />
            <span>${amountToPay}</span>
            {paymentResponse && (
              <div className={responseType}>{paymentResponse}</div>
            )}
          </div>
        </div>
        <div className="card-body">
          <Form ref={formRef}>
            <div className="row">
              <div className="col-sm-1"></div>
              <div className="col-sm-10">
                <div>
                  <Form.Group controlId="cashAmount">
                    <Form.Control
                      placeholder="0.00"
                      type="text"
                      isInvalid={!!errors.cashAmount}
                      onChange={(e) => setField("cashAmount", e.target.value)}
                    />
                    <Form.Control.Feedback
                      type="invalid"
                      className="errorDisplay"
                    >
                      {errors.cashAmount}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
                <p></p>
                <div>
                  <hr />
                  <Button
                    disabled={disable}
                    className="btn btn-info payByCashBtn"
                    type="button"
                    onClick={(e) => handleSubmit(e)}
                  >
                    Pay By Cash
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

export default CashPayment;

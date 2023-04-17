import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";
import CashPayment from "./CashPayment/CashPayment";
import CCPayment from "./CCPayment/CCPayment";
import BillItems from "./BillItems/BillItems";

const Payment = ({ cart, action }) => {
  let navigate = useNavigate();

  const [payByMethod, setPayByMethod] = useState("");

  const [disable, setDisable] = useState(false);

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Shopper"))
      navigate("/un-auth");
    else {
      if (!cart || !cart.length > 0) {
        var myCart = JSON.parse(localStorage.getItem("my-cart") || "[]");
        if (myCart === undefined || myCart === null || myCart.length < 1) {
          navigate("/shopping");
        }
      }
    }
  }, []);

  const payByCash = () => {
    setPayByMethod("CASH");
  };
  const payByCC = () => {
    setPayByMethod("CC");
  };

  // this will be called by child : cc-payment & cash-payment component
  // to notify this master : payment component
  const updateCart_AfterSuccessful_Payment = (updatedCart) => {
    // this will disable payment by cc/ payment by cash btns.
    setDisable(true);

    // up further this payment component, notify app master component
    // to update cart[] after successful payment
    action(updatedCart);
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-6">
                <Button
                  disabled={disable}
                  className="btn btn-info payByBtn"
                  type="button"
                  onClick={(e) => payByCC(e)}
                >
                  <i className="bi bi-credit-card-2-front-fill"></i>{" "}
                  &nbsp;&nbsp;Pay By Card
                </Button>
              </div>
              <div className="col-sm-6">
                <Button
                  disabled={disable}
                  className="btn btn-info payByBtn"
                  type="button"
                  onClick={(e) => payByCash(e)}
                >
                  <i className="bi bi-wallet-fill"></i>&nbsp;&nbsp;Pay By Cash
                </Button>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <h2>Bill Items</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            {payByMethod === "CASH" && (
              <div className="payMethodContainer">
                <CashPayment></CashPayment>
              </div>
            )}
            {payByMethod === "CC" && (
              <div className="payMethodContainer">
                <CCPayment
                  cart={cart}
                  action={updateCart_AfterSuccessful_Payment}
                ></CCPayment>
              </div>
            )}
          </div>
          <div className="col-sm-6">
            <BillItems cart={cart}></BillItems>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

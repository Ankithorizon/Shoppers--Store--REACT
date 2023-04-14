import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";
import CashPayment from "./CashPayment/CashPayment";
import CCPayment from "./CCPayment/CCPayment";

const Payment = ({ cart }) => {
  const [payByMethod, setPayByMethod] = useState("");
  const payByCash = () => {
    setPayByMethod("CASH");
  };
  const payByCC = () => {
    setPayByMethod("CC");
  };
  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-6">
                <Button
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
                  className="btn btn-info payByBtn"
                  type="button"
                  onClick={(e) => payByCash(e)}
                >
                  <i className="bi bi-wallet-fill"></i>&nbsp;&nbsp;Pay By Cash
                </Button>
              </div>
            </div>
          </div>
          <div className="col-sm-3"></div>
        </div>
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6">
            {payByMethod === "CASH" && (
              <div className="payMethodContainer">
                <CashPayment></CashPayment>
              </div>
            )}
            {payByMethod === "CC" && (
              <div className="payMethodContainer">
                <CCPayment></CCPayment>
              </div>
            )}
          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

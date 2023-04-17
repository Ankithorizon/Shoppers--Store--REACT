import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../../services/authentication.service";
import ProductService from "../../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";

const BillItems = ({ cart }) => {
  let navigate = useNavigate();

  const productFilePath = "https://localhost:44379/Files/";
  const [cartTotal, setCartTotal] = useState(0);
  const [amountToPay, setAmountToPay] = useState(0);

  useEffect(() => {
    var cartTotal_ = cart.reduce(
      (total, currentItem) =>
        (total =
          total +
          parseFloat(
            (currentItem.currentPrice * currentItem.qtyBuy).toFixed(2)
          )),
      0
    );
    setCartTotal(cartTotal_);
    setAmountToPay((Math.ceil(cartTotal_ * 20 - 0.5) / 20).toFixed(2));
  }, [cart]);

  const displayCartHeader = () => {
    return (
      <div className="row">
        <div className="col-sm-4"></div>
        <div className="col-sm-4">
          <b>
            <u>PRICE [QTY]</u>
          </b>
        </div>
        <div className="col-sm-4">
          <b>
            <u>$ TOTAL</u>
          </b>
        </div>
      </div>
    );
  };

  let displayCart =
    cart.length > 0 &&
    cart.map((item, i) => {
      return (
        <div className="row cartPanel" key={i}>
          <div className="col-sm-4">
            <img
              width="35"
              height="35"
              src={`${productFilePath}/${item.productImage}`}
            />
          </div>
          <div className="col-sm-4">
            {item.currentPrice.toFixed(2)} [{item.qtyBuy}]
          </div>
          <div className="col-sm-4">
            {(Math.round(item.qtyBuy * item.currentPrice * 100) / 100).toFixed(
              2
            )}
          </div>
        </div>
      );
    }, this);

  return (
    <div className="billContainer">
      <div className="row">
        <div className="col-sm-12">
          <div className="billSummary">
            Cart Total ${(Math.round(cartTotal * 100) / 100).toFixed(2)}
            <br />
            <span className="amountToPay">Amount To Pay ${amountToPay}</span>
          </div>
          <p></p>
          <div className="cartContainer">
            {displayCartHeader()} <p></p>
            <div> {displayCart}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillItems;

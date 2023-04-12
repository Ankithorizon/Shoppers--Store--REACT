import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../../services/authentication.service";
import ProductService from "../../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";

const MyCart = ({ cart }) => {
  const productFilePath = "https://localhost:44379/Files/";

  const [cartTotal, setCartTotal] = useState(0);
  const [amountToPay, setAmountToPay] = useState(0);

  // parseFloat(((currentItem.currentPrice * currentItem.qtyBuy).toFixed(2))), 0));
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
        <div className="col-sm-3"></div>
        <div className="col-sm-3">
          <b>QTY</b>
        </div>
        <div className="col-sm-3">
          <b>PRICE</b>
        </div>
        <div className="col-sm-3">
          <b>$ TOTAL</b>
        </div>
      </div>
    );
  };

  let displayCart =
    cart.length > 0 &&
    cart.map((item, i) => {
      return (
        <div className="row cartPanel" key={i}>
          <div className="col-sm-3">
            <img
              width="35"
              height="35"
              src={`${productFilePath}/${item.productImage}`}
            />
          </div>
          <div className="col-sm-3">{item.qtyBuy}</div>
          <div className="col-sm-3">{item.currentPrice}</div>
          <div className="col-sm-3">
            {Math.round(item.qtyBuy * item.currentPrice * 100) / 100}
          </div>
        </div>
      );
    }, this);

  const viewEditCart = () => {};
  return (
    <div className="cartContainer">
      {/*
      {displayCartHeader()} <p></p>
      <div> {displayCart}</div>
      <div className="cartTotal">
        Cart Total $ {Math.round(cartTotal * 100) / 100}
        <br />
        <span className="amountToPay">Amount To Pay ${amountToPay}</span>
      </div>
      */}
      <div>
        <Button
          className="btn btn-info"
          type="button"
          onClick={(e) => viewEditCart(e)}
        >
          Edit / View &nbsp;&nbsp;<i className="bi bi-cart4"></i>
        </Button>
      </div>
    </div>
  );
};

export default MyCart;

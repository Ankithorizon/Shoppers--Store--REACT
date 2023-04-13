import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../../services/authentication.service";
import ProductService from "../../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";

const CheckMyCart = ({ cart, action }) => {
  let navigate = useNavigate();

  const productFilePath = "https://localhost:44379/Files/";
  const [cartTotal, setCartTotal] = useState(0);
  const [amountToPay, setAmountToPay] = useState(0);

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();
    if (currRole === null || (currRole !== null && currRole !== "Shopper"))
      navigate("/un-auth");
    else {
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
    }
  }, [cart]);

  const minusQty = (item) => {
    let cart_ = [...cart];

    if (item.qtyBuy - 1 < 1) {
      let filteredArray = cart_.filter(
        (product) => product.productId !== item.productId
      );
      action([...filteredArray]);
    } else {
      console.log("minus 1 item from cart,,,");
      // edit qty for productId
      const newCart = cart_.map((p) =>
        p.productId === item.productId
          ? { ...p, qtyBuy: Number(p.qtyBuy) - 1 }
          : p
      );
      action([...newCart]);
    }
  };

  const plusQty = (item) => {
    let cart_ = [...cart];
    // edit qty for productId
    const newCart = cart_.map((p) =>
      p.productId === item.productId
        ? { ...p, qtyBuy: Number(p.qtyBuy) + 1 }
        : p
    );
    action([...newCart]);
  };

  const displayCartHeader = () => {
    return (
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-2">
          <b>QTY</b>
        </div>
        <div className="col-sm-2">
          <b>PRICE</b>
        </div>
        <div className="col-sm-2">
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
          <div className="col-sm-2">
            <img
              width="35"
              height="35"
              src={`${productFilePath}/${item.productImage}`}
            />
          </div>
          <div className="col-sm-2">
            <Button
              className="btn btn-info"
              onClick={(e) => minusQty(item)}
              type="button"
            >
              <i className="bi bi-cart4"></i>
            </Button>
            &nbsp;&nbsp;
            {item.qtyBuy}
            &nbsp;&nbsp;
            <Button
              className="btn btn-info"
              onClick={(e) => plusQty(item)}
              type="button"
            >
              <i className="bi bi-cart4"></i>
            </Button>
          </div>
          <div className="col-sm-2">{item.currentPrice}</div>
          <div className="col-sm-2">
            {Math.round(item.qtyBuy * item.currentPrice * 100) / 100}
          </div>
        </div>
      );
    }, this);

  return (
    <div className="mainContainer">
      <div className="row">
        <div className="col-sm-2"></div>
        <div className="col-sm-8">
          <div className="cartContainer">
            {displayCartHeader()} <p></p>
            <div> {displayCart}</div>
            <div className="cartTotal">
              Cart Total $ {Math.round(cartTotal * 100) / 100}
              <br />
              <span className="amountToPay">Amount To Pay ${amountToPay}</span>
            </div>
            <div></div>
          </div>
        </div>
        <div className="col-sm-2"></div>
      </div>
    </div>
  );
};

export default CheckMyCart;

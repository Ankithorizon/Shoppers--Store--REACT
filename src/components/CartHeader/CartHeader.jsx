import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { Button, Card } from "react-bootstrap";

// this component will display total number of products in your cart
const CartHeader = ({ cart }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  useEffect(() => {
    let cartItemCount_ = 0;
    var myCart = cart.map((p) => {
      cartItemCount_ += Number(p.qtyBuy);
    });
    setCartItemCount(cartItemCount_);
  }, [cart]);

  return (
    <div>
      {cartItemCount > 0 && (
        <div className="cart">
          <i className="bi bi-cart4"></i>
          &nbsp;&nbsp;
          {cartItemCount}
        </div>
      )}
    </div>
  );
};

export default CartHeader;

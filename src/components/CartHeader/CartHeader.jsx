import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";

// this component will display total number of products in your cart
const CartHeader = ({ cart }) => {
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setTotalItems(totalItems + 10);
  }, [cart]);

    return <div className="cart">{totalItems }</div>;
};

export default CartHeader;

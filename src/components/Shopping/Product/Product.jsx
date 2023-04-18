import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../../services/authentication.service";
import ProductService from "../../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";

const Product = ({ products, action }) => {
  const productFilePath = "https://localhost:44379/Files/";
  const [ProductId, setProductId] = useState(0);
  const onChangeProduct = (product) => {
    setProductId(product.productId);
    action(product);
  };

  let displayProducts =
    products.length > 0 &&
    products.map((item, i) => {
      return (
        <Button
          key={i}
          onClick={(e) => onChangeProduct(item)}
          className={
            "btn btn-success " +
            (ProductId === item.productId
              ? " productBtn selectedProduct"
              : " productBtn")
          }
          type="button"
        >
          <div>
            {item.productImage && (
              <span>
                <img
                  width="35"
                  height="35"
                  src={`${productFilePath}/${item.productImage}`}
                />
                <br />
              </span>
            )}

            {item.productName}
            <br />
            <span>${item.price}</span>
            {item.currentDiscountPercentage > 0 && (
              <div className="currentPrice">Now ${item.currentPrice}</div>
            )}
          </div>
        </Button>
      );
    }, this);

  return (
    <div className="container">
      <div className="productPanel">
        <div>
          <h3>Products</h3>
        </div>
        {displayProducts}
      </div>
    </div>
  );
};

export default Product;

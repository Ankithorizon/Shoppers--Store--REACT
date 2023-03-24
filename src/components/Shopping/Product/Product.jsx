import React from "react";
import "./style.css";

import AuthenticationService from "../../../services/authentication.service";
import ProductService from "../../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";

const Product = ({ products }) => {
  const productFilePath = "https://localhost:44379/Files/";

  let displayProducts =
    products.length > 0 &&
    products.map((item, i) => {
      return (
        <Button key={i} className="btn btn-success productBtn" type="button">
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
            <br />
            {item.currentDiscountPercentage > 0 && (
              <span className="nowPrice">Now ${item.currentPrice}</span>
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

import React from "react";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import "./style.css";

const Product = ({ product, action }) => {
  const productFilePath = "https://localhost:44379/Files/";

  const getProductDetails = (product) => {
    // notify master view-products component
    action(product);
  };

  return (
    <div className="row">
      <div className="col-sm-1">{product.productId}</div>
      <div className="col-sm-3">{product.productName}</div>
      <div className="col-sm-3">
        ${product.price}
        {product.price !== product.currentPrice ? (
          <span className="displayCurrentPriceInTable">
            <br />
            <u>[ NOW: ${product.currentPrice} ]</u>
          </span>
        ) : (
          <span></span>
        )}
      </div>
      <div className="col-sm-3">
        {product.productImage ? (
          <span>
            <img
              width="50"
              height="50"
              src={`${productFilePath}/${product.productImage}`}
              alt="Product Image"
            />
          </span>
        ) : (
          <span className="noImage">NO IMAGE</span>
        )}
      </div>
      <div className="col-sm-2">
        <Button
          className="btn btn-info viewBtn"
          type="button"
          onClick={(e) => getProductDetails(product)}
        >
          <i className="bi bi-info-circle-fill"></i>&nbsp;View
        </Button>
      </div>
    </div>
  );
};

export default Product;

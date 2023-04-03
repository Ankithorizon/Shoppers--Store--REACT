import React, { useState, useEffect } from "react";
import "./style.css";
import Button from "react-bootstrap/Button";
import ProductService from "../../../services/product.service";
import AuthenticationService from "../../../services/authentication.service";
import { useNavigate } from "react-router-dom";
import "./style.css";

const ProductDetails = ({ product, categories, action }) => {
  let navigate = useNavigate();
  const productFilePath = "https://localhost:44379/Files/";

  useEffect(() => {
    console.log(product);
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <div className="cardHeader">
          <h5>
            [# {product.productId}] [
            {ProductService.getCategoryName(categories, product.categoryId)}]
          </h5>
        </div>
      </div>

      <div className="card-body">
        <h5>Name : {product.productName}</h5>
        <h5>Description : {product.productDesc}</h5>
        <h5>
          Price : <span className="price">${product.price}&nbsp;&nbsp;</span>
          {product.currentDiscountPercentage > 0 && (
            <span className="nowPrice">
              NOW ${product.currentPrice}
              &nbsp;&nbsp;&nbsp;[Discount {product.currentDiscountPercentage}%]
            </span>
          )}
        </h5>
        <div>
          {product.productImage ? (
            <span>
              <img
                width="100"
                height="100"
                src={`${productFilePath}/${product.productImage}`}
                alt="Product Image"
              />
            </span>
          ) : (
            <span className="noImage">NO IMAGE</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

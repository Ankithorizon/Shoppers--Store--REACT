import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Product from "./Product/Product";

const ViewProducts = () => {
  let navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();
    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else allProducts();
  }, []);

  const allProducts = () => {
    ProductService.allProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => {});
  };

  let displayData = () => {
    return (
      <div className="data">
        {products &&
          products.map((d, index) => (
            <Product
              productId={d.productId}
              productName={d.productName}
              price={d.price}
              currentPrice={d.currentPrice}
              productImage={d.productImage}
              productFileId={d.productFileId}
            ></Product>
          ))}
      </div>
    );
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="cardHeader">
                  <i className="bi bi-binoculars-fill"></i>
                  &nbsp; Products
                </div>
              </div>
              <div className="card-body">
                {products && (
                  <div>
                    <div className="row tableHeader">
                      <div className="col-sm-1">#</div>
                      <div className="col-sm-6">Name</div>
                      <div className="col-sm-2">Price</div>
                      <div className="col-sm-3">Image</div>
                    </div>
                    {displayData()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 mx-auto">product details</div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;

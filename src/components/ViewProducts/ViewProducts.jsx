import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Product from "./Product/Product";
import ProductDetails from "./ProductDetails/ProductDetails";

const ViewProducts = () => {
  let navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();
    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else allProducts();
  }, []);

  // check for 401
  const unAuthHandler401 = (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      navigate("/un-auth");
      // window.location.reload();
    } else {
      console.log("Error!");
    }
  };

  const allProducts = () => {
    ProductService.allProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => {
        setProducts(null);

        if (e.response.status === 400) {
          console.log(e.response.statusText);
        } else {
          unAuthHandler401(e);
        }
      });
  };

  // this will update master component when detail component notify
  // through event
  const updateMasterComponent_SelectedProductChanged = (selectedProduct) => {
    console.log("master is called from child", selectedProduct);
    setSelectedProduct(selectedProduct);
  };

  let displayData = () => {
    return (
      <div className="data">
        {products &&
          products.map((d, index) => (
            <div className="rowStyle" key={index}>
              <Product
                product={d}
                action={updateMasterComponent_SelectedProductChanged}
              ></Product>
              <hr />
            </div>
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
          <div className="col-md-4 mx-auto">
            {selectedProduct && (
              <div className="content">
                <ProductDetails product={selectedProduct}></ProductDetails>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;

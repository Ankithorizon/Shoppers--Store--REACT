import Search from "./Search/Search";
import SearchByCat from "./SearchByCat/SearchByCat";
import "./style.css";

import React, { useState, useEffect } from "react";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";
import Product from "./Product/Product";

const Shopping = () => {
  const [products, setProducts] = useState([]);

  let navigate = useNavigate();
  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();
    if (currRole === null || (currRole !== null && currRole !== "Shopper"))
      navigate("/un-auth");
    else {
      allProducts();
    }
  }, []);

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

  // check for 401
  const unAuthHandler401 = (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      navigate("/un-auth");
    } else {
      console.log("Error!");
    }
  };

  // master : shopping component
  // child : search-by-cat component
  const updateMasterComponent_SearchProducts = (searchProducts) => {
    console.log("in the master now", searchProducts);
    setProducts([...searchProducts]);
  };

  return (
    <div className="mainContainer">
      <div className="row">
        <div className="col-sm-8">
          <Search></Search>
          <p></p>
          <SearchByCat
            products={products}
            action={updateMasterComponent_SearchProducts}
          ></SearchByCat>
          <p></p>
          <hr />
          {products && products.length > 0 ? (
            <div>
              <Product products={products}></Product>
            </div>
          ) : (
            <div className="noProducts">Products Not Found !</div>
          )}
        </div>
        <div className="col-sm-4">product-detail &amp; cart</div>
      </div>
    </div>
  );
};

export default Shopping;

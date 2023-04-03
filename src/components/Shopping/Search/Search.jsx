import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../../services/authentication.service";
import ProductService from "../../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";

const Search = ({ products, action }) => {
  const [searchVal, setSearchVal] = useState("");
  useEffect(() => {}, []);

  const onChangeSearchVal = (e) => {
    setSearchVal(e.target.value);

    ProductService.findingProduct(e.target.value, 0)
      .then((response) => {
        console.log(response.data);
        // notify master shopping component
        action(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="container">
      <div className="searchPanel">
        <div className="row">
          <div className="col-sm-6">
            <input
              style={{
                width: 250,
                height: 50,
                borderColor: "blue",
                borderWidth: 3,
                borderRadius: 10,
                color: "blue",
              }}
              type="text"
              className="form-control"
              placeholder="Search By Product Name/Desc..."
              value={searchVal}
              onChange={(e) => onChangeSearchVal(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

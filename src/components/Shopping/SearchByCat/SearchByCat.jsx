import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../../services/authentication.service";
import ProductService from "../../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";

const SearchByCat = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(0);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    ProductService.getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((e) => {
        setCategories(null);
      });
  };

  const onChangeCategory = (categoryId) => {
    setCategory(categoryId);
    console.log(categoryId);
  };

  let displayCategories =
    categories.length > 0 &&
    categories.map((item, i) => {
      return (
        <Button
          key={i}
          className="btn btn-info searchByCatBtn"
          type="button"
          onClick={(e) => onChangeCategory(item.categoryId)}
        >
          {item.categoryName}
        </Button>
      );
    }, this);

  return (
    <div className="container">
      <div className="searchByCatPanel">
        {displayCategories}
        <Button
          className="btn btn-info searchByCatBtn"
          type="button"
          onClick={(e) => onChangeCategory(0)}
        >
          All-Products
        </Button>
      </div>
    </div>
  );
};

export default SearchByCat;

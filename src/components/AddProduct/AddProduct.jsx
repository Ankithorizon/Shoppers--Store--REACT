import React, { useState, useEffect } from "react";
import "./style.css";
import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const AddProduct = () => {
  let navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else getCategories();
  }, []);

  const productAddSuccessOptions = {
    autoClose: 2000,
    type: toast.TYPE.SUCCESS,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
  };
  const productAddErrorOptions = {
    autoClose: 2000,
    type: toast.TYPE.ERROR,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
  };

  const productImageUploadURL = {
    url: "https://localhost:44396/Files",
  };

  const formValid = ({ isError, ...rest }) => {
    let isValid = true;

    Object.values(isError).forEach((val) => {
      if (val.length > 0) {
        isValid = false;
      }
    });
    return isValid;
  };

  // check for 401
  const unAuthHandler401 = (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      navigate("/un-auth");
      // window.location.reload();
    } else {
      console.log("Error!");
    }
  };

  const getCategories = () => {
    ProductService.getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((e) => {
        if (e.response.status === 400) {
          console.log(e.response.statusText);
        } else {
          unAuthHandler401(e);
        }
      });
  };
  return <div>Product page accessed after login</div>;
};

export default AddProduct;

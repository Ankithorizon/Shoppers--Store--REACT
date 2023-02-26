import React, { useState, useEffect } from "react";
import "./style.css";
import AuthenticationService from "../../services/authentication.service";

import { useNavigate } from "react-router-dom";

// react-bootstrap-table-2
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import Button from "react-bootstrap/Button";

const Product = () => {
  let navigate = useNavigate();

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
  }, []);

  return <div>Product page accessed after login</div>;
};

export default Product;

import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";
import authenticationHeader from "../../services/authentication.header";

import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";

import { toast } from "react-toastify";

import axios from "axios";

const EditProduct = () => {
  let navigate = useNavigate();

  const [editProductId, setEditProductId] = useState(0);

  const [categories, setCategories] = useState([]);

  const [editProductResponse, setEditProductResponse] = useState({});
  const [modelErrors, setModelErrors] = useState([]);

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  // file upload
  const [selectedFiles, setSelectedFiles] = useState(undefined);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [className, setClassName] = useState("");

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else getCategories();
  }, []);

  const productEditSuccessOptions = {
    autoClose: 2000,
    type: toast.TYPE.SUCCESS,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
  };
  const productEditErrorOptions = {
    autoClose: 2000,
    type: toast.TYPE.ERROR,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
  };

  const productImageUploadURL = {
    url: "https://localhost:44379/Files",
  };
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = () => {
    const { category, productName, productDesc, price } = form;
    const newErrors = {};

    if (!category || category === "")
      newErrors.category = "Category is Required!";

    if (!productName || productName === "")
      newErrors.productName = "Product Name is Required!";

    const re = /^\d*\.?\d*$/;
    if (!price || price === "" || price === undefined)
      newErrors.price = "Price is Required!";
    else {
      if (re.test(price)) {
        if (price <= 0) {
          newErrors.price = "Price must be >= 0";
        }
      } else {
        newErrors.price = "Numbers only!";
      }
    }

    return newErrors;
  };

  const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {
      for (let prop in error.response.data.errors) {
        if (error.response.data.errors[prop].length > 1) {
          for (let error_ in error.response.data.errors[prop]) {
            errors.push(error.response.data.errors[prop][error_]);
          }
        } else {
          errors.push(error.response.data.errors[prop]);
        }
      }
    } else {
      console.log(error);
    }
    return errors;
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
    setMessage("");
    setClassName("");

    resetErrors();
  };

  const resetErrors = () => {
    setModelErrors([]);
    setEditProductResponse({});
  };

  let modelErrorList =
    modelErrors.length > 0 &&
    modelErrors.map((item, i) => {
      return (
        <ul key={i} value={item}>
          <li style={{ marginTop: -20 }}>{item}</li>
        </ul>
      );
    }, this);

  const renderOptionsForCategory = () => {
    return categories.map((dt, i) => {
      return (
        <option value={dt.categoryId} key={i} name={dt.categoryName}>
          {dt.categoryName}
        </option>
      );
    });
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

  // product-file upload
  const selectFile = (event) => {
    setSelectedFiles(event.target.files);
  };
  const uploadProductImageHandler = (event) => {
    setMessage("");
    setClassName("");

    let currentFile = selectedFiles[0];
    setProgress(0);
    setCurrentFile(currentFile);

    if (currentFile === null) return;

    const formData = new FormData();
    formData.append("productFile", currentFile);
    formData.append("productId", editProductId);

    axios
      .post("https://localhost:44379/api/Product/productFileUpload", formData, {
        headers: authenticationHeader(),
        onUploadProgress: (event) => {
          setProgress(Math.round((100 * event.loaded) / event.total));
        },
      })
      .then((response) => {
        console.log(response);
        setMessage(response.data.responseMessage);
        setClassName("uploadSuccess");

        toast(response.data.responseMessage, productEditSuccessOptions);

        setTimeout(() => {
          resetForm();
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 500) {
          setMessage(error.response.data);
          setClassName("uploadError");
          toast(error.response.data, productEditErrorOptions);
        } else if (error.response.status === 400) {
          setMessage(error.response.data);
          setClassName("uploadError");
          toast(error.response.data, productEditErrorOptions);
        }
        setTimeout(() => {
          resetForm();
        }, 3000);
      });

    setSelectedFiles(undefined);
    setCurrentFile(undefined);
  };

  return <div></div>;
};

export default EditProduct;

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

import { useSearchParams } from "react-router-dom";

const EditProduct = () => {
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [productId, setProductId] = useState(0);
  const [product, setProduct] = useState(null);
  const re = /^\d*\.?\d*$/;

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
    var selectedProductId = searchParams.get("id");
    if (selectedProductId === null || selectedProductId === undefined)
      navigate("/view-products");
    else {
      if (!re.test(selectedProductId)) {
        navigate("/view-products");
      } else {
        setProductId(searchParams.get("id"));

        var currRole = AuthenticationService.getCurrentUserRole();
        if (currRole === null || (currRole !== null && currRole !== "Admin"))
          navigate("/un-auth");
        else getCategories();
      }
    }
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
    formData.append("productId", productId);

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

  const handleSubmit = (e) => {};
  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="cardHeader">
                  <i className="bi bi-pencil-square"></i>
                  &nbsp; Edit - Product
                  <div>{}</div>
                </div>
                {editProductResponse &&
                editProductResponse.responseCode !== 200 ? (
                  <div className="editProductError">
                    {editProductResponse.responseMessage}
                  </div>
                ) : (
                  <div className="editProductSuccess">
                    {editProductResponse.responseMessage}
                  </div>
                )}
                {modelErrors.length > 0 ? (
                  <div className="modelError">{modelErrorList}</div>
                ) : (
                  <span></span>
                )}
              </div>
              <div className="card-body">
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                      <Form.Group controlId="category">
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.category}
                          onChange={(e) => {
                            setField("category", e.target.value);
                          }}
                        >
                          <option value="">Choose Category</option>
                          {renderOptionsForCategory()}
                        </Form.Control>
                        <Form.Control.Feedback
                          type="invalid"
                          className="errorDisplay"
                        >
                          {errors.category}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="productName">
                        <Form.Control
                          placeholder="Enter Product Name"
                          type="text"
                          isInvalid={!!errors.productName}
                          onChange={(e) =>
                            setField("productName", e.target.value)
                          }
                        />
                        <Form.Control.Feedback
                          type="invalid"
                          className="errorDisplay"
                        >
                          {errors.productName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="productDesc">
                        <Form.Control
                          placeholder="Enter Product Description"
                          type="text"
                          onChange={(e) =>
                            setField("productDesc", e.target.value)
                          }
                        />
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="price">
                        <Form.Control
                          placeholder="Enter Price"
                          type="text"
                          isInvalid={!!errors.price}
                          onChange={(e) => setField("price", e.target.value)}
                        />
                        <Form.Control.Feedback
                          type="invalid"
                          className="errorDisplay"
                        >
                          {errors.price}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <p></p>
                  <div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-6 submitBtn">
                        <Button
                          className="btn btn-success"
                          type="button"
                          onClick={(e) => handleSubmit(e)}
                        >
                          Edit-Product
                        </Button>
                      </div>
                      <div className="col-sm-6 cancelBtn">
                        <Button
                          className="btn btn-primary"
                          type="button"
                          onClick={(e) => resetForm(e)}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="col-md-6 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

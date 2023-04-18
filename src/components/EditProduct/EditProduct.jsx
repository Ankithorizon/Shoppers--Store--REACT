import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";
import authenticationHeader from "../../services/authentication.header";

import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { toast } from "react-toastify";

import axios from "axios";

import { useSearchParams } from "react-router-dom";

const EditProduct = () => {
  let navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [productId, setProductId] = useState(0);
  const re = /^\d*\.?\d*$/;

  const [categories, setCategories] = useState([]);

  const [editProductResponse, setEditProductResponse] = useState({});
  const [modelErrors, setModelErrors] = useState([]);

  // form
  const [form, setForm] = useState(undefined);
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
        else {
          getProduct(selectedProductId);
          getCategories();
        }
      }
    }

    return () => {};
  }, [productId]);

  // get product
  const getProduct = (id) => {
    resetErrors();
    ProductService.getProduct(id)
      .then((response) => {
        console.log(response.data);
        setForm({
          ...response.data,
        });
      })
      .catch((error) => {
        var editProductResponse = {};
        if (error.response.status === 400) {
          editProductResponse = {
            responseCode: 400,
            responseMessage: error.response.data,
          };
          setEditProductResponse(editProductResponse);
        } else if (error.response.status === 500) {
          editProductResponse = {
            responseCode: error.response.data.responseCode,
            responseMessage: error.response.data.responseMessage,
          };
          setEditProductResponse(editProductResponse);
        }
      });
  };

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
    const { categoryId, productName, productDesc, price } = form;
    const newErrors = {};

    if (!categoryId || categoryId === "")
      newErrors.categoryId = "Category is Required!";

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

  const goBack = () => {
    resetForm();
    navigate("/view-products");
  };
  const resetForm = (e) => {
    setErrors({});
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

    if (currentFile === null || currentFile === undefined) return;

    let formData = new FormData();
    formData.append("myFile", currentFile, currentFile.name);
    formData.append("productFileId", form.productFileId);
    formData.append("productId", productId);

    axios
      .post(
        "https://localhost:44379/api/Product/editProductFileUpload",
        formData,
        {
          headers: authenticationHeader(),
          "Content-Type": "multipart/form-data",
          onUploadProgress: (event) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
          },
        }
      )
      .then((response) => {
        console.log(response);

        setForm({
          ...form,
          productImage: response.data.productImage,
        });
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

  const handleSubmit = (e) => {
    resetErrors();

    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var editingProduct = {
        categoryId: Number(form.categoryId),
        productName: form.productName,
        productDesc: form.productDesc,
        price: Number(form.price),
        productId: Number(form.productId),
      };

      var editProductResponse = {};
      ProductService.editProduct(form.productId, editingProduct)
        .then((response) => {
          console.log(response);
          // success
          // 200
          if (response.status === 200) {
            editProductResponse = {
              responseCode: response.data.responseCode,
              responseMessage: response.data.responseMessage,
            };
            setEditProductResponse(editProductResponse);
            toast(response.data.responseMessage, productEditSuccessOptions);

            setTimeout(() => {
              resetForm();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 400) {
            // model errors
            if (error.response.data.errors) {
              var modelErrors = handleModelState(error);
              setModelErrors(modelErrors);
            }
            // 400 error
            else {
              editProductResponse = {
                responseCode: error.response.data.responseCode,
                responseMessage: error.response.data.responseMessage,
              };
              setEditProductResponse(editProductResponse);
              toast(
                error.response.data.responseMessage,
                productEditErrorOptions
              );
            }
          }
        });
    }
  };
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
                  {form && (
                    <div className="editProductId">
                      Product ID # {form.productId}
                    </div>
                  )}
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
              {form && (
                <div className="card-body">
                  <Form ref={formRef}>
                    <div className="row">
                      <div className="col-sm-1"></div>
                      <div className="col-sm-10">
                        <div className="row">
                          <div className="col-sm-3 colTitle">Category : </div>
                          <div className="col-sm-9">
                            <Form.Group controlId="categoryId">
                              <Form.Control
                                as="select"
                                value={form.categoryId}
                                isInvalid={!!errors.categoryId}
                                onChange={(e) => {
                                  setField("categoryId", e.target.value);
                                }}
                              >
                                <option value="">Choose Category</option>
                                {renderOptionsForCategory()}
                              </Form.Control>
                              <Form.Control.Feedback
                                type="invalid"
                                className="errorDisplay"
                              >
                                {errors.categoryId}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </div>

                        <p></p>
                        <div className="row">
                          <div className="col-sm-3 colTitle">Name : </div>
                          <div className="col-sm-9">
                            <Form.Group controlId="productName">
                              <Form.Control
                                value={form.productName}
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
                          </div>
                        </div>
                        <p></p>
                        <div className="row">
                          <div className="col-sm-3 colTitle">
                            Description :{" "}
                          </div>
                          <div className="col-sm-9">
                            <Form.Group controlId="productDesc">
                              <Form.Control
                                value={form.productDesc}
                                type="text"
                                onChange={(e) =>
                                  setField("productDesc", e.target.value)
                                }
                              />
                            </Form.Group>
                          </div>
                        </div>
                        <p></p>
                        <div className="row">
                          <div className="col-sm-3 colTitle">Price : </div>
                          <div className="col-sm-9">
                            <Form.Group controlId="price">
                              <Form.Control
                                value={form.price}
                                type="text"
                                isInvalid={!!errors.price}
                                onChange={(e) =>
                                  setField("price", e.target.value)
                                }
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                className="errorDisplay"
                              >
                                {errors.price}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-1"></div>
                    </div>
                    <p></p>
                    <div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-6 submitBtn">
                          <Button
                            className="btn btn-info"
                            type="button"
                            onClick={(e) => handleSubmit(e)}
                          >
                            Edit-Product
                          </Button>
                        </div>
                        <div className="col-sm-6 cancelBtn">
                          <Button
                            className="btn btn-info"
                            type="button"
                            onClick={(e) => goBack(e)}
                          >
                            Back
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6 mx-auto">
            <div className="imageUploadContainer">
              {form && form.productImage ? (
                <div>
                  {" "}
                  <img
                    height="220"
                    width="200"
                    src={`${productImageUploadURL.url}/${form.productImage}`}
                    alt="Product Image"
                  />
                </div>
              ) : (
                <div className="noImg">no image</div>
              )}
              <p></p>
              <div className="container">
                <div>
                  <label className="btn btn-info">
                    <input type="file" onChange={selectFile} />
                  </label>
                  <p></p>
                  {currentFile && (
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-info progress-bar-striped"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ width: progress + "%" }}
                      >
                        {progress}%
                      </div>
                    </div>
                  )}
                  <p></p>
                  <button
                    className="btn btn-success"
                    disabled={!selectedFiles}
                    onClick={uploadProductImageHandler}
                  >
                    Upload Product File
                  </button>

                  {className === "uploadSuccess" && (
                    <div
                      className="alert alert-light uploadSuccess"
                      role="alert"
                    >
                      {message}
                    </div>
                  )}
                  {className === "uploadError" && (
                    <div className="alert alert-light uploadError" role="alert">
                      {message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

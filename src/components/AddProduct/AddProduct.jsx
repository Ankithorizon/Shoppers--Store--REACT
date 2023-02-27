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

const AddProduct = () => {
  let navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [addProductResponse, setAddProductResponse] = useState({});
  const [modelErrors, setModelErrors] = useState([]);
  const [newProduct, setNewProduct] = useState(null);

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [productFileId, setProductFileId] = useState(0);

  // reset form
  // form reference
  const formRef = useRef(null);

  // file upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusFlag, setStatusFlag] = useState(0); // 0 = success, 1 = fail

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

  const handleSubmit = (e) => {
    resetErrors();

    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var addProductModel = {
        categoryId: Number(form.category),
        productName: form.productName,
        productDesc: form.productDesc,
        price: Number(form.price),
        productFileId: Number(productFileId),
      };

      console.log(addProductModel);

      ProductService.addProduct(addProductModel)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            var addProductResponse = {
              responseCode: response.data.responseCode,
              responseMessage: response.data.responseMessage,
            };
            setNewProduct(response.data.newProduct);
            setAddProductResponse(addProductResponse);
            toast(response.data.responseMessage, productAddSuccessOptions);

            setTimeout(() => {
              resetForm();
            }, 3000);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 500) {
            var addProductResponse = {
              responseCode: error.response.status,
              responseMessage: error.response.data.responseMessage,
            };

            setAddProductResponse(addProductResponse);
            toast(error.response.data.responseMessage, productAddErrorOptions);
          }
          if (error.response.status === 400) {
            if (error.response.data.errors) {
              // model errors
              var modelErrors = handleModelState(error);
              setModelErrors(modelErrors);
            } else {
              var addProductResponse = {
                responseCode: error.response.status,
                responseMessage: error.response.statusText,
              };

              setAddProductResponse(addProductResponse);
              toast(error.response.statusText, productAddErrorOptions);
            }
          }
        });
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});

    resetErrors();
  };

  const resetErrors = () => {
    setModelErrors([]);
    setAddProductResponse({});
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
  const fileData = () => {
    if (selectedFile) {
      return (
        <Card>
          <Card.Header>File Details</Card.Header>
          <Card.Body>
            <Card.Text>
              <span>File Name: {selectedFile.name}</span>
            </Card.Text>
            <Card.Text>
              <span>File Type: {selectedFile.type}</span>
            </Card.Text>
            <Card.Text>
              <span>
                Last Modified: {selectedFile.lastModifiedDate.toDateString()}
              </span>
            </Card.Text>
          </Card.Body>
        </Card>
      );
    } else {
      return <span></span>;
    }
  };
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    event.target.value = null;
  };
  const uploadHandler = (event) => {
    if (selectedFile == null) return;

    const formData1 = new FormData();
    // formData.append('file', resumeUpload.resumeFile);
    formData1.append("productFile", selectedFile);
    formData1.append("productId", newProduct.productId);

    /*
    const formData = new FormData();
    formData.append("myFile", selectedFile, selectedFile.name);
    console.log(selectedFile);
    */

    axios
      .post(
        // "https://localhost:44379/api/Product/productFileUpload",
        "https://localhost:44379/api/Product/productFileUpload_",
        // formData,
        formData1,
        { headers: authenticationHeader() },
        {
          onUploadProgress: (progressEvent) => {
            setProgress((progressEvent.loaded / progressEvent.total) * 100);
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="cardHeader">
                  <i className="bi bi-person-plus-fill"></i>
                  &nbsp; Add - New Product
                </div>
                {addProductResponse &&
                addProductResponse.responseCode !== 200 ? (
                  <div className="addProductError">
                    {addProductResponse.responseMessage}
                  </div>
                ) : (
                  <div className="addProductSuccess">
                    {addProductResponse.responseMessage}
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
                          Add-New-Product
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
          <div className="col-md-6 mx-auto">
            {newProduct && (
              <div>
                <div>Product # {newProduct.productId}</div>
                <div>Product Name {newProduct.productName}</div>

                <p></p>
                <div>
                  <h3>Upload Product Image</h3>
                  <input type="file" onChange={onFileChange} />

                  <button
                    className="btn btn-block btn-info"
                    onClick={uploadHandler}
                  >
                    Upload Image Now!
                  </button>
                </div>
                <p></p>
                {fileData()}
                <p></p>
                {progress > 0 ? (
                  <div
                    className={
                      progress < 100 ? "progressRunning" : "progressComplete"
                    }
                  >
                    <h3>File Upload Status</h3>
                    <p></p>
                    {progress}
                  </div>
                ) : (
                  <div></div>
                )}
                <p></p>
                <div className={statusFlag > 0 ? "errorClass" : "successClass"}>
                  {status}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

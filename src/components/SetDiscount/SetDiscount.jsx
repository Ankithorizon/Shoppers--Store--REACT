import React, { useState, useEffect, useRef } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { toast } from "react-toastify";

import { useSearchParams } from "react-router-dom";

const SetDiscount = () => {
  let navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [searchParams] = useSearchParams();
  const [productId, setProductId] = useState(0);
  const [product, setProduct] = useState(undefined);
  const re = /^\d*\.?\d*$/;

  const [discountResponse, setDiscountResponse] = useState({});

  // form
  const [form, setForm] = useState(undefined);
  const [errors, setErrors] = useState({});

  const [discountedPrice, setDiscountedPrice] = useState(0);

  // reset form
  // form reference
  const formRef = useRef(null);

  // check for 401
  const unAuthHandler401 = (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      navigate("/un-auth");
      // window.location.reload();
    } else {
      console.log("Error!");
    }
  };

  const productImageUploadURL = {
    url: "https://localhost:44379/Files",
  };

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
        if (currRole === null || (currRole !== null && currRole !== "Manager"))
          navigate("/un-auth");
        else {
          getCategories();
          getProduct(selectedProductId);
        }
      }
    }

    return () => {};
  }, [productId]);

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

  // get product
  const getProduct = (id) => {
    resetErrors();
    ProductService.getProduct(id)
      .then((response) => {
        console.log(response.data);
        setProduct({
          ...response.data,
        });

        setForm({
          currentDiscountPercentage: response.data.currentDiscountPercentage,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const discountSuccessOptions = {
    autoClose: 2000,
    type: toast.TYPE.SUCCESS,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
  };
  const discountErrorOptions = {
    autoClose: 2000,
    type: toast.TYPE.ERROR,
    hideProgressBar: false,
    position: toast.POSITION.TOP_RIGHT,
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
    const { currentDiscountPercentage } = form;
    const newErrors = {};

    const re = /^\d*\.?\d*$/;
    if (
      !currentDiscountPercentage ||
      currentDiscountPercentage === "" ||
      currentDiscountPercentage === undefined
    )
      newErrors.currentDiscountPercentage = "Discount is Required!";
    else {
      if (re.test(currentDiscountPercentage)) {
        if (currentDiscountPercentage <= 0) {
          newErrors.currentDiscountPercentage = "Discount must be >= 0";
        }
      } else {
        newErrors.currentDiscountPercentage = "Numbers only!";
      }
    }

    return newErrors;
  };
  const goBack = () => {
    navigate("/view-products");
  };
  const resetErrors = () => {
    setDiscountResponse({});
    setErrors({});
  };

  const nowPriceWithDiscount = (e) => {
    if (form.currentDiscountPercentage > 0) {
      var currentDiscount = form.currentDiscountPercentage;
      var discountedPrice_ =
        product.price - (product.price * currentDiscount) / 100;

      var discountedPrice__ = Math.round(discountedPrice_ * 100) / 100;

      setDiscountedPrice(discountedPrice__);
    } else {
      setDiscountedPrice(0);
    }
  };

  const handleSubmit = (e) => {
    setDiscountResponse({});

    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      console.log(form);

      var productDiscountDTO = {
        productId: product.productId,
        discountPercentage: Number(form.currentDiscountPercentage),
      };

      var discountResponse_ = {};
      ProductService.setProductDiscount(productDiscountDTO)
        .then((response) => {
          if (response.data.apiResponse.responseCode === 0) {
            discountResponse_ = {
              responseCode: response.data.apiResponse.responseCode,
              responseMessage: response.data.apiResponse.responseMessage,
            };
            setDiscountResponse(discountResponse_);
            toast(
              response.data.apiResponse.responseMessage,
              discountSuccessOptions
            );

            setTimeout(() => {
              setDiscountedPrice(0);
              formRef.current.reset();
              setForm({});
              navigate("/view-products");
            }, 3000);
          }
        })
        .catch((e) => {
          console.log(e);
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
                  &nbsp; Set - Discount
                  {product && (
                    <div className="discountProductId">
                      Product ID # {product.productId}
                    </div>
                  )}
                </div>
                {discountResponse && discountResponse.responseCode !== 0 ? (
                  <div className="discountError">
                    {discountResponse.responseMessage}
                  </div>
                ) : (
                  <div className="discountSuccess">
                    {discountResponse.responseMessage}
                  </div>
                )}
              </div>
              {product && (
                <div className="card-body">
                  <Form ref={formRef}>
                    <div className="row">
                      <div className="col-sm-1"></div>
                      <div className="col-sm-10">
                        <div className="row">
                          <div className="col-sm-3 colTitle">Discount : </div>
                          <div className="col-sm-6">
                            <Form.Group controlId="discount">
                              <Form.Control
                                value={form.currentDiscountPercentage}
                                type="text"
                                isInvalid={!!errors.currentDiscountPercentage}
                                onChange={(e) =>
                                  setField(
                                    "currentDiscountPercentage",
                                    e.target.value
                                  )
                                }
                                onBlur={(e) => nowPriceWithDiscount(e)}
                              />
                              <Form.Control.Feedback
                                type="invalid"
                                className="errorDisplay"
                              >
                                {errors.currentDiscountPercentage}
                              </Form.Control.Feedback>
                            </Form.Group>
                            {discountedPrice > 0 && (
                              <div className="discountedPrice">
                                NOW ${discountedPrice}
                              </div>
                            )}
                          </div>
                          <div className="col-sm-3"></div>
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
                            Set-Discount
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
            {product && (
              <div className="productContainer">
                <div className="row">
                  <div className="col-sm-8 productDetails">
                    <div>Product # {product.productId}</div>
                    <div>
                      Product : {product.productName}
                      <span>
                        {categories &&
                          categories.length > 0 &&
                          product.categoryId > 0 && (
                            <span>
                              &nbsp;[
                              {ProductService.getCategoryName(
                                categories,
                                product.categoryId
                              )}
                              ]
                            </span>
                          )}
                      </span>
                    </div>
                    <div>Price : ${product.price}</div>
                    <div>
                      Current Discount : {product.currentDiscountPercentage}%
                    </div>
                    {product.productDesc && (
                      <div>Desc : {product.productDesc}</div>
                    )}
                  </div>
                  {product.productImage && (
                    <div className="col-sm-4 newProductImage">
                      <img
                        height="100"
                        width="100"
                        src={`${productImageUploadURL.url}/${product.productImage}`}
                        alt="Product Image"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetDiscount;

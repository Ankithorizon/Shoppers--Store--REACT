import React, { useState, useEffect } from "react";
import "./style.css";
import Button from "react-bootstrap/Button";
import ProductService from "../../../services/product.service";
import AuthenticationService from "../../../services/authentication.service";
import { useNavigate } from "react-router-dom";
import "./style.css";

const ProductDetails = ({ product, categories, action }) => {
  let navigate = useNavigate();
  const productFilePath = "https://localhost:44379/Files/";

  const [userRole, setUserRole] = useState("");

  const [resetDisRes, setResetDisRes] = useState("");
  const [resetDisClass, setResetDisClass] = useState("");

  useEffect(() => {
    console.log(product);

    var currRole = AuthenticationService.getCurrentUserRole();
    if (currRole === null || (currRole !== null && currRole === "Shopper"))
      navigate("/un-auth");
    else {
      setUserRole(currRole);
    }
  }, []);

  const editProduct = () => {
    navigate("/edit-product?id=" + product.productId);
  };

  const setDiscount = () => {
    navigate("/set-discount?id=" + product.productId);
  };

  const resetDiscount = () => {
    setResetDisRes("");
    setResetDisClass("");
    ProductService.resetProductDiscount(product.productId)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setResetDisRes("Reset-Discount Success !");
          setResetDisClass("discountSuccess");

          // update product through master component
          var product_ = {
            ...product,
            currentDiscountPercentage: 0,
            currentPrice: product.price,
          };

          setTimeout(() => {
            setResetDisRes("");
            setResetDisClass("");

            // notify master view-products component
            action(product_);
          }, 3000);
        }
      })
      .catch((e) => {
        console.log(e);
        setResetDisClass("discountError");
        if (e.response.status === 500) {
          setResetDisRes(e.response.data);
        } else {
          setResetDisRes("Error !");
        }
        setTimeout(() => {
          setResetDisRes("");
          setResetDisClass("");
        }, 3000);
      });
  };
  return (
    <div className="card">
      <div className="card-header">
        <div className="cardHeader">[VIEW] Product</div>
      </div>

      <div className="card-body">
        <h5>
          [# {product.productId}] [
          {ProductService.getCategoryName(categories, product.categoryId)}]
        </h5>
        <h5>Name : {product.productName}</h5>
        <h5>Description : {product.productDesc}</h5>
        <h5>
          Price : <span className="price">${product.price}&nbsp;&nbsp;</span>
          {product.currentDiscountPercentage > 0 && (
            <span className="nowPrice">NOW ${product.currentPrice}</span>
          )}
        </h5>
        <div>
          {product.productImage ? (
            <span>
              <img
                width="100"
                height="100"
                src={`${productFilePath}/${product.productImage}`}
                alt="Product Image"
              />
            </span>
          ) : (
            <span className="noImage">NO IMAGE</span>
          )}
        </div>
        <hr />

        {userRole === "Admin" && (
          <div>
            <Button
              className="btn btn-info editBtn"
              type="button"
              onClick={(e) => editProduct()}
            >
              <i className="bi bi-pencil-square"></i>&nbsp;&nbsp;Edit
            </Button>
          </div>
        )}
        {userRole === "Manager" && (
          <div>
            <Button
              className="btn btn-info"
              type="button"
              onClick={(e) => setDiscount()}
            >
              <i className="bi bi-chevron-double-down"></i>&nbsp;&nbsp;Set
              Discount
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              className="btn btn-info"
              type="button"
              onClick={(e) => resetDiscount()}
            >
              <i className="bi bi-x-octagon"></i>&nbsp;&nbsp; Reset Discount
            </Button>
            <p></p>
            {resetDisRes && <div className={resetDisClass}>{resetDisRes}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

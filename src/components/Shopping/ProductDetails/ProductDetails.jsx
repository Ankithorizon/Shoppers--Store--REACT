import React, { useState, useEffect } from "react";
import "./style.css";
import Button from "react-bootstrap/Button";
import ProductService from "../../../services/product.service";
import AuthenticationService from "../../../services/authentication.service";
import { useNavigate } from "react-router-dom";
import "./style.css";
import Form from "react-bootstrap/Form";

const ProductDetails = ({ product, categories, action }) => {
  let navigate = useNavigate();
  const productFilePath = "https://localhost:44379/Files/";

  const [qty, setQty] = useState(1);
  useEffect(() => {
    console.log(product);
    setQty(1);
  }, [product]);

  const addToCart = () => {
    console.log("adding product #", product.productId, qty);
    if (qty < 0) {
      setQty(0);
      return;
    } else {
        var cart = {
            product: product,
            qty : Number(qty)
        };
        action(cart);
    }
  };
  return (
    <div className="card">
      <div className="card-header">
        <div className="cardHeader">
          <h5>
            {/* [# {product.productId}] */}
            {ProductService.getCategoryName(categories, product.categoryId)}
          </h5>
        </div>
      </div>

      <div className="card-body">
        <h6>Name : {product.productName}</h6>
        <h6>Description : {product.productDesc}</h6>
        <h6>
          Price : <span className="price">${product.price}&nbsp;&nbsp;</span>
          {product.currentDiscountPercentage > 0 && (
            <span className="nowPrice">
              NOW ${product.currentPrice}
              &nbsp;&nbsp;&nbsp;[Discount {product.currentDiscountPercentage}%]
            </span>
          )}
        </h6>
        <div className="row">
          <div className="col-sm-6">
            {product.productImage ? (
              <div>
                <img
                  width="100"
                  height="100"
                  src={`${productFilePath}/${product.productImage}`}
                  alt="Product Image"
                />
              </div>
            ) : (
              <div className="noImage">NO IMAGE</div>
            )}
          </div>
          <div className="col-sm-6 addCartBtn">
            <div className="row">
              <div className="col-sm-5 qty">
                <Form.Control
                  value={qty}
                  pattern="[0-9]*"
                  type="number"
                  onChange={(e) => setQty(e.target.value)}
                />
              </div>
              <div className="col-sm-7">
                <Button
                  className="btn btn-info"
                  type="button"
                  onClick={(e) => addToCart(e)}
                >
                  Add &nbsp;&nbsp;<i className="bi bi-cart4"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

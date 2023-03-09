import React from "react";
import "./style.css";
import Button from "react-bootstrap/Button";
import ProductService from "../../../services/product.service";

const ProductDetails = ({ product, categories }) => {
  const productFilePath = "https://localhost:44379/Files/";

  const editProduct = () => {};
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
          Price : <span className="price">${product.price}</span>
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
        <div>
          <Button
            className="btn btn-info"
            type="button"
            onClick={(e) => editProduct(product)}
          >
            <i className="bi bi-pencil-square"></i>&nbsp;&nbsp;Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

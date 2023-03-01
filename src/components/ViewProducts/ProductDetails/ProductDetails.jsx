import React from "react";

const ProductDetails = ({ product }) => {
  const productFilePath = "https://localhost:44379/Files/";
  return (
    <div>
      <h5>Name : {product.productName}</h5>
      <h5>Description : {product.productDesc}</h5>
      <h5>Price : {product.price}</h5>
      <div>
        {product.productImage ? (
          <span>
            <img
              width="50"
              height="50"
              src={`${productFilePath}/${product.productImage}`}
              alt="Product Image"
            />
          </span>
        ) : (
          <span className="noImage">NO IMAGE</span>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;

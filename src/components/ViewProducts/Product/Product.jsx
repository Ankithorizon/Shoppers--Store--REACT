import React from "react";

const Product = ({
  productId,
  productName,
  price,
  currentPrice,
  productImage,
  productFileId,
}) => {
  const productFilePath = "https://localhost:44379/Files/";

  return (
    <div className="row">
      <div className="col-sm-1">{productId}</div>
      <div className="col-sm-6">{productName}</div>
      <div className="col-sm-2">
        ${price}
        {price !== currentPrice ? (
          <span className="displayCurrentPriceInTable">
            &nbsp;<u>[ NOW: ${currentPrice} ]</u>
          </span>
        ) : (
          <span></span>
        )}
      </div>
      <div className="col-sm-3">
        {productImage ? (
          <span>
            <img
              width="50"
              height="50"
              src={`${productFilePath}/${productImage}`}
              alt="Product Image"
            />
          </span>
        ) : (
          <span>{productFileId} : NO IMAGE</span>
        )}
      </div>
    </div>
  );
};

export default Product;

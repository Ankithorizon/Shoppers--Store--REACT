import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Product from "./Product/Product";
import ProductDetails from "./ProductDetails/ProductDetails";

const ViewProducts = () => {
  let navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // paging
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(3);
  const [totalPages, setTotalPages] = useState(0);
  const [pageData, setPageData] = useState([]);

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();
    if (currRole === null || (currRole !== null && currRole !== "Admin"))
      navigate("/un-auth");
    else allProducts();
  }, []);

  // check for 401
  const unAuthHandler401 = (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      navigate("/un-auth");
      // window.location.reload();
    } else {
      console.log("Error!");
    }
  };

  // paging
  const getPageData = (myData) => {
    var pageData_ = [];

    let lastIndex = currentPage * recordsPerPage - 1;
    let beginIndex = lastIndex - recordsPerPage + 1;
    for (let r = beginIndex; r <= lastIndex; r++) {
      if (myData[r] !== undefined) pageData_.push(myData[r]);
    }
    setPageData([...pageData_]);
  };

  const allProducts = () => {
    ProductService.allProducts()
      .then((response) => {
        setProducts(response.data);

        // paging
        if (response.data.length > 0) {
          setTotalPages(Math.ceil(response.data.length / recordsPerPage));
          getPageData(response.data);
        } else {
          setTotalPages(0);
        }
      })
      .catch((e) => {
        setProducts(null);

        if (e.response.status === 400) {
          console.log(e.response.statusText);
        } else {
          unAuthHandler401(e);
        }
      });
  };

  // this will update [this] master component when [Product] detail component notify
  // through event
  const updateMasterComponent_SelectedProductChanged = (selectedProduct) => {
    console.log("master is called from child", selectedProduct);
    setSelectedProduct(selectedProduct);
  };

  // no paging
  // display all data
  let displayData = () => {
    return (
      <div className="data">
        {products &&
          products.map((d, index) => (
            <div className="rowStyle" key={index}>
              <Product
                product={d}
                action={updateMasterComponent_SelectedProductChanged}
              ></Product>
              <hr />
            </div>
          ))}
      </div>
    );
  };

  // paging display data
  let displayPageData = () => {
    return (
      <div className="data">
        {pageData &&
          pageData.map((d, index) => (
            <div className="rowStyle" key={index}>
              <Product
                product={d}
                action={updateMasterComponent_SelectedProductChanged}
              ></Product>
              <hr />
            </div>
          ))}
      </div>
    );
  };
  // paging next
  const nextPage = () => {
    if (currentPage + 1 > totalPages) return;
    else {
      setCurrentPage(currentPage + 1);

      var pageData_ = [];
      let lastIndex = (currentPage + 1) * recordsPerPage - 1;
      let beginIndex = lastIndex - recordsPerPage + 1;
      for (let r = beginIndex; r <= lastIndex; r++) {
        if (products[r] !== undefined) pageData_.push(products[r]);
      }
      setPageData([...pageData_]);
    }
  };
  // paging previous
  const previousPage = () => {
    if (currentPage - 1 === 0) return;
    else {
      setCurrentPage(currentPage - 1);

      var pageData_ = [];
      let lastIndex = (currentPage - 1) * recordsPerPage - 1;
      let beginIndex = lastIndex - recordsPerPage + 1;
      for (let r = beginIndex; r <= lastIndex; r++) {
        if (products[r] !== undefined) pageData_.push(products[r]);
      }
      setPageData([...pageData_]);
    }
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="cardHeader">
                  <i className="bi bi-binoculars-fill"></i>
                  &nbsp; Products
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-4">
                    <Button
                      className="btn btn-info"
                      type="button"
                      onClick={(e) => previousPage(e)}
                    >
                      Previous
                    </Button>
                  </div>
                  <div className="col-sm-4">
                    <h3>
                      Page : {currentPage} of {totalPages}
                    </h3>
                  </div>
                  <div className="col-sm-4">
                    <Button
                      className="btn btn-info"
                      type="button"
                      onClick={(e) => nextPage(e)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <hr />
                {products && (
                  <div>
                    <div className="row tableHeader">
                      <div className="col-sm-1">#</div>
                      <div className="col-sm-3">Name</div>
                      <div className="col-sm-2">Price</div>
                      <div className="col-sm-3">Image</div>
                      <div className="col-sm-3"></div>
                    </div>
                    {/* {displayData()} */}
                    {displayPageData()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 mx-auto">
            {selectedProduct && (
              <div className="content">
                <ProductDetails product={selectedProduct}></ProductDetails>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;

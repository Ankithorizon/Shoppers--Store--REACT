import React, { useState, useEffect } from "react";
import "./style.css";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";
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

  // filter
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [searchProductName, setSearchProductName] = useState("");

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();
    if (currRole === null || (currRole !== null && currRole === "Shopper"))
      navigate("/un-auth");
    else {
      allProducts();
      getCategories();
    }
  }, []);

  // categories
  // filter
  const getCategories = () => {
    ProductService.getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((e) => {
        setCategories(null);
        if (e.response.status === 400) {
          console.log(e.response.statusText);
        } else {
          unAuthHandler401(e);
        }
      });
  };

  // filter
  // category
  const onChangeCategory = (event) => {
    setCurrentPage(1);
    setTotalPages("?");
    setSelectedCategoryId(event.target.value);
  };
  // filter
  // product-name
  const onChangeProductName = (e) => {
    setCurrentPage(1);
    setTotalPages("?");
    setSearchProductName(e.target.value);
  };
  // filter
  const searchingProduct = () => {
    setSelectedProduct(null);

    ProductService.findingProduct(searchProductName, selectedCategoryId)
      .then((response) => {
        if (response.data.length > 0) {
          setProducts(response.data);

          setTotalPages(Math.ceil(response.data.length / recordsPerPage));
          getPageData(response.data);
        } else {
          setProducts(null);
          setTotalPages(0);
        }
      })
      .catch((e) => {
        console.log(e);
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

  // this will update [this] master component when [Product] detail component notify
  // through event
  const updateMasterComponent_After_Reset_Discount = (
    selectedProductAfterResetDiscount
  ) => {
    console.log(
      "master is called from child",
      selectedProductAfterResetDiscount
    );
    setSelectedProduct(selectedProductAfterResetDiscount);
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

  // categories
  // filter
  let categoryList =
    categories &&
    categories.length > 0 &&
    categories.map((item, i) => {
      return (
        <option key={i} value={item.categoryId}>
          {item.categoryName}
        </option>
      );
    }, this);
  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-7 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="cardHeader">
                  <i className="bi bi-binoculars-fill"></i>
                  &nbsp; View - Products
                </div>
                <div className="filter row filterControls">
                  <div className="col-sm-4">
                    <Card.Text>
                      <select
                        style={{
                          width: 180,
                          height: 32,
                          borderColor: "green",
                          borderWidth: 3,
                          borderRadius: 10,
                          color: "green",
                        }}
                        id="categoryId"
                        value={selectedCategoryId}
                        name="selectedCategoryId"
                        onChange={(e) => onChangeCategory(e, 1)}
                      >
                        <option value="">---Search By Category---</option>
                        {categoryList}
                      </select>
                    </Card.Text>
                  </div>
                  <div className="col-sm-6">
                    <Card.Text>
                      <input
                        style={{
                          width: 250,
                          height: 32,
                          borderColor: "green",
                          borderWidth: 3,
                          borderRadius: 10,
                          color: "green",
                        }}
                        type="text"
                        className="form-control"
                        placeholder="Search By Product Name/Desc..."
                        value={searchProductName}
                        onChange={(e) => onChangeProductName(e)}
                      />
                    </Card.Text>
                  </div>
                  <div className="col-sm-2">
                    <Button
                      className="btn btn-success filterBtn"
                      type="button"
                      onClick={(e) => searchingProduct(e)}
                    >
                      <i className="bi bi-search"></i>
                    </Button>
                  </div>
                </div>
              </div>
              {products ? (
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-4">
                      <Button
                        disabled={totalPages === "?"}
                        className="btn btn-info navBtn"
                        type="button"
                        onClick={(e) => previousPage(e)}
                      >
                        <i className="bi bi-caret-left-square-fill"></i>
                        &nbsp;Previous&nbsp;
                        <i className="bi bi-caret-left-square-fill"></i>
                      </Button>
                    </div>
                    <div className="col-sm-4">
                      <h6>
                        Page : {currentPage} of {totalPages}
                      </h6>
                    </div>
                    <div className="col-sm-4">
                      <Button
                        disabled={totalPages === "?"}
                        className="btn btn-info navBtn"
                        type="button"
                        onClick={(e) => nextPage(e)}
                      >
                        <i className="bi bi-caret-right-square-fill"></i>
                        &nbsp;Next&nbsp;
                        <i className="bi bi-caret-right-square-fill"></i>
                      </Button>
                    </div>
                  </div>
                  <hr />
                  {products && (
                    <div>
                      <div className="row tableHeader">
                        <div className="col-sm-1">#</div>
                        <div className="col-sm-3">Name</div>
                        <div className="col-sm-3">Price</div>
                        <div className="col-sm-3">Image</div>
                        <div className="col-sm-2"></div>
                      </div>
                      {/* {displayData()} */}
                      {displayPageData()}
                    </div>
                  )}
                </div>
              ) : (
                <div className="card-body noData">Products Not Found!</div>
              )}
            </div>
          </div>
          <div className="col-md-5 mx-auto">
            {selectedProduct && (
              <div className="content">
                <ProductDetails
                  categories={categories}
                  product={selectedProduct}
                  action={updateMasterComponent_After_Reset_Discount}
                ></ProductDetails>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;

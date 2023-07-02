import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthenticationService from "../../services/authentication.service";
import ReportDataService from "../../services/report.service";

import { useNavigate } from "react-router";

// drop down  select list with image+text
// npm install react-select@^5.1.0
import Select from "react-select";
import MonthlyProductWiseReport from "./MonthlyProductWiseReport/MonthlyProductWiseReport";
import MonthlyStoreWiseReport from "./MonthlyStoreWiseReport/MonthlyStoreWiseReport";
import SelectedProductWiseReport from "./SelectedProductWiseReport/SelectedProductWiseReport";

const TextReports = () => {
  let navigate = useNavigate();

  const productImageUploadURL = {
    url: "https://localhost:44379/Files",
  };

  // checkbox
  const [reportTypeError, setReportTypeError] = useState("");
  const [isTextReport, setIsTextReport] = useState(false);
  const [isChartReport, setIsChartReport] = useState(false);

  const [reportOption, setReportOption] = useState("MonthlyProductWise");
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([2021, 2022, 2023, 2024]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productError, setProductError] = useState("");

  const [reportData, setReportData] = useState([]);
  const [reportTitle, setReportTitle] = useState("");

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();

    if (currRole === null || (currRole !== null && currRole !== "Manager"))
      navigate("/un-auth");
    else {
      getProductsWithImage();
    }
  }, []);

  const getProductsWithImage = () => {
    ReportDataService.getProductsWithImage()
      .then((response) => {
        // console.log(response.data);

        // x-fer
        var options1_ = [];
        response.data.map((item, i) => {
          console.log(item.productName);
          var option = {
            value: item.productId + "-" + item.productName,
            label: (
              <div>
                <img
                  width="35"
                  height="35"
                  src={`${productImageUploadURL.url}/${item.productImage}`}
                  alt="N/A"
                />
                <span> - </span>
                <span>{item.productName}</span>
                <span> - </span>
                <span>[ $ {item.currentPrice} ]</span>
              </div>
            ),
          };
          options1_.push(option);
        });
        setProducts(options1_);
      })
      .catch((e) => {
        this.unAuthHandler401(e);
      });
  };

  const months_ = Array.from({ length: 12 }, (e, i) => {
    return {
      monthName: new Date(null, i + 1, null).toLocaleDateString("en", {
        month: "long",
      }),
      monthId: i + 1,
    };
  });

  const setField = (field, value) => {
    setReportTitle("");

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

  const selectedProductChanged = (selectedOption) => {
    setReportTitle("");

    var productId = selectedOption.value.substring(
      0,
      selectedOption.value.indexOf("-")
    );
    var productName = selectedOption.value.substring(
      selectedOption.value.indexOf("-") + 1
    );

    setSelectedProduct({
      ...selectedOption,
      productId: productId,
      productName: productName,
    });
    setProductError("");
  };

  const checkForSelectedProductError = (selectedProduct, reportOption) => {
    if (
      reportOption !== "MonthlyStoreWise" &&
      (selectedProduct === null || selectedProduct === undefined)
    ) {
      return true;
    } else return false;
  };

  const checkForMonthError = (reportOption, month) => {
    if (reportOption === "SelectedProductWise" && (!month || month === ""))
      return true;
    else return false;
  };

  const checkForYearError = (year) => {
    if (!year || year === "") return true;
    else return false;
  };

  const checkForReportTypes = () => {
    if (!isTextReport && !isChartReport) return false;
    else return true;
  };
  const findFormErrors = () => {
    const { month, year } = form;
    const newErrors = {};

    if (!checkForReportTypes()) setReportTypeError("Report-Type is Required!");
    else setReportTypeError("");

    if (checkForSelectedProductError(selectedProduct, reportOption))
      setProductError("Product is Required!");
    else setProductError("");

    if (checkForMonthError(reportOption, month))
      newErrors.month = "Month is Required!";
    else {
      var key = "month";
      delete newErrors[key];
    }

    if (checkForYearError(year)) newErrors.year = "Year is Required!";
    else {
      var key = "year";
      delete newErrors[key];
    }

    return newErrors;
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
  };

  const reportOptionChange = (event) => {
    setReportOption(event.target.value);
    // setReportData([]);
    setReportData(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setReportData([]);
    setReportTitle("");

    const newErrors = findFormErrors();

    if (
      Object.keys(newErrors).length > 0 ||
      productError ||
      (!isTextReport && !isChartReport)
    ) {
      console.log("error!");
      setErrors(newErrors);
    } else {
      setErrors([]);

      console.log(
        isTextReport,
        isChartReport,
        reportOption,
        form.month,
        form.year,
        selectedProduct
      );

      // MonthlyStoreWise
      // i/p: year
      if (reportOption === "MonthlyStoreWise") {
        var data = prepareDataForMonthlyStoreWiseReport();
        console.log(data);

        // api call to get report data for this option
        apiCall_MonthlyStoreWiseReport(data);
      }

      // MonthlyProductWise
      // i/p: year, product
      if (reportOption === "MonthlyProductWise" && selectedProduct !== null) {
        var data = prepareDataForMonthlyProductWiseReport();
        console.log(data);

        // api call to get report data for this option
        apiCall_MonthlyProductWiseReport(data);
      }

      // SelectedProductWise
      // i/p: year, month, product
      if (reportOption === "SelectedProductWise" && selectedProduct !== null) {
        var data = prepareDataForSelectedProductWiseReport();
        console.log(data);

        // api call to get report data for this option
        apiCall_SelectedProductWiseReport(data);
      }
    }
  };

  const renderOptionsForMonths = () => {
    return months_.map((dt, i) => {
      return (
        <option value={dt.monthId} key={i} name={dt.monthId}>
          {dt.monthName}
        </option>
      );
    });
  };

  const renderOptionsForYears = () => {
    return years.map((dt, i) => {
      return (
        <option value={dt} key={i} name={dt}>
          {dt}
        </option>
      );
    });
  };

  // MonthlyStoreWise
  // i/p: year
  const prepareDataForMonthlyStoreWiseReport = () => {
    var data = {
      selectedYear: form.year, // ip
    };
    return data;
  };
  // MonthlyStoreWise
  // i/p: year
  const apiCall_MonthlyStoreWiseReport = (data) => {
    ReportDataService.monthlyStoreWise(data)
      .then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          console.log(response.data);
          setReportData([...response.data]);
          setReportTitle("Monthly-Store-Wise Report");
        } else {
          setReportData([]);
          setReportTitle("Monthly-Store-Wise Report");
          console.log("Monthly-Store wise Sales Data Not Found !");
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          console.log("Bad Request !");
        } else {
          console.log("Server Error !");
        }
      });
  };

  // MonthlyProductWise
  // i/p: year, product
  const prepareDataForMonthlyProductWiseReport = () => {
    var data = {
      selectedYear: form.year, // ip
      selectedProductId: Number(selectedProduct.productId), // ip
    };
    return data;
  };
  // MonthlyProductWise
  // i/p: year, product
  const apiCall_MonthlyProductWiseReport = (data) => {
    ReportDataService.monthlyProductWise(data)
      .then((response) => {
        console.log(response);

        if (response.data.length > 0) {
          console.log(response.data);
          setReportData([...response.data]);
          setReportTitle("Monthly-Product-Wise Report");
        } else {
          setReportData([]);
          setReportTitle("Monthly-Product-Wise Report");
          console.log("Monthly-Product wise Sales Data Not Found !");
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          console.log("Bad Request !");
        } else {
          console.log("Server Error !");
        }
      });
  };

  // SelectedProductWise
  // i/p: year, month, product
  const prepareDataForSelectedProductWiseReport = () => {
    var data = {
      selectedYear: Number(form.year), // ip
      selectedMonth: Number(form.month), // ip
      selectedProductId: Number(selectedProduct.productId), // ip
    };
    console.log(data);
    return data;
  };
  // SelectedProductWise
  // i/p: year, month, product
  const apiCall_SelectedProductWiseReport = (data) => {
    ReportDataService.selectedProductWise(data)
      .then((response) => {
        console.log(response);

        setReportData([...response.data]);
        setReportTitle("Selected-Product-Wise Report");
        if (response.data.length > 0) {
          console.log(response.data);
        } else {
          console.log("Selected-Product wise Sales Data Not Found !");
        }
        console.log(reportData);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          console.log("Bad Request !");
        } else {
          console.log("Server Error !");
        }
      });
  };

  const textReportHandler = () => {
    setIsTextReport(!isTextReport);
  };
  const chartReportHandler = () => {
    setIsChartReport(!isChartReport);
  };

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="cardHeader">
                  <i className="bi bi-body-text"></i>
                  &nbsp; Report Options!
                </div>
              </div>
              <div className="card-body">
                <div className="reportsContainer">
                  <div className="reportsDiv">
                    <input
                      type="checkbox"
                      id="checkboxText"
                      checked={isTextReport}
                      onChange={textReportHandler}
                    />
                    &nbsp;<label htmlFor="checkboxText">TEXT Report</label>
                    <br />
                    <input
                      type="checkbox"
                      id="checkboxChart"
                      checked={isChartReport}
                      onChange={chartReportHandler}
                    />
                    &nbsp;<label htmlFor="checkboxChart">CHART Report</label>
                  </div>
                  {reportTypeError && (
                    <div className="errorDisplay">{reportTypeError}</div>
                  )}
                </div>
                <p></p>
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-sm-11">
                      <div className="radio">
                        <label>
                          <input
                            type="radio"
                            value="MonthlyProductWise"
                            checked={reportOption === "MonthlyProductWise"}
                            onChange={reportOptionChange}
                          />
                          &nbsp;&nbsp;&nbsp;[Monthly]-Product-Wise
                        </label>
                      </div>
                      <div className="radio">
                        <label>
                          <input
                            type="radio"
                            value="MonthlyStoreWise"
                            checked={reportOption === "MonthlyStoreWise"}
                            onChange={reportOptionChange}
                          />
                          &nbsp;&nbsp;&nbsp;[Monthly]-Store-Wise
                        </label>
                      </div>
                      <div className="radio">
                        <label>
                          <input
                            type="radio"
                            value="SelectedProductWise"
                            checked={reportOption === "SelectedProductWise"}
                            onChange={reportOptionChange}
                          />
                          &nbsp;&nbsp;&nbsp;Selected Product-Wise
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <p></p>
                  <div className="row">
                    <div className="col-sm-6">
                      <Form.Group controlId="month">
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.month}
                          onChange={(e) => {
                            setField("month", e.target.value);
                          }}
                        >
                          <option value="">Choose Month</option>
                          {renderOptionsForMonths()}
                        </Form.Control>
                        <Form.Control.Feedback
                          type="invalid"
                          className="errorDisplay"
                        >
                          {errors.month}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-sm-6">
                      <Form.Group controlId="year">
                        <Form.Control
                          as="select"
                          isInvalid={!!errors.year}
                          onChange={(e) => {
                            setField("year", e.target.value);
                          }}
                        >
                          <option value="">Choose Year</option>
                          {renderOptionsForYears()}
                        </Form.Control>
                        <Form.Control.Feedback
                          type="invalid"
                          className="errorDisplay"
                        >
                          {errors.year}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
                  <p></p>
                  <div className="row">
                    <div>
                      <Select
                        placeholder="---Product---"
                        isInvalid={selectedProduct === null}
                        value={selectedProduct}
                        onChange={selectedProductChanged}
                        options={products}
                        hideSelectedOptions={false}
                      />
                      {productError && (
                        <div className="errorDisplay">{productError}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-2"></div>
                      <div className="col-sm-8 textReportBtn">
                        <Button
                          className="btn btn-success"
                          type="button"
                          onClick={(e) => handleSubmit(e)}
                        >
                          Get Text Report!
                        </Button>
                      </div>
                      <div className="col-sm-2"></div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="col-md-8 mx-auto">
            {reportData &&
              ((reportTitle !== "Selected-Product-Wise Report" &&
                isTextReport) ||
                isChartReport) && (
                <div>
                  {reportTitle === "Monthly-Product-Wise Report" && (
                    <MonthlyProductWiseReport
                      title={reportTitle}
                      year={form.year}
                      productName={selectedProduct.productName}
                      reportData={reportData}
                      displayTextReport={isTextReport}
                      displayChartReport={isChartReport}
                    ></MonthlyProductWiseReport>
                  )}

                  {reportTitle === "Monthly-Store-Wise Report" && (
                    <MonthlyStoreWiseReport
                      title={reportTitle}
                      year={form.year}
                      reportData={reportData}
                      displayTextReport={isTextReport}
                      displayChartReport={isChartReport}
                    ></MonthlyStoreWiseReport>
                  )}

                  {reportTitle === "Selected-Product-Wise Report" && (
                    <SelectedProductWiseReport
                      title={reportTitle}
                      year={form.year}
                      month={ReportDataService.getMonthNameFromMonthNumber(
                        form.month
                      )}
                      productName={selectedProduct.productName}
                      reportData={reportData}
                    ></SelectedProductWiseReport>
                  )}
                </div>
              )}

            {reportData &&
              reportTitle === "Selected-Product-Wise Report" &&
              isTextReport && (
                <div>
                  <SelectedProductWiseReport
                    title={reportTitle}
                    year={form.year}
                    month={ReportDataService.getMonthNameFromMonthNumber(
                      form.month
                    )}
                    productName={selectedProduct.productName}
                    reportData={reportData}
                    displayTextReport={isTextReport}
                  ></SelectedProductWiseReport>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextReports;

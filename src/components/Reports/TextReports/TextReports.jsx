import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthenticationService from "../../../services/authentication.service";

import { useNavigate } from "react-router";

const TextReports = () => {
  let navigate = useNavigate();

  const [reportOption, setReportOption] = useState("YearlyProductWise");
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([2021, 2022, 2023, 2024]);

  const [reportData, setReportData] = useState([]);

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
  }, []);

  const months_ = Array.from({ length: 12 }, (e, i) => {
    return {
      monthName: new Date(null, i + 1, null).toLocaleDateString("en", {
        month: "long",
      }),
      monthId: i + 1,
    };
  });

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
    const { productId, month, year } = form;
    const newErrors = {};

    /*
    if (!productId || productId === "")
      newErrors.productId = "Product is Required!";
    */

    if (reportOption === "MonthlyTotalProductWise") {
      if (!month || month === "") newErrors.month = "Month is Required!";
    } else {
      var key = "month";
      delete newErrors[key];
    }

    if (reportOption !== "MonthlyTotalProductWise") {
      if (!year || year === "") newErrors.year = "Year is Required!";
    } else {
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
    setReportData([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors([]);
      console.log(reportOption, form.month, form.year);
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
  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="cardHeader">
                  <i className="bi bi-body-text"></i>
                  &nbsp; Text Report Options!
                </div>
              </div>
              <div className="card-body">
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-sm-11">
                      <div className="radio">
                        <label>
                          <input
                            type="radio"
                            value="YearlyProductWise"
                            checked={reportOption === "YearlyProductWise"}
                            onChange={reportOptionChange}
                          />
                          &nbsp;&nbsp;&nbsp;[Monthly]-Product-Wise
                        </label>
                      </div>
                      <div className="radio">
                        <label>
                          <input
                            type="radio"
                            value="MonthlyTotalStoreWise"
                            checked={reportOption === "MonthlyTotalStoreWise"}
                            onChange={reportOptionChange}
                          />
                          &nbsp;&nbsp;&nbsp;[Monthly]-Store-Wise
                        </label>
                      </div>
                      <div className="radio">
                        <label>
                          <input
                            type="radio"
                            value="MonthlyTotalProductWise"
                            checked={reportOption === "MonthlyTotalProductWise"}
                            onChange={reportOptionChange}
                          />
                          &nbsp;&nbsp;&nbsp;Selected Product-Month-Wise
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
          <div className="col-md-8 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default TextReports;

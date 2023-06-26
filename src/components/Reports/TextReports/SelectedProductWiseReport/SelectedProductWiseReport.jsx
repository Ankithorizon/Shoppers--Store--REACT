import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import "./style.css";
import { useState } from "react";

const SelectedProductWiseReport = ({
  title,
  year,
  month,
  productName,
  reportData,
}) => {
  const listItems =
    reportData.length > 0 &&
    reportData.map((d) => (
      <Button
        variant="success"
        style={{
          marginBottom: 15,
          marginRight: 5,
          width: 340,
          height: 200,
          borderColor: "black",
          borderWidth: 2,
          color: "black",
          backgroundColor: "lightblue",
        }}
        key={d.selectedMonth}
      >
        <div>
          {d.totalSales > 0 ? (
            <div>
              <h5>{month}</h5>
              <div>
                <h4>${d.totalSales}</h4>
              </div>
            </div>
          ) : (
            <div>
              {month}
              <br />${d.totalSales}
            </div>
          )}
        </div>
      </Button>
    ));

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="textReportHeader">
          <h2>Sales Report</h2>
          {title}
          <div className="productInfo">
            {productName.toUpperCase()} Sales in [{month}, {year}]
          </div>
        </div>
        <p></p>
        {listItems}
      </div>
    </div>
  );
};

export default SelectedProductWiseReport;
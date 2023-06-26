import React, { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
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
    reportData.length > 0 ? (
      reportData.map((d) => (
        <Card key={d.selectedMonth}>
          <Card.Body>
            <div className="sales">
              {d.totalSales > 0 && (
                <div>
                  <h5>
                    [{month}, {year}]
                  </h5>
                  <div>
                    <h4>${d.totalSales}</h4>
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      ))
    ) : (
      <Card>
        <Card.Body>
          <div className="no-sales">
            <h5>
              [{month}, {year}]
            </h5>
            <div>
              <h4>$ 0.00</h4>
            </div>
          </div>
        </Card.Body>
      </Card>
    );

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="textReportHeader">
          <h2>Sales Report</h2>
          {title}
          <div className="productInfo">{productName.toUpperCase()}</div>
        </div>
        <p></p>
        {listItems}
      </div>
    </div>
  );
};

export default SelectedProductWiseReport;

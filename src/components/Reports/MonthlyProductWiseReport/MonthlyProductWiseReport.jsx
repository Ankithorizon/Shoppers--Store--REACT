import React from "react";
import { Button } from "react-bootstrap";
import "./style.css";

const MonthlyProductWiseReport = ({
  title,
  productName,
  year,
  reportData,
  reportTypes,
}) => {
  const listItems =
    reportData.length > 0 &&
    reportData.map((d) => (
      <Button
        variant="success"
        style={{
          marginBottom: 15,
          marginRight: 5,
          width: 140,
          height: 100,
          borderColor: "black",
          borderWidth: 2,
          color: "black",
          backgroundColor: "lightblue",
        }}
        key={d.monthNumber}
      >
        <div>
          {d.totalSales > 0 ? (
            <div>
              <h5>{d.monthName}</h5>
              <div>
                <h4>${d.totalSales}</h4>
              </div>
            </div>
          ) : (
            <div>
              {d.monthName}
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
            {productName.toUpperCase()} Sales in [{year}]
          </div>
        </div>
        <p></p>
        {listItems}
      </div>
    </div>
  );
};

export default MonthlyProductWiseReport;

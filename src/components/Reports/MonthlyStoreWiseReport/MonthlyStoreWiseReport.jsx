import React, { useState } from "react";
import { Button } from "react-bootstrap";
import "./style.css";

const MonthlyStoreWiseReport = ({ title, year, reportData, reportTypes }) => {
  const [displayTextReport, setDisplayTextReport] = useState(false);
  const [displayChartReport, setDisplayChartReport] = useState(false);
  const checkForReportTypes = () => {
    let textObj = reportTypes.find(
      (o) => o.reportTypeName === "TEXT" && o.reportTypeSelection === true
    );
    if (textObj !== null) setDisplayTextReport(true);
    else setDisplayTextReport(false);

    let chartObj = reportTypes.find(
      (o) => o.reportTypeName === "CHART" && o.reportTypeSelection === true
    );
    if (chartObj !== null) setDisplayChartReport(true);
    else setDisplayChartReport(false);
  };

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
          <div className="productInfo">Store Sales in [{year}]</div>
        </div>
        <p></p>
        {listItems}
      </div>
    </div>
  );
};

export default MonthlyStoreWiseReport;

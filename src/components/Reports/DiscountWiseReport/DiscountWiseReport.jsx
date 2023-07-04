import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./style.css";
import Chart from "react-google-charts";

const DiscountWiseReport = ({
  title,
  productName,
  year,
  reportData,
  displayTextReport,
  displayChartReport,
}) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    renderChartData();
  }, []);

  const initChartData = () => {
    var chartDatas = [];
    var firstItem = ["Month", "Sales $"];
    chartDatas.push(firstItem);
    return chartDatas;
  };
  const renderChartData = () => {
    var chartDatas_ = initChartData();

    reportData.map((item, i) => {
      chartDatas_.push([item.monthName, item.totalSales]);
    });
    setChartData(chartDatas_);
  };

  let displayChart = () => {
    return (
      <div style={{ display: "flex" }}>
        <Chart
          width={700}
          height={500}
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            title: title,
            chartArea: { width: "70%" },
            hAxis: {
              title: "Month",
              minValue: 0,
            },
            vAxis: {
              title: "Sales",
            },
          }}
          legendToggle
        />
      </div>
    );
  };
  return (
    <div className="mainContainer">
      <div className="container">
        {displayChartReport ? (
          <div>
            <div className="textReportHeader">
              <h2>Sales Report</h2>
              {title}
              <div className="productInfo">
                Product [ {productName.toUpperCase()} ]-Discount Wise Sales For
                [{year}]
              </div>
            </div>
            <p></p>
            <div>Discount Wise Report!</div>
          </div>
        ) : (
          <div className="wrongReportType">
            Please select Chart Report Type!
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountWiseReport;

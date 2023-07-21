import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./style.css";
import Chart from "react-google-charts";

const MonthlyProductWiseReport = ({
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

  const displaySalesValue = (salesValue) => {
    let USDollar = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });
    return USDollar.format(salesValue);
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
            chartArea: { width: "80%" },
            hAxis: {
              textStyle: {
                color: "darkmagenta",
                fontName: "Arial Black",
                fontSize: 15,
                bold: true,
              },
              title: "Month",
              minValue: 0,
            },
            vAxis: {
              textStyle: {
                color: "darkmagenta",
                fontName: "Arial Black",
                fontSize: 15,
                bold: true,
              },
              title: "Sales $",
            },
          }}
          legendToggle
        />
      </div>
    );
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
                {/*
                <h6>${(Math.round(d.totalSales * 100) / 100).toFixed(2)}</h6>
                */}
                <h6 className="displaySalesAmount">
                  {displaySalesValue(d.totalSales)}
                </h6>
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
            {productName.toUpperCase()} Sales For [{year}]
          </div>
        </div>
        <p></p>
        {displayTextReport && <div>{listItems}</div>}
        <p></p>
        {displayChartReport && <div>{displayChart()}</div>}
      </div>
    </div>
  );
};

export default MonthlyProductWiseReport;

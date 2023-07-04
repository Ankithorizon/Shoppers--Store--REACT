import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./style.css";
import Chart from "react-google-charts";

const MonthlyStoreWiseReport = ({
  title,
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

  // text report
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
        <div className="textReportHeader">
          <h2>Sales Report</h2>
          {title}
          <div className="productInfo">Store Sales For [{year}]</div>
        </div>
        <p></p>
        {displayTextReport && <div>{listItems}</div>}
        <p></p>
        {displayChartReport && <div>{displayChart()}</div>}
      </div>
    </div>
  );
};

export default MonthlyStoreWiseReport;

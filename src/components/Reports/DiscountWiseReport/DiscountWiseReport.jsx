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
    // renderChartData();
    prepareChartData();
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

  const prepareChartData = (year, data = [...reportData]) => {
    var salesInfo = {
      discountPercentage: 0,
      totalSales: 0,
      salesEffect: "",
      effectInPercentage: 0.0,
    };
    var discount = [];
    data.map((item, i) => {
      if (i === 0) {
        salesInfo = {
          discountPercentage: item.discountPercentage,
          totalSales: item.totalSales,
          salesEffect: "-",
          effectInPercentage: 0,
        };
        discount.push(salesInfo);
      } else {
        let lastSalesInfo = data[0];
        var diff = item.totalSales - lastSalesInfo.totalSales;
        if (diff >= 0) {
          // UP
          var diffPercentage_ = Number((100 * diff) / lastSalesInfo.totalSales);
          salesInfo = {
            discountPercentage: item.discountPercentage,
            totalSales: item.totalSales,
            salesEffect: "UP",
            effectInPercentage: Math.round(diffPercentage_),
          };
          discount.push(salesInfo);
        } else {
          // DOWN
          var diffPercentage_ = Number((100 * diff) / lastSalesInfo.totalSales);
          salesInfo = {
            discountPercentage: item.discountPercentage,
            totalSales: item.totalSales,
            salesEffect: "DOWN",
            effectInPercentage: Math.round(diffPercentage_),
          };
          discount.push(salesInfo);
        }
      }
    });
    console.log(discount);
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

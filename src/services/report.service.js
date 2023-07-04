import reportHttp from "../axios/report-http-common";
import authenticationHeader from "./authentication.header";

class ReportDataService {
  monthlyStoreWise = (data) => {
    return reportHttp.post("/monthlyStoreWise", data, {
      headers: authenticationHeader(),
    });
  };

  monthlyProductWise = (data) => {
    return reportHttp.post("/monthlyProductWise", data, {
      headers: authenticationHeader(),
    });
  };

  selectedProductWise = (data) => {
    return reportHttp.post("/selectedProductWise", data, {
      headers: authenticationHeader(),
    });
  };

  getProductsWithImage = () => {
    return reportHttp.get("/productsWithImage", {
      headers: authenticationHeader(),
    });
  };

  getMonthNameFromMonthNumber = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("en-US", { month: "long" });
  };

  discountWise = (data) => {
    return reportHttp.post("/discountWise", data, {
      headers: authenticationHeader(),
    });
  };
}

export default new ReportDataService();

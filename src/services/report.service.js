import reportHttp from "../axios/report-http-common";
import authenticationHeader from "./authentication.header";

class ReportDataService {
  monthlyStoreWise = async (data) => {
    return await reportHttp.post("/monthlyStoreWise", data, {
      headers: authenticationHeader(),
    });
  };

  monthlyProductWise = async (data) => {
    return await reportHttp.post("/monthlyProductWise", data, {
      headers: authenticationHeader(),
    });
  };

  selectedProductWise = async (data) => {
    return await reportHttp.post("/selectedProductWise", data, {
      headers: authenticationHeader(),
    });
  };

  getProductsWithImage = async () => {
    return await reportHttp.get("/productsWithImage", {
      headers: authenticationHeader(),
    });
  };

  getMonthNameFromMonthNumber = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("en-US", { month: "long" });
  };

  discountWise = async (data) => {
    return await reportHttp.post("/discountWise", data, {
      headers: authenticationHeader(),
    });
  };
}

export default new ReportDataService();

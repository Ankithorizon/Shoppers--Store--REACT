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
}

export default new ReportDataService();

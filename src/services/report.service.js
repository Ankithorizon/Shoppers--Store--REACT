import reportHttp from "../axios/report-http-common";
import authenticationHeader from "./authentication.header";

class ReportDataService {
  textReportMonthly = (data) => {
    return reportHttp.get("/textReportMonthly", data, {
      headers: authenticationHeader(),
    });
  };
}

export default new ReportDataService();

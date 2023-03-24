import productSellHttp from "../axios/product-sell-http-common";
import authHeader from "./auth-header";

class ProductSellDataService {
  billCreate = async (data) => {
    return productSellHttp.post("/billCreate", data, {
      headers: authenticationHeader(),
    });
  };
}

export default new ProductSellDataService();

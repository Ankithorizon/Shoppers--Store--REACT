import productSellHttp from "../axios/product-sell-http-common";
import authenticationHeader from "./authentication.header";

class ProductSellService {
  billCreate = async (data) => {
    return await productSellHttp.post("/billCreate", data, {
      headers: authenticationHeader(),
    });
  };
}

export default new ProductSellService();

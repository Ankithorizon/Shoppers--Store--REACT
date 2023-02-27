import productHttp from "../axios/product-http-common";
import authenticationHeader from "./authentication.header";

class ProductDataService {
  addProduct(data) {
    return productHttp.post("/addProduct", data, {
      headers: authenticationHeader(),
    });
  }

  getCategories() {
    return productHttp.get("/getCategories", {
      headers: authenticationHeader(),
    });
  }
}

export default new ProductDataService();

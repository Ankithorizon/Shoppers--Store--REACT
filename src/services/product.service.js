import productHttp from "../axios/product-http-common";
import authenticationHeader from "./authentication.header";

class ProductDataService {
  addProduct = (data) => {
    return productHttp.post("/addProduct", data, {
      headers: authenticationHeader(),
    });
  };

  getCategories = () => {
    return productHttp.get("/getCategories", {
      headers: authenticationHeader(),
    });
  };

  getCategoryName = (categories, categoryId) => {
    let obj = categories.find((x) => x.categoryId === categoryId);
    console.log(obj);

    if (obj !== null) return obj.categoryName;
    else return null;
  };

  allProducts = async () => {
    return await productHttp.get(`/allProducts`, {
      headers: authenticationHeader(),
    });
  };

  findingProduct = async (pName, categoryId) => {
    return await productHttp.get(
      `/allProducts?searchValue=${pName}&categoryId=${categoryId}`,
      { headers: authenticationHeader() }
    );
  };

  getProduct = async (selectedProductId) => {
    return productHttp.get(`/getProduct/${selectedProductId}`, {
      headers: authenticationHeader(),
    });
  };

  editProduct = async (editingProductId, data) => {
    return productHttp.post(`/editProduct/${editingProductId}`, data, {
      headers: authenticationHeader(),
    });
  };

  setProductDiscount = async (data) => {
    return productHttp.post("/setProductDiscount", data, {
      headers: authenticationHeader(),
    });
  };  

  resetProductDiscount = async (selectedProductId) => {
    return productHttp.get(`/resetProductDiscount/${selectedProductId}`, {
      headers: authenticationHeader(),
    });
  };
}

export default new ProductDataService();

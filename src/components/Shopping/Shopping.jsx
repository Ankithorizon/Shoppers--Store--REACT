import Search from "./Search/Search";
import SearchByCat from "./SearchByCat/SearchByCat";
import "./style.css";

import React, { useState, useEffect } from "react";

import AuthenticationService from "../../services/authentication.service";
import ProductService from "../../services/product.service";

import { useNavigate } from "react-router-dom";

import { Button, Card } from "react-bootstrap";
import Product from "./Product/Product";
import ProductDetails from "./ProductDetails/ProductDetails";
import MyCart from "./MyCart/MyCart";

const Shopping = ({ action }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [categories, setCategories] = useState([]);

  const [cart, setCart] = useState([]);

  let navigate = useNavigate();
  useEffect(() => {
    var currRole = AuthenticationService.getCurrentUserRole();
    if (currRole === null || (currRole !== null && currRole !== "Shopper"))
      navigate("/un-auth");
    else {
      allProducts();
      getCategories();
    }
  }, []);

  const getCategories = () => {
    ProductService.getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((e) => {
        setCategories(null);
        if (e.response.status === 400) {
          console.log(e.response.statusText);
        } else {
          unAuthHandler401(e);
        }
      });
  };

  const allProducts = () => {
    ProductService.allProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((e) => {
        setProducts(null);

        if (e.response.status === 400) {
          console.log(e.response.statusText);
        } else {
          unAuthHandler401(e);
        }
      });
  };

  // check for 401
  const unAuthHandler401 = (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      navigate("/un-auth");
      AuthenticationService.logout();
    } else {
      console.log("Error!");
    }
  };

  // master : shopping component
  // child : search-by-cat component
  // child : search component
  const updateMasterComponent_SearchProducts = (searchProducts) => {
    console.log("in the master now", searchProducts);
    setProducts([...searchProducts]);
  };

  // master : shopping component
  // child : product component
  const updateMasterComponent_SetSelectedProduct = (selectedProduct) => {
    console.log("in the master now", selectedProduct);
    setSelectedProduct({ ...selectedProduct });
  };

  // master : shopping component
  // child : product-details component
  const updateMasterComponent_AddProductToCart = (cartProduct) => {
    console.log("in the master now", cartProduct);

    var productInCart = {
      productId: cartProduct.product.productId,
      qtyBuy: cartProduct.qty,
      currentPrice: cartProduct.product.currentPrice,
      productImage: cartProduct.product.productImage,
    };

    var currentCart = [];
    // check for cart[] @ local-storage
    var myCart = JSON.parse(localStorage.getItem("my-cart") || "[]");
    if (myCart !== undefined && myCart !== null && myCart.length > 0) {
      currentCart = [...myCart];
    } else {
      currentCart = [...cart];
    }

    const found = currentCart.filter(
      (entry) => entry.productId === productInCart.productId
    );

    if (found.length > 0) {
      // edit qty for productId
      const newCart = currentCart.map((p) =>
        p.productId === productInCart.productId
          ? { ...p, qtyBuy: Number(p.qtyBuy) + Number(productInCart.qtyBuy) }
          : p
      );
      setCart([...newCart]);

      // master : app component
      // child : shopping component
      // when app component get notified with updated cart,,,
      // by it's child : shopping component
      // then app component will send this updated information to it's another
      // child : header component [child:cart-header component],,,
      // that only displays total cart products
      action(newCart);
    } else {
      // add product and it's qty
      currentCart.push(productInCart);
      setCart([...currentCart]);

      // master : app component
      // child : shopping component
      // when app component get notified with updated cart,,,
      // by it's child : shopping component
      // then app component will send this updated information to it's another
      // child : header component [child:cart-header component],,,
      // that only displays total cart products
      action(currentCart);
    }
  };

  return (
    <div className="mainContainer">
      <div className="row">
        <div className="col-sm-8">
          <Search
            products={products}
            action={updateMasterComponent_SearchProducts}
          ></Search>
          <p></p>
          <SearchByCat
            products={products}
            action={updateMasterComponent_SearchProducts}
          ></SearchByCat>
          <p></p>
          <hr />
          {products && products.length > 0 ? (
            <div>
              <Product
                products={products}
                action={updateMasterComponent_SetSelectedProduct}
              ></Product>
            </div>
          ) : (
            <div className="noProducts">Products Not Found !</div>
          )}
        </div>
        {selectedProduct && (
          <div className="col-sm-4">
            <ProductDetails
              product={selectedProduct}
              categories={categories}
              action={updateMasterComponent_AddProductToCart}
            ></ProductDetails>
            <p></p>
            <div>
              {cart && cart.length > 0 && <MyCart cart={cart}></MyCart>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shopping;

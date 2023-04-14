import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";

// toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./components/Home/Home";
import AddProduct from "./components/AddProduct/AddProduct";
import ViewProducts from "./components/ViewProducts/ViewProducts";
import EditProduct from "./components/EditProduct/EditProduct";
import SetDiscount from "./components/SetDiscount/SetDiscount";
import TextReports from "./components/Reports/TextReports/TextReports";
import ChartReports from "./components/Reports/ChartReports/ChartReports";
import Shopping from "./components/Shopping/Shopping";
import CheckMyCart from "./components/Shopping/CheckMyCart/CheckMyCart";
import Payment from "./components/Payment/Payment";
import Header from "./components/Header/Header";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import UnAuth from "./components/UnAuth/UnAuth";
import NotFound from "./components/NotFound/NotFound";

function App() {
  const [cart, setCart] = useState([]);

  // this will get cart[] from local-storage when browser refresh
  useEffect(() => {
    // check for cart[] @ local-storage
    var myCart = JSON.parse(localStorage.getItem("my-cart") || "[]");
    if (myCart !== undefined && myCart !== null && myCart.length > 0) {
      setCart([...myCart]);
    }
  }, []);

  // this will be called by child : shopping component
  // to notify this master : app component's cart[]
  const updateCartCount_WhenCartUpdated = (updatedCart) => {
    console.log("in the app now", updatedCart);
    setCart([...updatedCart]);

    // update local-storage for cart[]
    localStorage.setItem("my-cart", JSON.stringify(updatedCart));
  };

  // this will be called by child : check-my-cart component
  // to notify this master : app component's cart[]
  const updateCart_WhenCartUpdated = (updatedCart) => {
    console.log("in the app now", updatedCart);
    setCart([...updatedCart]);

    // update local-storage for cart[]
    localStorage.setItem("my-cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="App">
      <div className="main-wrapper">
        <Router>
          <ToastContainer style={{ width: "500px" }} />

          <Header cart={cart}></Header>
          <div className="mainContent">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/view-products" element={<ViewProducts />} />
              <Route path="/edit-product" element={<EditProduct />} />
              <Route path="/set-discount" element={<SetDiscount />} />
              <Route path="/text-reports" element={<TextReports />} />
              <Route path="/chart-reports" element={<ChartReports />} />
              <Route
                path="/shopping"
                element={<Shopping action={updateCartCount_WhenCartUpdated} />}
              />
              <Route
                path="/check-my-cart"
                element={
                  <CheckMyCart
                    action={updateCart_WhenCartUpdated}
                    cart={cart}
                  />
                }
              />
              <Route
                path="/payment"
                element={
                  <Payment
                    cart={cart}
                  />
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/un-auth" element={<UnAuth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;

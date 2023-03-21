import React from "react";
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
import Header from "./components/Header/Header";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import UnAuth from "./components/UnAuth/UnAuth";
import NotFound from "./components/NotFound/NotFound";

function App() {
  return (
    <div className="App">
      <div className="main-wrapper">
        <Router>
          <ToastContainer style={{ width: "500px" }} />

          <Header />
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

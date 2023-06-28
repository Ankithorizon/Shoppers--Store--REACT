import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, NavDropdown, Nav, Dropdown } from "react-bootstrap";

import "./style.css";

import { useNavigate } from "react-router-dom";
import AuthenticationService from "../../services/authentication.service";
import CartHeader from "../CartHeader/CartHeader";

const Header = ({ cart }) => {
  const navigate = useNavigate();

  const [currentUserName, setCurrentUserName] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserToken, setCurrentUserToken] = useState(null);

  useEffect(() => {
    var currUser = AuthenticationService.getCurrentUser();

    if (currUser !== null) {
      setCurrentUserName(currUser.userName);
      setCurrentUserRole(currUser.role);
      setCurrentUserToken(currUser.token);
    } else {
      console.log("not logged in yet!");
    }
  }, []);

  const logout = () => {
    AuthenticationService.logout();
    setCurrentUserName(null);
    setCurrentUserRole(null);
    setCurrentUserToken(null);

    // remove cart[] from local-storage
    localStorage.removeItem("my-cart");
  };

  return (
    <>
      <Navbar variant="light" expand="lg" sticky="top" className="navBar">
        <Navbar.Brand href="/home">
          <span>Shoppers-Store</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUserName && currentUserRole === "Admin" && (
            <Nav className="me-auto">
              <Link to={"/home"} className="nav-link">
                <i className="bi bi-house-door-fill"></i>&nbsp;Home
              </Link>
              <Link to={"/add-product"} className="nav-link">
                <i className="bi bi-plus-square-fill"></i>&nbsp;[ADD]Product
              </Link>
              <Link to={"/view-products"} className="nav-link">
                <i className="bi bi-binoculars-fill"></i>-
                <i className="bi bi-pencil-square"></i>
                &nbsp; [VIEW-EDIT]Products
              </Link>
            </Nav>
          )}

          {currentUserName && currentUserRole === "Manager" && (
            <Nav className="me-auto">
              <Link to={"/home"} className="nav-link">
                <i className="bi bi-house-door-fill"></i>Home
              </Link>
              <Link to={"/view-products"} className="nav-link">
                <i className="bi bi-binoculars-fill"></i>[VIEW -
                DISCOUNT]Products
              </Link>
              <Link to={"/reports"} className="nav-link">
                <i className="bi bi-body-text"></i>
                <i className="bi bi-bar-chart"></i>Reports[Text-Chart]
              </Link>
            </Nav>
          )}

          {currentUserName && currentUserRole === "Shopper" && (
            <Nav className="me-auto">
              <Link to={"/home"} className="nav-link">
                <i className="bi bi-house-door-fill"></i>Home
              </Link>
              <Link to={"/shopping"} className="nav-link">
                <i className="bi bi-cart4"></i>Shopping
              </Link>
            </Nav>
          )}

          {currentUserName ? (
            <Nav>
              <Link to={"/check-my-cart"} className="nav-link">
                <CartHeader cart={cart}></CartHeader>
              </Link>
              <a href="/login" onClick={() => logout()} className="nav-link">
                <h6>
                  <b>
                    [
                    {currentUserRole === "Admin" ? (
                      <span className="adminRole">({currentUserRole})</span>
                    ) : (
                      <span>
                        {currentUserRole === "Manager" ? (
                          <span className="managerRole">
                            ({currentUserRole})
                          </span>
                        ) : (
                          <span>
                            {currentUserRole === "Shopper" ? (
                              <span className="shopperRole">
                                ({currentUserRole})
                              </span>
                            ) : (
                              <span></span>
                            )}
                          </span>
                        )}
                      </span>
                    )}
                    &nbsp;
                    {currentUserName}
                    ]LogOut{" "}
                  </b>
                </h6>
              </a>
            </Nav>
          ) : (
            <Nav>
              <Link to={"/login"} className="nav-link">
                <i className="bi bi-check-circle-fill"></i>Login
              </Link>{" "}
              <Link to={"/register"} className="nav-link">
                <i className="bi bi-person-plus-fill"></i>
                Register
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;

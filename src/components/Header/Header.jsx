import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useParams } from "react-router-dom";
import { Routes, Route, Link } from "react-router-dom";
import { Navbar, Container, NavDropdown, Nav, Dropdown } from "react-bootstrap";

import "./style.css";

import { useNavigate } from "react-router-dom";
import AuthenticationService from "../../services/authentication.service";

const Header = () => {
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
  };

  return (
    <>
      <Navbar variant="light" expand="lg" sticky="top" className="navBar">
        <Navbar.Brand href="/home">
          <span>Shoppers-Store</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {currentUserName && currentUserRole === "Admin" ? (
            <Nav className="me-auto">
              <Link to={"/home"} className="nav-link">
                <i className="bi bi-house-door-fill"></i>Home
              </Link>
              <Link to={"/add-product"} className="nav-link">
                <i className="bi bi-wallet-fill"></i>[ADD]Product
              </Link>
            </Nav>
          ) : (
            <span></span>
          )}

          {currentUserName ? (
            <Nav>
              <a href="/login" onClick={() => logout()} className="nav-link">
                <h6>
                  <b>
                    [<span className="userRole">({currentUserRole})</span>{" "}
                    {currentUserName} ]LogOut{" "}
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

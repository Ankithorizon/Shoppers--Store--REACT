import React from "react";

import { Card, ListGroup, ListGroupItem } from "react-bootstrap";

import "./style.css";

const Home = () => {
  return (
    <div className="mainContainer">
      <div className="container">
        <div className="homePageHeader">
          <h2>Shoppers-Store Product/Price/Cart MGT</h2>
          <div className="techDiv">
            Web API Core - 3.1, EF Core [Code First - EF Transaction] / JWT
            Authentication / SQL Server / React / Angular
          </div>
        </div>
        <hr />
        <p></p>
        <div className="row">
          <div className="col-sm-6">
            <div>
              <ListGroup>
                <ListGroup.Item variant="primary">
                  <span className="header">Role based Authentication</span>
                </ListGroup.Item>
                <div className="detail">
                  <ul>
                    <li>JWT Authentication</li>
                    <li>
                      After successful login, respective Role is returned in
                      Token / Response
                    </li>
                    <li>
                      React stores Role info with Token @ browser[Local-Storage]
                    </li>
                    <li>Menu displays as per Role info</li>
                  </ul>
                </div>
              </ListGroup>
            </div>
            <hr />
            <div>
              <ListGroup>
                <ListGroup.Item variant="primary">
                  <span className="header">Register</span>
                </ListGroup.Item>
                <div className="detail">
                  <ul>
                    <li>
                      User can register with Username, Password, Email and Role
                      [Admin/Manager/Shopper]
                    </li>
                  </ul>
                </div>
              </ListGroup>
            </div>
            <hr />
            <div>
              <ListGroup>
                <ListGroup.Item variant="primary">
                  <span className="header">Login</span>
                </ListGroup.Item>
                <div className="detail">
                  <ul>
                    <li>User can login with valid Username and Password</li>
                    <li>
                      After successful login, Token, Role and other User's
                      information is stored on Client side and menu options are
                      displayed as per User's Role and redirects to Home page
                    </li>
                  </ul>
                </div>
              </ListGroup>
            </div>
            <hr />
            <div>
              <ListGroup>
                <ListGroup.Item variant="primary">
                  <span className="header">Exceptions Handling</span>
                </ListGroup.Item>
                <div className="detail">
                  <ul>
                    <li>
                      Model validations are handled on Client side [React] and
                      Server side[Web API]
                    </li>
                    <li>
                      Server side exceptions are handled on Web API - Controller
                      and C# Service
                    </li>
                  </ul>
                </div>
              </ListGroup>
            </div>
          </div>

          <div className="col-sm-6">
            <div>
              <ListGroup>
                <ListGroup.Item variant="primary">
                  <span className="header">Role : Admin</span>
                </ListGroup.Item>
                <div className="detail">
                  <ul>
                    <li>User can add / edit / view Product</li>
                    <li>User can upload Product-Image</li>
                    <li>User can edit Product and it's Product-Image</li>
                  </ul>
                </div>
              </ListGroup>
            </div>
            <hr />
            <div>
              <ListGroup>
                <ListGroup.Item variant="primary">
                  <span className="header">Role : Manager</span>
                </ListGroup.Item>
                <div className="detail">
                  <ul>
                    <li>User can view Product</li>
                    <li>User can set Discount on Product </li>
                    <li>User can View Text Report on</li>
                  </ul>
                </div>
                <div className="row detail">
                  <div className="col-1"></div>
                  <div
                    style={{ marginTop: -15, color: "red" }}
                    className="col-11"
                  >
                    <ul>
                      <li>[Monthly]-Product wise Sales</li>
                      <li>[Monthly]-Store wise Sales </li>
                      <li>Selected Product To Month wise Sales</li>
                    </ul>
                  </div>
                </div>
                <div className="detail" style={{ marginTop: -5 }}>
                  <ul>
                    <li>User can View Chart (google chart api) Report on</li>
                  </ul>
                </div>
                <div className="row detail">
                  <div className="col-1"></div>
                  <div
                    style={{ marginTop: -15, color: "red" }}
                    className="col-11"
                  >
                    <ul>
                      <li>Product To Discount wise Sales</li>
                      <li>[Monthly]-Product wise Sales</li>
                      <li>[Monthly]-Store wise Sales</li>
                    </ul>
                  </div>
                </div>
              </ListGroup>
            </div>
            <hr />
            <div>
              <ListGroup>
                <ListGroup.Item variant="primary">
                  <span className="header">Role : Shopper</span>
                </ListGroup.Item>
                <div className="detail">
                  <ul>
                    <li>User can view Product</li>
                    <li>
                      User can filter Product by Product-Name,
                      Product-Description and Product-Category
                    </li>
                    <li>
                      User can shop Product by adding Products and
                      Product-Quantity to Shopping-Cart
                    </li>
                    <li>User can edit Shopping-Cart</li>
                    <li>User can do Payment by either Cash or Credit-Card</li>
                    <li>
                      User can View Payment-Receipt after successful Payment
                    </li>
                  </ul>
                </div>
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

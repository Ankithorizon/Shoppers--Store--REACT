import React from "react";

import { Card, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useNavigate } from "react-router-dom";

import "./style.css";

const Home = () => {
  let navigate = useNavigate();

  return (
    <div className="mainContainer">
      <h3>home-page</h3>

      <p></p>
      <div className="innerContent">
        <Container>
          <Row>
            <Col>
              <Card >
                <Card.Body>
                  <Card.Title>Products</Card.Title>
                  <Card.Text>Products</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card >
                <Card.Body>
                  <Card.Title>Shopping</Card.Title>
                  <Card.Text>Shopping</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Home;

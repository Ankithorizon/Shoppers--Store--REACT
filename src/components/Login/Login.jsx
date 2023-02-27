import React, { useEffect, useState, useRef } from "react";
import "./style.css";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthenticationService from "../../services/authentication.service";

import { useNavigate } from "react-router";

const Login = () => {
  let navigate = useNavigate();

  const [modelErrors, setModelErrors] = useState([]);
  const [loginResponse, setLoginResponse] = useState({});

  // form
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // reset form
  // form reference
  const formRef = useRef(null);

  useEffect(() => {
    var currUser = AuthenticationService.getCurrentUser();
    if (currUser !== null) navigate("/home");
  }, []);

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = () => {
    const { username, password } = form;
    const newErrors = {};

    if (!username || username === "")
      newErrors.username = "Username is Required!";

    if (!password || password === "")
      newErrors.password = "Password is Required!";

    return newErrors;
  };

  const handleModelState = (error) => {
    var errors = [];
    if (error.response.status === 400) {
      for (let prop in error.response.data.errors) {
        if (error.response.data.errors[prop].length > 1) {
          for (let error_ in error.response.data.errors[prop]) {
            errors.push(error.response.data.errors[prop][error_]);
          }
        } else {
          errors.push(error.response.data.errors[prop]);
        }
      }
    } else {
      console.log(error);
    }
    return errors;
  };

  const handleSubmit = (e) => {
    resetErrors();

    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      var loginModel = {
        password: form.password,
        username: form.username,
      };

      // api call
      AuthenticationService.login(loginModel)
        .then((response) => {
          console.log(response.data);

          var loginResponse = {
            responseCode: response.data.response.responseCode,
            responseMessage: response.data.response.responseMessage,
          };

          setLoginResponse(loginResponse);

          if (response.data.response.responseCode === 200) {
            resetForm();

            var currentUser = {
              token: response.data.token,
              userName: response.data.userName,
              role: response.data.myRole,
            };

            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            /*
            setTimeout(() => {
              navigate("/home");
            }, 3000);
            */

            setTimeout(() => {
              // this will not complete refresh home page
              // so also not complete refresh header
              // navigate("/home");

              // this will complete refresh home page
              // so also complete refresh header
              window.location.reload("/home", true);
            }, 3000);
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            let loginResponse = {
              responseCode: error.response.data.response.responseCode,
              responseMessage: error.response.data.response.responseMessage,
            };
            setLoginResponse(loginResponse);
          } else if (error.response.status === 400) {
            if (error.response.data.errors) {
              var modelErrors = handleModelState(error);
              setModelErrors(modelErrors);
            } else {
              let loginResponse = {
                responseCode: error.response.data.response.responseCode,
                responseMessage: error.response.data.response.responseMessage,
              };
              setLoginResponse(loginResponse);
            }
          } else {
            let loginResponse = {
              responseCode: 400,
              responseMessage: "Bad Request!",
            };
            setLoginResponse(loginResponse);
          }
        });
    }
  };

  const resetForm = (e) => {
    formRef.current.reset();
    setErrors({});
    setForm({});
  };

  const resetErrors = () => {
    setLoginResponse({});
    setModelErrors([]);
  };

  let modelErrorList =
    modelErrors.length > 0 &&
    modelErrors.map((item, i) => {
      return (
        <ul key={i} value={item}>
          <li style={{ marginTop: -20 }}>{item}</li>
        </ul>
      );
    }, this);

  return (
    <div className="mainContainer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-header">
                <div className="cardHeader">
                  <i className="bi bi-check-circle-fill"></i>
                  &nbsp; Login
                </div>
                {loginResponse && loginResponse.responseCode !== 200 ? (
                  <div className="loginError">
                    {loginResponse.responseMessage}
                  </div>
                ) : (
                  <div className="loginSuccess">
                    {loginResponse.responseMessage}
                  </div>
                )}
                {modelErrors.length > 0 ? (
                  <div className="modelError">{modelErrorList}</div>
                ) : (
                  <span></span>
                )}
              </div>
              <div className="card-body">
                <Form ref={formRef}>
                  <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                      <Form.Group controlId="username">
                        <Form.Control
                          placeholder="Enter Username"
                          type="text"
                          isInvalid={!!errors.username}
                          onChange={(e) => setField("username", e.target.value)}
                        />
                        <Form.Control.Feedback
                          type="invalid"
                          className="errorDisplay"
                        >
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <p></p>
                      <Form.Group controlId="password">
                        <Form.Control
                          placeholder="Enter Password"
                          type="password"
                          isInvalid={!!errors.password}
                          onChange={(e) => setField("password", e.target.value)}
                        />
                        <Form.Control.Feedback
                          type="invalid"
                          className="errorDisplay"
                        >
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                    <div className="col-sm-1"></div>
                  </div>
                  <p></p>
                  <div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-6 submitBtn">
                        <Button
                          className="btn btn-success"
                          type="button"
                          onClick={(e) => handleSubmit(e)}
                        >
                          Login
                        </Button>
                      </div>
                      <div className="col-sm-6 cancelBtn">
                        <Button
                          className="btn btn-primary"
                          type="button"
                          onClick={(e) => resetForm(e)}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

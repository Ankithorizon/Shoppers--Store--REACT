import http from "../axios/authentication-http-common";

class AuthenticationService {
  login = async (data) => {
    return await http.post(`/login`, data);
  };

  getCurrentUser = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser : null;
  };

  getToken = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser.token : null;
  };

  getCurrentUserRole = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser.role : null;
  };

  getCurrentUserName = () => {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser !== null ? currentUser.userName : null;
  };

  logout = () => {
    localStorage.removeItem("currentUser");
  };

  register = async (data, myRole) => {
    return await http.post(`/register/${myRole}`, data);
  };

    getRoles = async () => {
    return await http.get("/getRoles");
  }
}

export default new AuthenticationService();
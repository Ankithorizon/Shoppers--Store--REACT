export default function authenticationHeader() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = currentUser !== null ? currentUser.token : null;

  if (token) {
    console.log("sending token,,," + token);
    return { Authorization: "Bearer " + token };
    // return { 'x-access-token': user.accessToken };
  } else {
    console.log("token not found!");
    return {};
  }
}

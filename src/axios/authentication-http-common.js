import axios from "axios";

export default axios.create({
  baseURL: "https://localhost:44379/api/Authentication",
  headers: {
    "Content-type": "application/json",
  },
});

import axios from "axios";

const instance = axios.create({
  baseURL: "mongodb://localhost:27017/e-commerce",  // backend ka URL
});

export default instance;

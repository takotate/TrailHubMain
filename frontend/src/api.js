import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000"
});

export function devUserHeader(user) {
  return {
    "x-dev-user": JSON.stringify(user)
  };
}

export default api;


import axios from "axios";
window.axios = axios;

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
// Remove or update this line based on your environment
// axios.defaults.baseURL = "https://app.customtickets.ai";
axios.defaults.withCredentials = true;

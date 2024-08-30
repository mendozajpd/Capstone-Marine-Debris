import axios from "axios";

const axiosClient = axios.create({
    // LOCAL HOST
    // baseURL: 'http://localhost:8000/api'
    
    // SAIL
    baseURL: 'http://localhost:80/api'
});

export default axiosClient;
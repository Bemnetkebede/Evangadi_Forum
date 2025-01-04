import axios from 'axios';
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3306/api', 
})
export default axiosInstance;

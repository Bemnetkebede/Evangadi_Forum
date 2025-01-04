import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL,
});

export default axiosInstance;


    // baseURL: 'http://localhost:3306/api', 
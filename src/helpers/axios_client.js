import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URI + 'api/'
});

export default axiosClient;

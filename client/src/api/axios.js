import axios from 'axios';

//centralized axios instance to make API requests
const api = axios.create({

  baseURL:'https://cli-based-rockpaperwhateverbackend-fzp2.onrender.com/api',
  withCredentials: true,
  

});

export default api;


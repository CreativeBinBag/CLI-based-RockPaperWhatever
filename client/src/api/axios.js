import axios from 'axios';

//centralized axios instance to make API requests
const api = axios.create({

  baseURL:'https://cli-based-rockpaperwhateverserver.onrender.com',
  withCredentials: true,
  

});

export default api;
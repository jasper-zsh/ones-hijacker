import axios from 'axios'
import fetchAdapter from '@vespaiach/axios-fetch-adapter'

const http = axios.create({
  baseURL: 'http://localhost:9090',
  adapter: fetchAdapter
})

export default http

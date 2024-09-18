import axios from "axios"

const URL = import.meta.env.VITE_API_BACKEND

const AxiosConexion = axios.create({
    baseURL: URL
})

export default AxiosConexion
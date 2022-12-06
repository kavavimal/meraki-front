import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ?? "https://server1.rachana.tk/api";

const Login = async (params) => axios.post(`${API_URL}/login`, params);

export const AuthService = {
    Login
};

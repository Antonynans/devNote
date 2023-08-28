import axios from "axios";
import { RegisterInput } from "./CreateAccount";
import { LoginInput } from "../pages/Login";

const base = "https://devnote-backend-jno6.onrender.com/api/";


export interface GenericResponse {
  user: {
      email: string;
  };
  status: string;
}

export interface LoginResponse {
  token: string,
    user: {
      _id: string,
      email: string,
      firstname: string,
      lastname: string,
      picture: string,
      username: string,
      
    },
}

export const authApi = axios.create({
  baseURL: base,
});
authApi.defaults.headers.common['Content-Type'] = 'application/json';

export const createAccountFn = async (user: RegisterInput) => {
  const response = await authApi.post<GenericResponse>('signUpUser', user);
  return response.data;
};

export const loginUserFn = async (user: LoginInput) => {
  const response = await authApi.post<LoginResponse>('loginUser', user);
  return response.data;
};


export const Endpoints = {
  logout: base + "logout",

  update_form: base + "update-form",

  create_form: base + "create-form",

  google_login: base + "google/login",

  login: base + "loginUser",

  signup: base + "signUpUser",

  getUsersById: base + "getUsersById",

  update_users: base + "update-users",

  uploadImage: "https://api.cloudinary.com/v1_1/",

  delete_form: base + "delete-form",

  get_form: base + "getForm",

  verifyOtp: base + "verifyEmail",

};

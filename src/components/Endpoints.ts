import axios from "axios";
import { RegisterInput } from "./CreateAccount";
import { LoginInput } from "../pages/Login";
import { GenericResponse, LoginResponse, VerifyInputs, VerifyResponse } from "../types";

const base = "https://devnote-backend-jno6.onrender.com/api/";


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

export const verifyUserFn = async (user: VerifyInputs) => {
  const response = await authApi.post<VerifyResponse>('verifyEmail', user);
  return response.data;
};


export const Endpoints = {
  logout: base + "logout",

  update_form: base + "update-form",

  create_form: base + "create-form",

  getUsersById: base + "getUsersById",

  update_users: base + "update-users",

  uploadImage: "https://api.cloudinary.com/v1_1/",

  delete_form: base + "delete-form",

  get_form: base + "getForm",


};

import axios from "axios";
import { RegisterInput } from "./CreateAccount";
import { LoginInput } from "../pages/Login";
import { GenericResponse, LoginResponse, Note, VerifyInputs, VerifyResponse } from "../models/types";
import { FormInput } from "./AddNotes";
import { UserData } from "../models/UserData";

// const base = "https://devnote-backend-jno6.onrender.com/api/";
const base = "http://localhost:8000/api/";

const getToken = sessionStorage.getItem("saved_devnote");


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

export const addFormFn = async (form: FormInput) => {
  const response = await authApi.post<Note>('create-form', form);
  return response.data;
};

export const editFormFn = async (noteid: string | undefined, form: FormInput) => {
  const response = await authApi.patch<Note>(`update-form/${noteid}`, form);
  return response.data;
};

export const verifyUserFn = async (user: VerifyInputs) => {
  const response = await authApi.post<VerifyResponse>('verifyEmail', user);
  return response.data;
};

export const getForm = async () => {
  const response = await authApi.get<Note>('getForm', 
  {
    headers: {
      Authorization: `Bearer ${getToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }}
  );
  return response.data;
};

export const getFormUserById = async (userId: string) => {
  const response = await authApi.get<Note>(`forms/${userId}`, 
  {
    headers: {
      Authorization: `Bearer ${getToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }}
  );
  return response.data;
};

export const getFormById = async (formId: string) => {
  const response = await authApi.get<Note>(`getFormById/${formId}`, 
  {
    headers: {
      Authorization: `Bearer ${getToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }}
  );
  return response.data;
};

export const getUserData = async (userId: string) => {
  const response = await authApi.get<UserData>(`getUsersById/${userId}`, 
  {
    headers: {
      Authorization: `Bearer ${getToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    }}
  );
  return response.data;
};

export const Endpoints = {

  logout: base + "logout",

  getUsersById: base + "getUsersById",

  update_users: base + "update-users",

  uploadImage: "https://api.cloudinary.com/v1_1/",

  delete_form: base + "delete-form",

};

const base = "http://localhost:8000/";

export const Endpoints = {
  logout: base + "api/logout",

  update_form: base + "api/update-form",

  create_form: base + "api/create-form",

  google_login: base + "api/google/login",

  login: base + "api/loginUser",

  signup: base + "api/signUpUser",

  getUsersById: base + "api/getUsersById",

  update_users: base + "api/update-users",

  uploadImage: "https://api.cloudinary.com/v1_1/",

  delete_form: base + "api/delete-form",

  get_form: base + "api/getForm",

  verifyOtp: base + "api/verifyEmail",

};

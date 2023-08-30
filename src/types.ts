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

export interface VerifyInputs {
  email: string,
  otp: string,
}

export interface VerifyResponse {
  message: string,
}
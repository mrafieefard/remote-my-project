"use client";

import axios, { AxiosError } from "axios";
import { return_data, TokenResponse, base_url } from "./base";

class Login {
  async login(username: String, password: String) {
    try {
      const loginRequest = await axios.post<TokenResponse>(
        `${base_url}/client/token`,
        {
          username: username,
          password: password,
        }
      );
      return return_data<TokenResponse>(true, loginRequest.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        return return_data(false, null, error.response?.data.detail);
      }

      return return_data(false, null, "Faild to authenticate");
    }
  }
}

export default Login;

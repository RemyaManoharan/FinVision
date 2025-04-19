import axios from "axios";
import { SignUpFormValues, LoginFormValues } from "../type/user";
import { API_BASE_URL } from "../config";

export const signUpUser = async (userData: SignUpFormValues) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/users/register`,
      userData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error signing up user: " + error.message);
    } else {
      throw new Error("Error signing up user: An unknown error occurred");
    }
  }
};

export const loginUser = async (userData: LoginFormValues) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users/login`, userData);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error logging in user: " + error.message);
    } else {
      throw new Error("Error logging in user: An unknown error occurred");
    }
  }
};

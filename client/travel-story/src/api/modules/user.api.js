import publicClient from "../client/public.client";
import privateClient from "../client/private.client";

const userEndpoints = {
  signin: "user/login",
  signup: "user/create-account",
  getInfo: "user/get-user",
};

const userApi = {
  signin: async ({ email, password }) => {
    try {
      const data = await publicClient.post(userEndpoints.signin, {
        email,
        password,
      });

      console.log("API Response Data:", data);

      if (data && !data.error) {
        return { response: data };
      } else {
        throw new Error(data.message || "No data found in response.");
      }
    } catch (error) {
      console.error("API Call Error:", error);
      return { error: error.message || "Failed to login." };
    }
  },

  signup: async ({ fullname, email, password }) => {
    try {
      const data = await publicClient.post(userEndpoints.signup, {
        fullname,
        email,
        password,
      });
      if (data && !data.error) {
        return { response: data };
      } else {
        throw new Error(data.message || "No data found in response.");
      }
    } catch (error) {
      return { error: error.message || "Failed to Create Account." };
    }
  },

  getInfo: async () => {
    try {
      const data = await privateClient.get(userEndpoints.getInfo);
      if (data && !data.error) {
        return data;
      } else {
        throw new Error(data.message || "No data found in response.");
      }
    } catch (error) {
      console.error("API Call Error:", error);
      return { error: error.message || "Failed to get user info." };
    }
  },
};

export default userApi;

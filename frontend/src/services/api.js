import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

// Custom Hook for API Call
export const useApiCall = () => {
  const { getAccessTokenSilently } = useAuth0();

  const apiCall = async (method, url, data = null, useAuth = true) => {
    try {
      const config = {};

      if (useAuth) {
        const token = await getAccessTokenSilently({
          audience: 'unique key',
        });
        console.log('access token', token)
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      let response;
      switch (method.toLowerCase()) {
        case "get":
          response = await axios.get(url, config);
          break;
        case "post":
          response = await axios.post(url, data, config);
          break;
        case "put":
          response = await axios.put(url, data, config);
          break;
        case "delete":
          response = await axios.delete(url, config);
          break;
        default:
          throw new Error("Invalid method");
      }

      return response.data;
    } catch (error) {
      console.error("API error:", error);
      // if (error.response && error.response.status === 401) {
      //   alert("Your session has expired. Please log in again.");
      // } else {
      //   alert("An error occurred while processing your request.");
      // }
      throw error;
    }
  };

  return { apiCall };
};


export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Utility function to get user role from localStorage or token
export const getUserRole = () => {
  // If you store role in localStorage
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.role;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  }

  // Alternative: decode JWT token if you store role in the token
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const userData = JSON.parse(jsonPayload);
      return userData.role || userData.data?.role;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  return null;
};

// Get the token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get user data from localStorage or token
export const getUserData = () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  }

  // Decode JWT token to get user data
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const userData = JSON.parse(jsonPayload);
      return userData.data || userData;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  return null;
};
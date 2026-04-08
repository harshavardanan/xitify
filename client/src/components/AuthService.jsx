const ENDPOINT = process.env.REACT_APP_ENDPOINT;
export const AuthService = async () => {
  try {
    const res = await fetch(`${ENDPOINT}/api/auth/user`, {
      method: "GET",
      credentials: "include", // Send session cookie
    });

    if (!res.ok) {
      localStorage.removeItem("user"); // Clear old user data
      return null;
    }

    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data.user)); // Save user object
    return data.user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    localStorage.removeItem("user");
    return null;
  }
};

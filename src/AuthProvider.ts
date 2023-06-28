// TypeScript users must reference the type: `AuthProvider`

export const authProvider = {
  // Question -- why is this lower case?
  // called when the user attempts to log in
  login: (username: string) => {
    localStorage.setItem("username", username);
    // accept all username/password combinations
    return Promise.resolve();
  },

  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("username");
    return Promise.resolve();
  },

  // called when the API returns an error
  checkError: (status: number) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("username");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("username")
      ? Promise.resolve() // Question -- what is resolve doing in each instance & is this checking a boolean
      : Promise.reject();
  },

  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};

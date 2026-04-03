// import { createContext, useContext, useState, useEffect } from "react";
// import API from "../api.js";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Login function
//   const login = async (email, password, role) => {
//     const res = await API.post("/auth/login", {
//       email, password, role
//     });

//     const data = res.data;
//     if (data.token) {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setUser(data.user);
//     }
//   };

//   // Logout
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   };

//   // Persist user
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   // Persist token
//   const [token, setToken] = useState(localStorage.getItem('token') || null);

//   useEffect(() => {
//     const savedToken = localStorage.getItem('token');
//     const savedUser = localStorage.getItem('user');
//     if (savedToken) setToken(savedToken);
//     if (savedUser) setUser(JSON.stringify(savedUser));
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, token, setToken, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );

// };

// export const useAuth = () => useContext(AuthContext);




import { createContext, useContext, useState, useEffect } from "react";
import API from "../api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const isLoggedIn = !!token;

  // LOGIN
  const login = async (email, password, role) => {
    const res = await API.post("/auth/login", {
      email,
      password,
      role
    });

    const data = res.data;

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // Restore session on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
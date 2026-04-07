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

  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem("token") || null);

  const isLoggedIn = !!token;

  // Public setToken function for signup/login
  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
    }
  };

  // Public setUser function for signup/login
  const setUser = (newUser) => {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      setUserState(newUser);
    } else {
      localStorage.removeItem("user");
      setUserState(null);
    }
  };

  // LOGIN
  const login = async (email, password, role) => {
    const res = await API.post("/auth/login", {
      email,
      password,
      role
    });

    const data = res.data;

    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
  };

  // LOGOUT
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Restore session on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser) setUserState(JSON.parse(savedUser));
    if (savedToken) setTokenState(savedToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        setUser,
        setToken,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
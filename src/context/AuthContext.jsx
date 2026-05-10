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
import { useDispatch } from "react-redux";
import { clearCartState } from "../redux/CartSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Compute isLoggedIn from token state
  const isLoggedIn = !!token;

  // Public setToken function for signup/login
  const setToken = (newToken) => {
    try {
      if (newToken) {
        localStorage.setItem("token", newToken);
        setTokenState(newToken);
        console.log("✅ Token saved to localStorage and state");
      } else {
        localStorage.removeItem("token");
        setTokenState(null);
        console.log("✅ Token cleared from localStorage and state");
      }
    } catch (err) {
      console.error("❌ Error managing token:", err);
    }
  };

  // Public setUser function for signup/login
  const setUser = (newUser) => {
    try {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUserState(newUser);
        console.log("✅ User saved to localStorage and state");
      } else {
        localStorage.removeItem("user");
        setUserState(null);
        console.log("✅ User cleared from localStorage and state");
      }
    } catch (err) {
      console.error("❌ Error managing user:", err);
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
    dispatch(clearCartState());
  };

  // Restore session on refresh
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser) {
        setUserState(JSON.parse(savedUser));
        console.log("✅ User restored from localStorage");
      }
      if (savedToken) {
        setTokenState(savedToken);
        console.log("✅ Token restored from localStorage");
      }
    } catch (err) {
      console.error("❌ Error restoring session:", err);
      localStorage.clear();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        token: token,
        isLoggedIn: isLoggedIn,
        loading: loading,
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
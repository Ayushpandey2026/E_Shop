import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Store as store } from "./redux/Store";
import { router } from "./App";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>    
      <AuthProvider>    
          <RouterProvider router={router} />      </AuthProvider>   </Provider>
  </React.StrictMode>
);

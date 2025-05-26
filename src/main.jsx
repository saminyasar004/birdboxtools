import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./component/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StateProvider } from "./component/StateContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={"911582204961-3n9h1ubrd11p4tkkrq5kjsvjui9hnanh.apps.googleusercontent.com"}>

    <AuthProvider>
      <StateProvider>
      <App />
      </StateProvider>
    </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

import "./App.css";
import { lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
const PublicRoute = lazy(() => import("./routes/public"));
const SignIn = lazy(() => import("./pages/Auth/signIn"));
const SignUp = lazy(() => import("./pages/Auth/signUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PrivateRoute = lazy(() => import("./routes/private"));
const CallForm = lazy(() => import("./pages/CallForm"));
const AddPrompt = lazy(() => import("./pages/AddPrompt"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Appointments = lazy(() => import("./pages/Appointments"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-prompt"
            element={
              <PrivateRoute>
                <AddPrompt />
              </PrivateRoute>
            }
          />
          <Route
            path="/call"
            element={
              <PrivateRoute>
                <CallForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <PrivateRoute>
                <Appointments />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.9)",
            color: "#f8fafc",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          },
          success: {
            style: {
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#34d399",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              background: "rgba(244, 63, 94, 0.1)",
              border: "1px solid rgba(244, 63, 94, 0.3)",
              color: "#fb7185",
            },
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;

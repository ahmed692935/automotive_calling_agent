import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PublicRoute from "./routes/public";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/Auth/signIn";
import SignUp from "./pages/Auth/signUp";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/private";
import CallForm from "./pages/CallForm";
import AddPrompt from "./pages/AddPrompt";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
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
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;

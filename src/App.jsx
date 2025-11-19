import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Map } from "./pages/Map";
import { Help } from "./pages/Help";
import { Profile } from "./pages/Profile";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/map"
          element={
            <PrivateRoute>
              <Map />
            </PrivateRoute>
          }
        />

        <Route
          path="/help"
          element={
            <PrivateRoute>
              <Help />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
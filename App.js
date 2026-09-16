import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

/* COMPONENTS */
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

/* PAGES */
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Upload from "./pages/Upload";
import CreateTemplate from "./pages/CreateTemplate";
import PreviewTemplate from "./pages/PreviewTemplate";
import ComposeEmail from "./pages/ComposeEmail";
import Reports from "./pages/Reports";

function App() {

  return (
    <Router>

      <Routes>
        <Route
  path="/register"
  element={<Register />}
/>

        {/* LOGIN PAGE */}
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

        {/* DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* CLIENTS PAGE */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Layout>
                <Clients />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* UPLOAD PAGE */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Layout>
                <Upload />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* CREATE TEMPLATE */}
        <Route
          path="/create-template"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateTemplate />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PREVIEW TEMPLATE */}
        <Route
          path="/preview-template"
          element={
            <ProtectedRoute>
              <Layout>
                <PreviewTemplate />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/compose-email"
          element={
            <ProtectedRoute>
              <Layout>
                <ComposeEmail />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>

    </Router>
  );
}

export default App;
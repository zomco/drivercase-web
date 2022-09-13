import React from 'react';
import {Route, Routes} from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import ProtectedPageLayout from "./components/ProtectedPageLayout";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Write from "./pages/Write";
import Setting from "./pages/Setting";
import {AuthProvider} from "./hooks/useAuth";
import Edit from "./pages/Edit";
import Case from "./pages/Case";
import Notfound from "./pages/Notfound";

function App() {
  return (
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/write" element={<Write />} />
            <Route path="/setting" element={<Setting />} />
          </Route>

          <Route element={<ProtectedPageLayout />}>
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/case/:id" element={<Case />} />
          </Route>

          <Route path="/*" element={<Notfound />} />
        </Routes>
      </AuthProvider>
  );
}

export default App;

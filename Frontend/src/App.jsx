import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import KnowYourRights from "./Components/KnowYourRights";
import DocumentSimple from "./Components/DocumentSimple";
import Template from "./Components/Template";
import Lawyer from "./Components/Lawyer";

import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rights" element={<KnowYourRights />} />
          <Route path="/simplifier" element={<DocumentSimple />} />
          <Route path="/templates" element={<Template />} />
          <Route path="/lawyers" element={<Lawyer />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";

import Z_imagebackground from '../scripts/Z_imagebackground';

import Home from "../pages/home/Home";
// import About from "../pages/about/About";
// import Contact from "../pages/contact/Contact";
import Model_Upload from "../pages/model_upload/Model_Upload";
// import DefaultArticle from "../pages/defaultarticle/DefaultArticle";

import "./App.css"; // Ensure global styles are imported

const App = () => {
  return (
    <div className="app-container" style={{ minHeight: '100%', width: '100%', overflowX: 'hidden'}}>
      <Z_imagebackground /> {/* <--- Add this line here */}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        <Route path="/model_upload" element={<Model_Upload />} />
        {/* <Route path="/defaultarticle" element={<DefaultArticle />} /> */}
      </Routes>
    </div>
  );
};

export default App;

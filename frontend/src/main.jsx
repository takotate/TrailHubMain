import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Explore from "./pages/Explore";
import HikeDetails from "./pages/HikeDetails";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 20, fontFamily: "system-ui, sans-serif" }}>
        <header style={{ marginBottom: 16 }}>
          <h1>TrailHub (dev)</h1>
          <nav>
            <Link to="/explore">Explore</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/explore" element={<Explore />} />
          <Route path="/hike/:id" element={<HikeDetails />} />
          <Route index element={<Explore />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);


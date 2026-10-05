import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* projects now live on the home page */}
        <Route path="/projects" element={<Navigate to="/#projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

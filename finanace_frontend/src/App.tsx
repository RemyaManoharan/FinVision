import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Features from "./pages/FeaturesPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/features" element={<Features />} />
            {/* Add other routes that should include the Layout here */}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

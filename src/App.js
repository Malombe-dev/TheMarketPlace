
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BrowseProducts from "./pages/BrowseProducts";
import BrowseSkills from "./pages/BrowseSkills";
import Profile from "./pages/Profile";
import UploadProduct from "./pages/UploadProduct";
import UploadSkill from "./pages/UploadSkill";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import MessageThread from "./components/MessagesPage";



import PrivateRoute from "./context/PrivateRoute";
// inside your main index.js or App.js (before any API requests)



import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse-products" element={<BrowseProducts />} />
          <Route path="/browse-skills" element={<BrowseSkills />} />
          <Route path="/login" element={<Login />} />
          <Route path="/messages" element={<MessageThread />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/upload-product" element={<PrivateRoute><UploadProduct /></PrivateRoute>} />
          <Route path="/upload-skill" element={<PrivateRoute><UploadSkill /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

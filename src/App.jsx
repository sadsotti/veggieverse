import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecipeProvider } from "./context/RecipeContext";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Footer from "./components/Footer";

function App() {
  return (
    <RecipeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Routes>
        <Footer />
      </Router>
    </RecipeProvider>
  );
}

export default App;

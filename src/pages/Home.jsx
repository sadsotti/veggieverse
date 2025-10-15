import { useState, useContext } from "react";
import axios from "axios";
import { RecipeContext } from "../context/RecipeContext";
import RecipeCard from "../components/RecipeCard";
import logo from "../assets/logo.png";

const RESULTS_PER_PAGE = 12;

const Home = () => {
  const { recipes, setRecipes } = useContext(RecipeContext);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

  const searchRecipes = async (pageNum = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setPage(pageNum);
    setRecipes([]); // reset

    try {
      const offset = (pageNum - 1) * RESULTS_PER_PAGE;
      const res = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            apiKey: API_KEY,
            query: query,
            diet: "vegetarian",
            number: RESULTS_PER_PAGE,
            offset: offset,
          },
        }
      );

      // Filtra solo ricette con immagine
      let filtered = res.data.results.filter(r => r.image);

      // Deduplica completa per id + titolo
      const unique = Array.from(
        new Map(filtered.map(item => [`${item.id}-${item.title}`, item])).values()
      );

      if (unique.length === 0) {
        setError("No recipes found with images. Try another search!");
      }

      setRecipes(unique);
    } catch (err) {
      console.error(err);
      setError("Error fetching recipes.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => searchRecipes(page + 1);
  const handlePrev = () => page > 1 && searchRecipes(page - 1);

  return (
    <div className="home-container">
      <div className="logo-container">
        <img src={logo} alt="VeggieVerse Logo" />
        <h1>VeggieVerse</h1>
        <p>Your vegetarian recipe universe</p>
      </div>

      <div className="search-bar">
  <input
    value={query}
    onChange={e => setQuery(e.target.value)}
    placeholder="Search vegetarian recipes..."
  />
  <button onClick={() => searchRecipes(1)}>Search</button>
  {query && (
    <button onClick={() => {
      setQuery("");
      setRecipes([]);
      setError("");
    }}>
     Clear
    </button>
  )}
</div>

      {loading && <div className="loader"></div>}
      {error && <div className="error-message">{error}</div>}

      <div className="recipe-grid">
        {recipes.map((r, index) => (
          <RecipeCard key={`${r.id}-${index}-${r.title}`} recipe={r} />
        ))}
      </div>

      {recipes.length > 0 && (
        <div className="pagination">
          <button onClick={handlePrev} disabled={page === 1}>
            Prev
          </button>
          <button onClick={handleNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

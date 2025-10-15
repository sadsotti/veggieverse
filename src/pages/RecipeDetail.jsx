import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const RecipeDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(
          `https://api.spoonacular.com/recipes/${state.id}/information`,
          { params: { apiKey: API_KEY } }
        );
        setDetails(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (state?.id) fetchDetails();
  }, [state, API_KEY]);

  if (loading) return <div className="loader"></div>;
  if (!details) return <p>Recipe not found</p>;

  const cleanSummary = () => {
    if (!details.summary) return "";
    let text = details.summary.replace(/<\/?[^>]+(>|$)/g, "");
    const sentences = text.split(/\. |\n/).map(s => s.trim()).filter(Boolean);
    const uniqueSentences = Array.from(new Set(sentences));
    return uniqueSentences.slice(0, 3).join(". ") + ".";
  };

  return (
    <div className="recipe-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="recipe-detail-header">
  <img src={details.image} alt={details.title} />
  <div className="recipe-header-info">
    <h1>{details.title}</h1>
    <div className="recipe-meta">
      <span className="badge servings">🍽️ {details.servings} Servings</span>
      <span className="badge time">⏱️ {details.readyInMinutes} min</span>
      <span className={`badge difficulty ${details.veryPopular ? "medium" : "easy"}`}>
        🔥 {details.veryPopular ? "Medium" : "Easy"}
      </span>
    </div>
  </div>
</div>

      <div className="recipe-content">
        <div className="recipe-box">
          <h2>Summary</h2>
          <p>{cleanSummary()}</p>
        </div>

        <div className="recipe-box">
          <h2>Ingredients</h2>
          <ul>
            {details.extendedIngredients.map((ing, i) => (
              <li key={`${ing.id || i}-${ing.original}`}>{ing.original}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-box">
          <h2>Instructions</h2>
          {details.analyzedInstructions.length > 0 ? (
            <ol>
              {details.analyzedInstructions[0].steps.map((step, i) => (
                <li key={`${step.number}-${i}`}>{step.step}</li>
              ))}
            </ol>
          ) : (
            <p>No detailed instructions available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

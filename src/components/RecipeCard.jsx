import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`, { state: recipe });
  };

  return (
    <div className="recipe-card" onClick={handleClick}>
      <div className="recipe-image">
        <img src={recipe.image} alt={recipe.title} />
      </div>
      <div className="recipe-info">
        <h3>{recipe.title}</h3>
      </div>
    </div>
  );
};

export default RecipeCard;

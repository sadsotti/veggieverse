import { createContext, useState } from "react";

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <RecipeContext.Provider value={{ recipes, setRecipes, selectedRecipe, setSelectedRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

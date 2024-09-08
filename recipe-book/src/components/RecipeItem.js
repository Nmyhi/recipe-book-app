// src/components/RecipeItem.js
import React from 'react';

function RecipeItem({ recipe }) {
  return (
    <div key={recipe.id}>
      <h3>{recipe.name}</h3>
      <p>{recipe.description}</p>
      <p><strong>Category:</strong> {recipe.category}</p>
      <h4>Ingredients:</h4>
      <ul>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.name} - {ingredient.quantity} {ingredient.unit}
            </li>
          ))
        ) : (
          <p>No ingredients listed.</p>
        )}
      </ul>
    </div>
  );
}

export default RecipeItem;
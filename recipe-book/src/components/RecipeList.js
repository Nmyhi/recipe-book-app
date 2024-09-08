import React from 'react';
import { collection } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

function RecipeList() {
  const recipesCollectionRef = collection(db, 'recipes');
  const [recipes, loading, error] = useCollectionData(recipesCollectionRef, { idField: 'id' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Recipe List</h2>
      {recipes?.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe.id}>
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <p><strong>Category:</strong> {recipe.category}</p>
            <h4>Ingredients:</h4>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No recipes available.</p>
      )}
    </div>
  );
}

export default RecipeList;
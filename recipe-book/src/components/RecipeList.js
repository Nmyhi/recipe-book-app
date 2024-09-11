import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed
import EditRecipe from './EditRecipe'; // Import the EditRecipe component

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // To store the recipe selected for editing

  useEffect(() => {
    const recipesCollectionRef = collection(db, 'recipes');

    // Using onSnapshot to fetch real-time data
    const unsubscribe = onSnapshot(
      recipesCollectionRef,
      (snapshot) => {
        const fetchedRecipes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(fetchedRecipes);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (recipeId) => {
    try {
      // Delete the recipe document by its ID
      await deleteDoc(doc(db, 'recipes', recipeId));
      console.log('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleEditClick = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe for editing
  };

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error loading recipes: {error.message}</p>;
  }

  return (
    <div className="recipe-list">
      <h2>Recipe List</h2>
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
            <p><strong>Category:</strong> {recipe.category}</p>
            {/* Delete button for each recipe */}
            <button onClick={() => handleDelete(recipe.id)}>Delete Recipe</button>
            {/* Edit button for each recipe */}
            <button onClick={() => handleEditClick(recipe)}>Edit Recipe</button>
          </div>
        ))
      ) : (
        <p>No recipes found.</p>
      )}

      {/* Conditionally render EditRecipe component if a recipe is selected */}
      {selectedRecipe && (
        <EditRecipe
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)} // Close the editor after saving
        />
      )}
    </div>
  );
}

export default RecipeList;
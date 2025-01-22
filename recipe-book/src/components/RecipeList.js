import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed
import EditRecipe from './EditRecipe'; // Import the EditRecipe component
import '../RecipeList.css';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // To store the recipe selected for editing
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Show/Hide delete confirmation modal
  const [recipeToDelete, setRecipeToDelete] = useState(null); // Store the recipe ID to delete

  useEffect(() => {
    const recipesCollectionRef = collection(db, 'recipes');

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

    return () => unsubscribe();
  }, []);

  // Function to confirm deletion with popup
  const confirmDelete = (recipeId) => {
    setRecipeToDelete(recipeId); // Store the ID of the recipe to delete
    setShowDeleteConfirm(true); // Show confirmation modal
  };

  // Function to handle deletion of recipe
  const handleDelete = async () => {
    if (!recipeToDelete) return; // Prevent deletion if no recipe ID is stored

    try {
      await deleteDoc(doc(db, 'recipes', recipeToDelete));
      console.log('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
    } finally {
      setShowDeleteConfirm(false); // Hide confirmation modal
      setRecipeToDelete(null); // Clear the ID
    }
  };

  const handleEditClick = (recipe) => {
    setSelectedRecipe(recipe); // Set the selected recipe for editing
    document.body.style.overflow = 'hidden'; // Disable background scrolling when modal is open
  };

  const handleCloseEdit = () => {
    setSelectedRecipe(null); // Close the EditRecipe modal
    document.body.style.overflow = 'auto'; // Re-enable background scrolling when modal is closed
  };

  if (loading) {
    return <p className="loading-message">Loading recipes...</p>;
  }

  if (error) {
    return <p className="error-message">Error loading recipes: {error.message}</p>;
  }

  return (
    <div className="recipe-list-container">
      <h2 className="recipe-list-title">Recipe List</h2>
      {recipes.length > 0 ? (
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h3 className="recipe-name">{recipe.name}</h3>
              <p className="recipe-description">{recipe.description}</p>
              <p className="recipe-category"><strong>Category:</strong> {recipe.category}</p>
              {/* Delete button with confirmation */}
              <button className="delete-button" onClick={() => confirmDelete(recipe.id)}>Delete Recipe</button>
              {/* Edit button */}
              <button className="edit-button" onClick={() => handleEditClick(recipe)}>Edit Recipe</button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-recipes-message">No recipes found.</p>
      )}

      {/* Conditionally render EditRecipe component if a recipe is selected */}
      {selectedRecipe && (
        <div className="edit-modal">
          <div className="modal-content">
            <EditRecipe
              recipe={selectedRecipe}
              onClose={handleCloseEdit}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this recipe?</p>
            <button className="confirm-button" onClick={handleDelete}>Yes, delete</button>
            <button className="cancel-button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeList;

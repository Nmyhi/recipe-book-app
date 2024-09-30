import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed
import '../EditRecipe.css';

function EditRecipe({ recipe, onClose }) {
  const [name, setName] = useState(recipe.name);
  const [description, setDescription] = useState(recipe.description);
  const [category, setCategory] = useState(recipe.category);
  const [ingredients, setIngredients] = useState(recipe.ingredients || []);

  // Handle ingredient field change
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setIngredients(updatedIngredients);
  };

  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  // Handle removing an ingredient
  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleSave = async () => {
    try {
      const recipeDocRef = doc(db, 'recipes', recipe.id);

      // Update the recipe document in Firestore
      await updateDoc(recipeDocRef, {
        name,
        description,
        category,
        ingredients,
      });

      console.log('Recipe updated successfully');
      onClose(); // Close the editor after saving
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <div className="edit-recipe">
      <h2>Edit Recipe</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>

      <h3>Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="ingredient">
          <label>
            Name:
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) =>
                handleIngredientChange(index, 'name', e.target.value)
              }
            />
          </label>
          <label>
            Quantity:
            <input
              type="text"
              value={ingredient.quantity}
              onChange={(e) =>
                handleIngredientChange(index, 'quantity', e.target.value)
              }
            />
          </label>
          <label>
            Unit:
            <input
              type="text"
              value={ingredient.unit}
              onChange={(e) =>
                handleIngredientChange(index, 'unit', e.target.value)
              }
            />
          </label>
          <button onClick={() => handleRemoveIngredient(index)}>Remove</button>
        </div>
      ))}

      <button onClick={handleAddIngredient}>Add Ingredient</button>

      <button onClick={handleSave}>Save Changes</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default EditRecipe;
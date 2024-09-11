import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function EditRecipe({ recipe, onClose }) {
  const [name, setName] = useState(recipe.name);
  const [description, setDescription] = useState(recipe.description);

  const handleSave = async () => {
    const recipeDocRef = doc(db, 'recipes', recipe.id);

    // Update the recipe document in Firestore
    await updateDoc(recipeDocRef, {
      name,
      description,
    });

    // Close the edit form after saving
    onClose();
  };

  return (
    <div>
      <h2>Edit Recipe</h2>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default EditRecipe;
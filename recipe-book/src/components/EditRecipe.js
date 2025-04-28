import React, { useState, useEffect } from 'react';
import { doc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import '../EditRecipe.css';

function EditRecipe({ recipe, onClose }) {
  const [name, setName] = useState(recipe.name || '');
  const [description, setDescription] = useState(recipe.description || '');
  const [category, setCategory] = useState(recipe.category || '');
  const [ingredients, setIngredients] = useState(recipe.ingredients || []);
  const [allIngredientNames, setAllIngredientNames] = useState([]);
  const [allUnits, setAllUnits] = useState([]);


  useEffect(() => {
    const fetchIngredientsAndUnits = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'ingredients'));
        const namesSet = new Set();
        const unitsSet = new Set();

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name) namesSet.add(data.name);
          if (data.unit) unitsSet.add(data.unit);
        });

        setAllIngredientNames(Array.from(namesSet));
        setAllUnits(Array.from(unitsSet));
      } catch (error) {
        console.error('Error fetching ingredients and units:', error);
      }
    };

    fetchIngredientsAndUnits();
  }, []);

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    setIngredients(updatedIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleSave = async () => {
    try {
      const recipeDocRef = doc(db, 'recipes', recipe.id);
      await updateDoc(recipeDocRef, {
        name,
        description,
        category,
        ingredients,
      });
      console.log('Recipe updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <div className="edit-recipe">
      <h2>Edit Recipe</h2>

      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <label>
        Category:
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      </label>

      <h3>Ingredients</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index} className="ingredient">
          <label>
            Name:
            <select
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            >
              <option value="">Select Ingredient</option>
              {allIngredientNames.map((nameOption) => (
                <option key={nameOption} value={nameOption}>
                  {nameOption}
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity:
            <input
              type="number"
              step="any"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            />
          </label>

          <label>
            Unit:
            <select
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
            >
              <option value="">Select Unit</option>
              {allUnits.map((unitOption) => (
                <option key={unitOption} value={unitOption}>
                  {unitOption}
                </option>
              ))}
            </select>
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

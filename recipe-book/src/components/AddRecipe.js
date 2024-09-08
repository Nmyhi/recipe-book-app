// src/components/AddRecipe.js
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';


// function for adding recipes
function AddRecipe() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updatedIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "recipes"), {
        name,
        description,
        category,
        ingredients
      });
      setName('');
      setDescription('');
      setCategory('');
      setIngredients([{ name: '', quantity: '', unit: '' }]);
    } catch (error) {
      console.error("Error adding recipe: ", error);
    }
  };

  return (
    <div>
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Recipe Name" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        
        <h4>Ingredients</h4>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              placeholder="Ingredient Name"
              required
            />
            <input
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              type="number"
              required
            />
            <input
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              placeholder="Unit (e.g., grams, pieces)"
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddRecipe;
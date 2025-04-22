import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import '../AddRecipe.css';

function AddRecipe() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [allIngredientNames, setAllIngredientNames] = useState([]);
  const [allUnits, setAllUnits] = useState([]);

  useEffect(() => {
    const fetchIngredientData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'ingredients'));
        const namesSet = new Set();
        const unitsSet = new Set();

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name) namesSet.add(data.name);
          if (data.unit) unitsSet.add(data.unit);
        });

        setAllIngredientNames([...namesSet]);
        setAllUnits([...unitsSet]);
      } catch (error) {
        console.error('Error fetching ingredient data:', error);
      }
    };

    fetchIngredientData();
  }, []);

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
      await addDoc(collection(db, 'recipes'), {
        name,
        description,
        category,
        ingredients,
      });

      // Reset form
      setName('');
      setDescription('');
      setCategory('');
      setIngredients([{ name: '', quantity: '', unit: '' }]);
    } catch (error) {
      console.error('Error adding recipe: ', error);
    }
  };

  return (
    <div className="add-recipe-container">
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <input
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe Name"
          required
        />
        <textarea
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          className="form-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />

        <h4>Ingredients</h4>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-item">
            <select
              className="form-input"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              required
            >
              <option value="">Select Ingredient</option>
              {allIngredientNames.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <input
              className="form-input quantity-input"
              type="number"
              step="any"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              required
            />

            <select
              className="form-input"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              required
            >
              <option value="">Select Unit</option>
              {allUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="button"
          className="add-ingredient-button"
          onClick={handleAddIngredient}
        >
          Add Ingredient
        </button>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddRecipe;

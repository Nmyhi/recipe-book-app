import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../AddRecipe.css';

function AdminRecipeImporter() {
  const [jsonText, setJsonText] = useState('');
  const [message, setMessage] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [missingIngredients, setMissingIngredients] = useState([]);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIngredients();
    fetchCategories();
  }, []);

  const fetchIngredients = async () => {
    const snapshot = await getDocs(collection(db, 'ingredients'));
    setIngredients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, 'categories'));
    setCategories(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleImport = async () => {
    try {
      const recipe = JSON.parse(jsonText);
      if (!recipe.name || !recipe.description || !recipe.category || !Array.isArray(recipe.ingredients)) {
        setMessage('Invalid recipe structure.');
        return;
      }
      await addDoc(collection(db, 'recipes'), recipe);
      setMessage('Recipe added successfully.');
      setJsonText('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to import recipe.');
    }
  };

  const handleCheckIngredients = () => {
    try {
      const recipe = JSON.parse(jsonText);
      const missing = recipe.ingredients.filter(
        (ing) => !ingredients.some((dbIng) => dbIng.name.toLowerCase() === ing.name.toLowerCase())
      );
      setMissingIngredients(missing);
      setMessage(`${missing.length} missing ingredients found.`);
    } catch (err) {
      setMessage('Invalid JSON format.');
    }
  };

  const handleSubmitIngredient = async (e) => {
    e.preventDefault();
    if (!name || !unit || !category) return;

    if (editId) {
      await updateDoc(doc(db, 'ingredients', editId), { name, unit, category });
      setEditId(null);
    } else {
      await addDoc(collection(db, 'ingredients'), { name, unit, category });
    }

    setName('');
    setUnit('');
    setCategory('');
    fetchIngredients();
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this ingredient?');
    if (confirm) {
      await deleteDoc(doc(db, 'ingredients', id));
      fetchIngredients();
    }
  };

  const handleEdit = (ingredient) => {
    setName(ingredient.name);
    setUnit(ingredient.unit);
    setCategory(ingredient.category);
    setEditId(ingredient.id);
  };

  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="add-recipe-container">
      <h2>Admin Recipe Importer</h2>
      <textarea
        rows={10}
        className="form-textarea"
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder="Paste recipe JSON here"
      />
      <button className="submit-button" onClick={handleImport}>Import Recipe</button>
      <button className="submit-button" onClick={handleCheckIngredients}>Check Ingredients</button>
      {message && <p>{message}</p>}

      {missingIngredients.length > 0 && (
        <div>
          <h3>Missing Ingredients</h3>
          <ul>
            {missingIngredients.map((ing, idx) => (
              <li key={idx} style={{ color: 'red' }}>{ing.name} ({ing.quantity} {ing.unit})</li>
            ))}
          </ul>
        </div>
      )}

      <h3>Add/Edit Ingredient</h3>
      <form className="add-ingredient-form" onSubmit={handleSubmitIngredient}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'} Ingredient</button>
      </form>

      <h4>Or Add New Category</h4>
      <div className="add-category-form">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={async () => {
            if (newCategory) {
              await addDoc(collection(db, 'categories'), { name: newCategory });
              setNewCategory('');
              fetchCategories();
            }
          }}
        >
          Add Category
        </button>
      </div>

      <input
        className="search-bar"
        type="text"
        placeholder="Search ingredients..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <ul className="ingredient-list">
          {filteredIngredients.map((ingredient) => (
            <li key={ingredient.id} className="ingredient-item">
              <span>{ingredient.name} ({ingredient.unit}) - {ingredient.category}</span>
              <button onClick={() => handleEdit(ingredient)}>Edit</button>
              <button onClick={() => handleDelete(ingredient.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminRecipeImporter;

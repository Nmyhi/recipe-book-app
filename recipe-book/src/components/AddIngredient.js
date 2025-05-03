import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../AddIngredient.css'; // Optional for styling


function AddIngredient() {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingUnit, setEditingUnit] = useState('');
  const [editingCategory, setEditingCategory] = useState('');

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  // Fetch ingredients
  const fetchIngredients = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'ingredients'));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setIngredients(list);
    } catch (error) {
      console.error('Error fetching ingredients:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(list);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !unit || !category) return;

    try {
      await addDoc(collection(db, 'ingredients'), {
        name: name.trim(),
        unit: unit.trim(),
        category: category.trim()
      });
      setName('');
      setUnit('');
      setCategory('');
      fetchIngredients();
      alert('Ingredient added successfully!');
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'ingredients', id));
      fetchIngredients();
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  const startEditing = (ingredient) => {
    setEditingId(ingredient.id);
    setEditingName(ingredient.name);
    setEditingUnit(ingredient.unit);
    setEditingCategory(ingredient.category || '');
  };

  const handleUpdate = async () => {
    if (!editingName || !editingUnit || !editingCategory) return;
    try {
      const ingredientRef = doc(db, 'ingredients', editingId);
      await updateDoc(ingredientRef, {
        name: editingName.trim(),
        unit: editingUnit.trim(),
        category: editingCategory.trim(),
      });
      setEditingId(null);
      setEditingName('');
      setEditingUnit('');
      setEditingCategory('');
      fetchIngredients();
    } catch (error) {
      console.error('Error updating ingredient:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategory.trim()
      });
      setNewCategory('');
      fetchCategories();
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const startEditingCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategoryName) return;
    try {
      const categoryRef = doc(db, 'categories', editingCategoryId);
      await updateDoc(categoryRef, {
        name: editingCategoryName.trim()
      });
      setEditingCategoryId(null);
      setEditingCategoryName('');
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="add-ingredient-container">
      <h2>Add Ingredient</h2>
      <form onSubmit={handleSubmit} className="add-ingredient-form">
        <input
          type="text"
          placeholder="Ingredient Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Unit (e.g. grams, cups)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Ingredient</button>
      </form>

      <h3>Current Ingredients</h3>
      <ul className="ingredient-list">
        {ingredients.map((ingredient) => (
          <li key={ingredient.id} className="ingredient-item">
            {editingId === ingredient.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <input
                  type="text"
                  value={editingUnit}
                  onChange={(e) => setEditingUnit(e.target.value)}
                />
                <select
                  value={editingCategory}
                  onChange={(e) => setEditingCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>
                  {ingredient.name} ({ingredient.unit}) - {ingredient.category}
                </span>
                <button onClick={() => startEditing(ingredient)}>Edit</button>
                <button onClick={() => handleDelete(ingredient.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2>Manage Categories</h2>
      <div className="add-category-form">
        <input
          type="text"
          placeholder="New Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <h3>Current Categories</h3>
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            {editingCategoryId === cat.id ? (
              <>
                <input
                  type="text"
                  value={editingCategoryName}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <button onClick={handleUpdateCategory}>Save</button>
                <button onClick={() => setEditingCategoryId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{cat.name}</span>
                <button onClick={() => startEditingCategory(cat)}>Edit</button>
                <button onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddIngredient;

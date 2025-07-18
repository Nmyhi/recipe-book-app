/**
 * Enhanced AddIngredient component with edit/delete functionality
 */

import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../AddIngredient.css';

function AddIngredient() {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);

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

  const handleSubmit = async (e) => {
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
    <div className="add-ingredient-container">
      <h2>{editId ? 'Edit Ingredient' : 'Add Ingredient'}</h2>
      <form className="add-ingredient-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="text" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

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

      <h2>Manage Categories</h2>
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

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddIngredient;

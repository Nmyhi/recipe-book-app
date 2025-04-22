// src/components/AddIngredient.js
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import '../AddIngredient.css'; // Optional: create for styling

function AddIngredient() {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !unit) return;

    try {
      await addDoc(collection(db, 'ingredients'), {
        name: name.trim(),
        unit: unit.trim(),
      });

      alert('Ingredient added successfully!');
      setName('');
      setUnit('');
    } catch (error) {
      console.error('Error adding ingredient:', error);
    }
  };

  return (
    <div className="add-ingredient-container">
      <h2>Add Ingredient & Unit</h2>
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
        <button type="submit">Add Ingredient</button>
      </form>
    </div>
  );
}

export default AddIngredient;

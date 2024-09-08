// src/components/ShoppingList.js
import { useState } from 'react';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function ShoppingList() {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);

  const handleGenerateList = async () => {
    const ingredientsMap = {};

    for (const recipeId of selectedRecipes) {
      const recipeDoc = await getDoc(doc(db, 'recipes', recipeId));
      const recipe = recipeDoc.data();
      recipe.ingredients.forEach((ingredient) => {
        if (ingredientsMap[ingredient.name]) {
          ingredientsMap[ingredient.name].quantity += ingredient.quantity;
        } else {
          ingredientsMap[ingredient.name] = { ...ingredient };
        }
      });
    }

    setShoppingList(Object.values(ingredientsMap));

    await addDoc(collection(db, 'shoppingLists'), {
      recipeIds: selectedRecipes,
      ingredients: Object.values(ingredientsMap),
      createdAt: new Date(),
    });
  };

  return (
    <div>
      <h2>Shopping List</h2>
      <button onClick={handleGenerateList}>Generate Shopping List</button>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity} {item.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
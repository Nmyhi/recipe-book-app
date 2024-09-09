// src/components/ShoppingList.js
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

function ShoppingList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recipes from Firestore
  useEffect(() => {
    const recipesCollectionRef = collection(db, 'recipes');
    const unsubscribe = onSnapshot(
      recipesCollectionRef,
      (snapshot) => {
        const fetchedRecipes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(fetchedRecipes);
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleRecipeSelect = (recipeId) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(recipeId)
        ? prevSelected.filter((id) => id !== recipeId) // Unselect recipe if already selected
        : [...prevSelected, recipeId] // Select recipe
    );
  };

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

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error loading recipes: {error.message}</p>;
  }

  return (
    <div>
      <h2>Shopping List</h2>
      
      {/* Recipe selection */}
      <div>
        <h4>Select Recipes:</h4>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id}>
              <input
                type="checkbox"
                id={recipe.id}
                value={recipe.id}
                onChange={() => handleRecipeSelect(recipe.id)}
                checked={selectedRecipes.includes(recipe.id)}
              />
              <label htmlFor={recipe.id}>{recipe.name}</label>
            </div>
          ))
        ) : (
          <p>No recipes available</p>
        )}
      </div>

      <button onClick={handleGenerateList} disabled={selectedRecipes.length === 0}>
        Generate Shopping List
      </button>

      <h4>Shopping List</h4>
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
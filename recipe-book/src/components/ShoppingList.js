import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../ShoppingList.css';

function ShoppingList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shoppingListName, setShoppingListName] = useState('');
  const [listGenerated, setListGenerated] = useState(false);

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

    return () => unsubscribe();
  }, []);

  const handleRecipeSelect = (recipeId) => {
    setSelectedRecipes((prevSelected) =>
      prevSelected.includes(recipeId)
        ? prevSelected.filter((id) => id !== recipeId)
        : [...prevSelected, recipeId]
    );
  };

  const handleGenerateList = async () => {
    const ingredientsMap = {};

    for (const recipeId of selectedRecipes) {
      const recipeDoc = await getDoc(doc(db, 'recipes', recipeId));
      const recipe = recipeDoc.data();

      recipe.ingredients.forEach((ingredient) => {
        const ingredientQuantity = parseFloat(ingredient.quantity);
        if (ingredientsMap[ingredient.name]) {
          ingredientsMap[ingredient.name].quantity += ingredientQuantity;
        } else {
          ingredientsMap[ingredient.name] = { ...ingredient, quantity: ingredientQuantity };
        }
      });
    }

    await addDoc(collection(db, 'shoppingLists'), {
      name: shoppingListName,
      recipeIds: selectedRecipes,
      ingredients: Object.values(ingredientsMap),
      createdAt: new Date(),
    });

    setShoppingListName(''); // Clear the list name input
    setSelectedRecipes([]);  // Clear selected recipes
    setListGenerated(true);  // Set list generated state to true
  };

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p>Error loading recipes: {error.message}</p>;
  }

  return (
    <div className="shopping-list">
      <h2 className="shopping-list-title">Shopping List</h2>

      <input
        type="text"
        placeholder="Enter Shopping List Name"
        value={shoppingListName}
        onChange={(e) => setShoppingListName(e.target.value)}
        required
        className="shopping-list-input"
      />

      <div className="recipe-selection">
        <h4>Select Recipes:</h4>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-item">
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

      <button
        className="generate-button"
        onClick={handleGenerateList}
        disabled={selectedRecipes.length === 0 || !shoppingListName}
      >
        Generate Shopping List
      </button>

      {listGenerated && <p className="confirmation-message">Shopping list has been generated.</p>}
    </div>
  );
}

export default ShoppingList;

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import '../ShoppingLists.css'; // Import the CSS file for styling

function ShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({}); // State to track checked items

  // Fetch shopping lists from Firestore
  useEffect(() => {
    const shoppingListsCollectionRef = collection(db, 'shoppingLists');

    // Using onSnapshot to get real-time updates
    const unsubscribe = onSnapshot(
      shoppingListsCollectionRef,
      (snapshot) => {
        const fetchedShoppingLists = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShoppingLists(fetchedShoppingLists);
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

  // Handle checkbox change for ticking/unticking an ingredient
  const handleCheckboxChange = (listId, ingredientIndex) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [listId]: {
        ...prevCheckedItems[listId],
        [ingredientIndex]: !prevCheckedItems[listId]?.[ingredientIndex],
      },
    }));
  };

  // Handle delete functionality
  const handleDelete = async (shoppingListId) => {
    try {
      await deleteDoc(doc(db, 'shoppingLists', shoppingListId));
      console.log('Shopping list deleted successfully');
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  if (loading) {
    return <p className="loading-message">Loading shopping lists...</p>;
  }

  if (error) {
    return <p className="error-message">Error loading shopping lists: {error.message}</p>;
  }

  return (
    <div className="shopping-lists-container">
      <h2 className="shopping-lists-title">Shopping Lists</h2>
      {shoppingLists.length > 0 ? (
        shoppingLists.map((list) => (
          <div key={list.id} className="shopping-lists-item">
            <h3 className="shopping-list-name">{list.name}</h3> {/* Assuming each shopping list has a name */}
            <h4 className="ingredients-title">Ingredients:</h4>
            <ul className="ingredients-list">
              {list.ingredients.map((ingredient, index) => (
                <li key={index} className={`ingredient-item ${checkedItems[list.id]?.[index] ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={!!checkedItems[list.id]?.[index]}
                    onChange={() => handleCheckboxChange(list.id, index)}
                    className="ingredient-checkbox"
                  />
                  <span className="ingredient-text">{ingredient.name} - {ingredient.quantity} {ingredient.unit}</span>
                </li>
              ))}
            </ul>
            {/* Button to delete shopping list */}
            <button className="delete-button" onClick={() => handleDelete(list.id)}>Delete List</button>
          </div>
        ))
      ) : (
        <p className="no-lists-message">No shopping lists found.</p>
      )}
    </div>
  );
}

export default ShoppingLists;
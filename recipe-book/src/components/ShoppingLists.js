import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../ShoppingLists.css';

function ShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [expandedList, setExpandedList] = useState(null); // Track expanded list
  const [checkedItems, setCheckedItems] = useState({}); // Track checked items

  useEffect(() => {
    const shoppingListsCollectionRef = collection(db, 'shoppingLists');
    const unsubscribe = onSnapshot(shoppingListsCollectionRef, (snapshot) => {
      const fetchedShoppingLists = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoppingLists(fetchedShoppingLists);
    });

    return () => unsubscribe();
  }, []);

  // Load checked items from localStorage
  useEffect(() => {
    const savedCheckedItems = JSON.parse(localStorage.getItem('checkedItems')) || {};
    setCheckedItems(savedCheckedItems);
  }, []);

  // Save checked items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleList = (listId) => {
    // If the clicked list is already expanded, do not change its state
    setExpandedList((prev) => (prev === listId ? prev : listId));
  };

  const handleCheckboxChange = (listId, ingredientIndex) => {
    setCheckedItems((prev) => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        [ingredientIndex]: !prev[listId]?.[ingredientIndex],
      },
    }));
  };

  const handleDelete = async (shoppingListId) => {
    try {
      await deleteDoc(doc(db, 'shoppingLists', shoppingListId));
      console.log('Shopping list deleted successfully');
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  return (
    <div className="shopping-lists-container">
      <h2 className="shopping-lists-title">Shopping Lists</h2>
      {shoppingLists.length > 0 ? (
        shoppingLists.map((list) => (
          <div
            key={list.id}
            className="shopping-list-card"
            onClick={() => toggleList(list.id)}
          >
            <h3 className="shopping-list-name">{list.name}</h3>
            {expandedList === list.id && (
              <div className="ingredients-container">
                <h4 className="ingredients-title">Ingredients:</h4>
                <ul className="ingredients-list">
                  {list.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      <span className={`ingredient-text ${checkedItems[list.id]?.[index] ? 'checked' : ''}`}>
                        {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                      </span>
                      <input
                        type="checkbox"
                        checked={!!checkedItems[list.id]?.[index]}
                        onChange={() => handleCheckboxChange(list.id, index)}
                        className="ingredient-checkbox"
                      />
                    </li>
                  ))}
                </ul>
                <button
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(list.id);
                  }}
                >
                  Delete List
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="no-lists-message">No shopping lists found.</p>
      )}
    </div>
  );
}

export default ShoppingLists;

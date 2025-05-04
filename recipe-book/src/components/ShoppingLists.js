import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../ShoppingLists.css';

function ShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [expandedList, setExpandedList] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

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

  useEffect(() => {
    const savedCheckedItems = JSON.parse(localStorage.getItem('checkedItems')) || {};
    setCheckedItems(savedCheckedItems);
  }, []);

  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleList = (listId) => {
    setExpandedList((prev) => (prev === listId ? null : listId));
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

                {/** Group by category */}
                {Object.entries(
                  list.ingredients.reduce((groups, ingredient, index) => {
                    const category = ingredient.category || 'Uncategorized';
                    if (!groups[category]) {
                      groups[category] = [];
                    }
                    groups[category].push({ ...ingredient, index });
                    return groups;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category} className="ingredient-category-group">
                    <h5 className="ingredient-category-title">{category}</h5>
                    <ul className="ingredients-list">
                      {items.map(({ name, quantity, unit, index }) => (
                        <li key={index} className="ingredient-item">
                          <span className={`ingredient-text ${checkedItems[list.id]?.[index] ? 'checked' : ''}`}>
                            {name} - {quantity} {unit}
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
                  </div>
                ))}

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

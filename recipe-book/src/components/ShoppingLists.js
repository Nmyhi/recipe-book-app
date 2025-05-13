import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../ShoppingLists.css';

const categoryEmojiMap = {
  'chilled': '❄️',
  'misc': '🥫',
  'condiment': '🧂',
  'fruit and veg': '🍎',
};

function ShoppingLists() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [expandedList, setExpandedList] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'shoppingLists'), (snapshot) => {
      setShoppingLists(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
    } catch (error) {
      console.error('Error deleting shopping list:', error);
    }
  };

  return (
    <div className="shopping-lists-container">
      <h2 className="shopping-lists-title">🛒 Shopping Lists</h2>
      {shoppingLists.length ? (
        shoppingLists.map((list) => (
          <div key={list.id} className="shopping-list-card" onClick={() => toggleList(list.id)}>
            <h3 className="shopping-list-name">📃 {list.name}</h3>
            {expandedList === list.id && (
              <div className="ingredients-container">
                {Object.entries(
                  list.ingredients.reduce((acc, item, idx) => {
                    const cat = item.category || 'Uncategorized';
                    acc[cat] = acc[cat] || [];
                    acc[cat].push({ ...item, idx });
                    return acc;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category} className="ingredient-category-group">
                    <h5 className="ingredient-category-title">
                      {categoryEmojiMap[category] || '📌'} {category}
                    </h5>
                    <ul className="ingredients-list">
                      {items.map(({ name, quantity, unit, idx }) => (
                        <li key={idx} className="ingredient-item">
                          <input
                            type="checkbox"
                            checked={!!checkedItems[list.id]?.[idx]}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleCheckboxChange(list.id, idx);
                            }}
                            className="ingredient-checkbox"
                          />
                          <span className={`ingredient-text ${checkedItems[list.id]?.[idx] ? 'checked' : ''}`}>
                            {name} - {quantity} {unit}
                          </span>
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
                  🗑️ Delete List
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

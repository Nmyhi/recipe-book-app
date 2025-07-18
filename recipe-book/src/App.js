// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import AddRecipe from './components/AddRecipe';
import RecipeList from './components/RecipeList';
import ShoppingList from './components/ShoppingList';
import ShoppingLists from './components/ShoppingLists';
import AddIngredient from './components/AddIngredient'; // Import the new component
import AiRecipe from './components/AiRecipe'; //AI recipe
import AdminRecipeImporter from './components/AdminRecipeImporter'; //admin json importer

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/admin" element={<AdminRecipeImporter />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipes" element={<RecipeList />} />
          <Route path="/view-shopping-lists" element={<ShoppingLists />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/add-ingredient" element={<AddIngredient />} /> {/* New route */}
          <Route path="/" element={<ShoppingList />} /> {/* Default route */}
          <Route path="/ai-recipe" element={<AiRecipe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

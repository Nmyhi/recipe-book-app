import './App.css';
import AddRecipe from './components/AddRecipe';
import RecipeList from './components/RecipeList';
import ShoppingList from './components/ShoppingList';

function App() {
  return (
    <div className="App">
      <AddRecipe/>
      <ShoppingList/>
      <RecipeList/>
    </div>
  );
}

export default App;

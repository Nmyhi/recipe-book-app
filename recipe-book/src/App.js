import './App.css';
import AddRecipe from './components/AddRecipe';
import EditRecipe from './components/EditRecipe';
import RecipeList from './components/RecipeList';
import ShoppingList from './components/ShoppingList';

function App() {
  return (
    <div className="App">
      <AddRecipe/>
      <RecipeList/>
      <ShoppingList/>
    </div>
  );
}

export default App;

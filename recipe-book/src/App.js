import './App.css';
import AddRecipe from './components/AddRecipe';
import RecipeList from './components/RecipeList';
import ShoppingList from './components/ShoppingList';
import ShoppingLists from './components/ShoppingLists';

function App() {
  return (
    <div className="App">
      <AddRecipe/>
      <RecipeList/>
      <ShoppingList/>
      <ShoppingLists/>
    </div>
  );
}

export default App;

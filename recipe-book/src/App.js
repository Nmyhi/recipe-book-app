import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AddRecipe from './components/AddRecipe';
import Navbar from './components/NavBar';
import RecipeList from './components/RecipeList';
import ShoppingList from './components/ShoppingList';
import ShoppingLists from './components/ShoppingLists';

function App() {
  return (
    <div className="App">
      <Navbar/>
    </div>
  );
}

export default App;

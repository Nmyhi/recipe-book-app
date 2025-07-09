import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../AddRecipe.css';

function AdminRecipeImporter() {
  const [jsonText, setJsonText] = useState('');
  const [message, setMessage] = useState('');

  const handleImport = async () => {
    try {
      const recipe = JSON.parse(jsonText);
      if (!recipe.name || !recipe.description || !recipe.category || !Array.isArray(recipe.ingredients)) {
        setMessage('Invalid recipe structure.');
        return;
      }
      await addDoc(collection(db, 'recipes'), recipe);
      setMessage('Recipe added successfully.');
      setJsonText('');
    } catch (err) {
      console.error(err);
      setMessage('Failed to import recipe.');
    }
  };

  return (
    <div className="add-recipe-container">
      <h2>Admin Recipe Importer</h2>
      <textarea
        rows={10}
        className="form-textarea"
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder="Paste recipe JSON here"
      />
      <button className="submit-button" onClick={handleImport}>Import Recipe</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminRecipeImporter;

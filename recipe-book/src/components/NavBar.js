import React, { useState } from 'react';
import '../Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>Recipe App</h1>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <a href="/view-shopping-lists" className="nav-links">
              View Shopping Lists
            </a>
          </li>
          <li className="nav-item">
            <a href="/edit-recipes" className="nav-links">
              Edit Recipes
            </a>
          </li>
          <li className="nav-item">
            <a href="/add-recipe" className="nav-links">
              Add Recipe
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="nav-links" onClick={closeMenu}>
            Recipe App
          </Link>
        </div>
        <div className="menu-icon" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>
        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/view-shopping-lists" className="nav-links" onClick={closeMenu}>
              View Shopping Lists
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/edit-recipes" className="nav-links" onClick={closeMenu}>
              Edit Recipes
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add-recipe" className="nav-links" onClick={closeMenu}>
              Add Recipe
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add-ingredient" className="nav-links" onClick={closeMenu}>
              Add Ingredient
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

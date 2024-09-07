# recipe-book-app
Rewcipe book app to plan a diet and generate shopping lists.

# Wireframes

[Wireframes](assets/redmeimages/nD8QgEHuGKSpgWoYbPamMk.png)

# Database model
- recipes (Collection)

Recipe documents
id: auto-generated
name: string (Recipe Name)
description: string (Detailed description of the recipe)
category: string (e.g., "Breakfast", "Dessert", etc.)
ingredients: array of ingredient objects
Each ingredient object will contain:
    name: string (e.g., "Tomato", "Milk")
    quantity: number (e.g., 200)
    unit: string (e.g., "grams", "ml", "pieces")


- ingredients (Collection)

Ingredient documents
id: auto-generated
name: string (e.g., "Tomato")
defaultUnit: string (e.g., "grams", "pieces", etc.)

- shoppingLists (Collection)

Shopping list documents
id: auto-generated
recipeIds: array of recipe IDs (from the recipes collection)
createdAt: timestamp
    ingredients: array of ingredient objects with total quantities
    name: string
    totalQuantity: number
    unit: string
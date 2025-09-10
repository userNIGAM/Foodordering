// seedDatabase.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import MenuItem from "../models/MenuItem.js";
import ConnectDB from "../config/db.js";

dotenv.config();
ConnectDB();

export const menuItems = [
  // Burgers
  {
    name: "Classic Cheeseburger",
    category: "burgers",
    price: 8.99,
    description:
      "Juicy beef patty with cheese, lettuce, tomato, and special sauce.",
    calories: 560,
    prepTime: 10,
    rating: 4.5,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Beef Patty",
      "Cheese",
      "Lettuce",
      "Tomato",
      "Special Sauce",
      "Bun",
    ],
    tags: ["beef", "cheese", "classic"],
  },
  {
    name: "Bacon Deluxe Burger",
    category: "burgers",
    price: 10.99,
    description:
      "Double beef patty with crispy bacon, cheddar cheese, and BBQ sauce.",
    calories: 780,
    prepTime: 12,
    rating: 4.7,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Double Beef Patty",
      "Bacon",
      "Cheddar Cheese",
      "BBQ Sauce",
      "Onions",
      "Bun",
    ],
    tags: ["beef", "bacon", "double"],
  },
  {
    name: "Veggie Burger",
    category: "burgers",
    price: 9.49,
    description: "Plant-based patty with avocado, sprouts, and garlic aioli.",
    calories: 420,
    prepTime: 8,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Plant-based Patty",
      "Avocado",
      "Sprouts",
      "Garlic Aioli",
      "Bun",
    ],
    tags: ["vegetarian", "vegan", "healthy"],
  },
  {
    name: "Spicy Chicken Burger",
    category: "burgers",
    price: 9.99,
    description: "Crispy chicken fillet with spicy mayo, lettuce, and pickles.",
    calories: 620,
    prepTime: 11,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Chicken Fillet", "Spicy Mayo", "Lettuce", "Pickles", "Bun"],
    tags: ["chicken", "spicy", "crispy"],
  },
  {
    name: "Mushroom Swiss Burger",
    category: "burgers",
    price: 11.49,
    description: "Beef patty topped with sautéed mushrooms and Swiss cheese.",
    calories: 650,
    prepTime: 13,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Beef Patty",
      "Mushrooms",
      "Swiss Cheese",
      "Caramelized Onions",
      "Bun",
    ],
    tags: ["beef", "mushrooms", "swiss"],
  },

  // Pizzas
  {
    name: "Pepperoni Pizza",
    category: "pizzas",
    price: 14.99,
    description: "Classic pizza with extra cheese and double pepperoni.",
    calories: 820,
    prepTime: 15,
    rating: 4.8,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Mozzarella", "Pepperoni"],
    tags: ["classic", "pepperoni", "cheesy"],
  },
  {
    name: "Margherita Pizza",
    category: "pizzas",
    price: 12.99,
    description:
      "Simple and delicious with tomato sauce, fresh mozzarella, and basil.",
    calories: 720,
    prepTime: 14,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Pizza Dough", "Tomato Sauce", "Fresh Mozzarella", "Basil"],
    tags: ["classic", "simple", "fresh"],
  },
  {
    name: "Supreme Pizza",
    category: "pizzas",
    price: 16.99,
    description:
      "Loaded with pepperoni, sausage, mushrooms, onions, and bell peppers.",
    calories: 920,
    prepTime: 17,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Pizza Dough",
      "Tomato Sauce",
      "Mozzarella",
      "Pepperoni",
      "Sausage",
      "Mushrooms",
      "Onions",
      "Bell Peppers",
    ],
    tags: ["loaded", "meatlovers", "veggies"],
  },
  {
    name: "BBQ Chicken Pizza",
    category: "pizzas",
    price: 15.99,
    description:
      "BBQ sauce base with grilled chicken, red onions, and cilantro.",
    calories: 780,
    prepTime: 16,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Pizza Dough",
      "BBQ Sauce",
      "Mozzarella",
      "Grilled Chicken",
      "Red Onions",
      "Cilantro",
    ],
    tags: ["bbq", "chicken", "savory"],
  },
  {
    name: "Veggie Supreme Pizza",
    category: "pizzas",
    price: 15.49,
    description:
      "Loaded with mushrooms, bell peppers, onions, olives, and tomatoes.",
    calories: 680,
    prepTime: 15,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Pizza Dough",
      "Tomato Sauce",
      "Mozzarella",
      "Mushrooms",
      "Bell Peppers",
      "Onions",
      "Olives",
      "Tomatoes",
    ],
    tags: ["vegetarian", "veggie", "healthy"],
  },

  // Sandwiches
  {
    name: "Club Sandwich",
    category: "sandwiches",
    price: 9.99,
    description: "Triple-decker with turkey, bacon, lettuce, tomato, and mayo.",
    calories: 580,
    prepTime: 8,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Turkey", "Bacon", "Lettuce", "Tomato", "Mayo", "Bread"],
    tags: ["turkey", "bacon", "classic"],
  },
  {
    name: "Philly Cheesesteak",
    category: "sandwiches",
    price: 11.99,
    description:
      "Thinly sliced steak with melted cheese and grilled onions on a hoagie roll.",
    calories: 720,
    prepTime: 10,
    rating: 4.7,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Steak", "Provolone Cheese", "Grilled Onions", "Hoagie Roll"],
    tags: ["steak", "cheese", "philly"],
  },
  {
    name: "Chicken Caesar Wrap",
    category: "sandwiches",
    price: 8.99,
    description:
      "Grilled chicken, romaine lettuce, parmesan, and Caesar dressing in a wrap.",
    calories: 480,
    prepTime: 7,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Grilled Chicken",
      "Romaine Lettuce",
      "Parmesan",
      "Caesar Dressing",
      "Tortilla Wrap",
    ],
    tags: ["chicken", "caesar", "wrap"],
  },
  {
    name: "BLT Sandwich",
    category: "sandwiches",
    price: 8.49,
    description:
      "Crispy bacon, lettuce, and tomato with mayo on toasted bread.",
    calories: 520,
    prepTime: 6,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Bacon", "Lettuce", "Tomato", "Mayo", "Toasted Bread"],
    tags: ["bacon", "classic", "simple"],
  },
  {
    name: "Turkey Avocado Club",
    category: "sandwiches",
    price: 10.49,
    description:
      "Sliced turkey, bacon, avocado, lettuce, and tomato on multigrain bread.",
    calories: 560,
    prepTime: 9,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Turkey",
      "Bacon",
      "Avocado",
      "Lettuce",
      "Tomato",
      "Multigrain Bread",
    ],
    tags: ["turkey", "avocado", "healthy"],
  },

  // Fries & Sides
  {
    name: "French Fries",
    category: "fries",
    price: 3.99,
    description: "Crispy golden fries with a sprinkle of sea salt.",
    calories: 365,
    prepTime: 6,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1634034379073-f689b460a3fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Potatoes", "Sea Salt", "Vegetable Oil"],
    tags: ["classic", "salty", "crispy"],
  },
  {
    name: "Onion Rings",
    category: "fries",
    price: 4.99,
    description: "Beer-battered onion rings served with ranch dipping sauce.",
    calories: 410,
    prepTime: 7,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1634034379073-f689b460a3fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Onions", "Beer Batter", "Ranch Dressing"],
    tags: ["crispy", "beer-battered", "appetizer"],
  },
  {
    name: "Sweet Potato Fries",
    category: "fries",
    price: 4.49,
    description: "Crispy sweet potato fries with a hint of cinnamon.",
    calories: 380,
    prepTime: 8,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1634034379073-f689b460a3fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Sweet Potatoes", "Cinnamon", "Vegetable Oil"],
    tags: ["sweet", "cinnamon", "healthy"],
  },
  {
    name: "Mozzarella Sticks",
    category: "fries",
    price: 5.99,
    description:
      "Breaded and fried mozzarella sticks served with marinara sauce.",
    calories: 480,
    prepTime: 9,
    rating: 4.6,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1634034379073-f689b460a3fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Mozzarella Cheese", "Breadcrumbs", "Marinara Sauce"],
    tags: ["cheesy", "fried", "appetizer"],
  },
  {
    name: "Loaded Nachos",
    category: "fries",
    price: 8.99,
    description:
      "Tortilla chips topped with cheese, jalapeños, salsa, and sour cream.",
    calories: 620,
    prepTime: 10,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1634034379073-f689b460a3fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Tortilla Chips",
      "Cheese",
      "Jalapeños",
      "Salsa",
      "Sour Cream",
    ],
    tags: ["loaded", "spicy", "shareable"],
  },

  // Beverages
  {
    name: "Cola",
    category: "beverages",
    price: 2.49,
    description: "Refreshing cola served with ice.",
    calories: 180,
    prepTime: 2,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Cola", "Ice"],
    tags: ["soda", "cold", "refreshing"],
  },
  {
    name: "Iced Tea",
    category: "beverages",
    price: 2.29,
    description: "Freshly brewed iced tea with lemon.",
    calories: 80,
    prepTime: 3,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Tea", "Lemon", "Ice", "Sugar"],
    tags: ["tea", "refreshing", "lemon"],
  },
  {
    name: "Orange Juice",
    category: "beverages",
    price: 3.49,
    description: "Freshly squeezed orange juice.",
    calories: 120,
    prepTime: 3,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Oranges"],
    tags: ["juice", "fresh", "vitamin-c"],
  },
  {
    name: "Milkshake (Chocolate)",
    category: "beverages",
    price: 4.99,
    description: "Creamy chocolate milkshake topped with whipped cream.",
    calories: 420,
    prepTime: 5,
    rating: 4.7,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Ice Cream", "Chocolate Syrup", "Milk", "Whipped Cream"],
    tags: ["chocolate", "creamy", "dessert"],
  },
  {
    name: "Lemonade",
    category: "beverages",
    price: 2.99,
    description: "Freshly squeezed lemonade with a hint of mint.",
    calories: 110,
    prepTime: 4,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Lemons", "Sugar", "Water", "Mint"],
    tags: ["refreshing", "tangy", "summer"],
  },
  {
    name: "Iced Coffee",
    category: "beverages",
    price: 3.99,
    description: "Chilled coffee with cream and sweetener.",
    calories: 90,
    prepTime: 4,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Coffee", "Cream", "Sweetener", "Ice"],
    tags: ["coffee", "caffeine", "chilled"],
  },
  {
    name: "Strawberry Smoothie",
    category: "beverages",
    price: 4.49,
    description: "Blended strawberries, yogurt, and honey.",
    calories: 180,
    prepTime: 5,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Strawberries", "Yogurt", "Honey", "Ice"],
    tags: ["smoothie", "fruity", "healthy"],
  },

  // Desserts
  {
    name: "Chocolate Brownie",
    category: "desserts",
    price: 4.49,
    description: "Rich chocolate brownie with walnuts.",
    calories: 380,
    prepTime: 3,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Chocolate", "Flour", "Sugar", "Walnuts", "Butter"],
    tags: ["chocolate", "brownie", "walnuts"],
  },
  {
    name: "New York Cheesecake",
    category: "desserts",
    price: 5.99,
    description: "Creamy cheesecake with a graham cracker crust.",
    calories: 480,
    prepTime: 2,
    rating: 4.8,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Cream Cheese",
      "Graham Cracker",
      "Sugar",
      "Eggs",
      "Sour Cream",
    ],
    tags: ["cheesecake", "creamy", "classic"],
  },
  {
    name: "Apple Pie",
    category: "desserts",
    price: 4.99,
    description: "Warm apple pie with a flaky crust and cinnamon.",
    calories: 420,
    prepTime: 4,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Apples", "Flour", "Butter", "Cinnamon", "Sugar"],
    tags: ["pie", "apple", "cinnamon"],
  },
  {
    name: "Chocolate Chip Cookies",
    category: "desserts",
    price: 3.99,
    description: "Freshly baked chocolate chip cookies.",
    calories: 320,
    prepTime: 2,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Flour", "Chocolate Chips", "Butter", "Sugar", "Eggs"],
    tags: ["cookies", "chocolate", "fresh"],
  },
  {
    name: "Ice Cream Sundae",
    category: "desserts",
    price: 5.49,
    description: "Vanilla ice cream with hot fudge, nuts, and a cherry on top.",
    calories: 450,
    prepTime: 3,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Vanilla Ice Cream", "Hot Fudge", "Nuts", "Cherry"],
    tags: ["ice cream", "sundae", "fudge"],
  },

  // Starters
  {
    name: "Buffalo Wings",
    category: "starters",
    price: 8.99,
    description: "Crispy chicken wings tossed in spicy buffalo sauce.",
    calories: 520,
    prepTime: 12,
    rating: 4.6,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "Chicken Wings",
      "Buffalo Sauce",
      "Butter",
      "Celery",
      "Ranch Dressing",
    ],
    tags: ["spicy", "wings", "appetizer"],
  },
  {
    name: "Mozzarella Sticks",
    category: "starters",
    price: 6.99,
    description:
      "Breaded and fried mozzarella sticks served with marinara sauce.",
    calories: 480,
    prepTime: 9,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Mozzarella Cheese", "Breadcrumbs", "Marinara Sauce"],
    tags: ["cheesy", "fried", "appetizer"],
  },
  {
    name: "Garlic Bread",
    category: "starters",
    price: 4.99,
    description: "Toasted bread with garlic butter and herbs.",
    calories: 320,
    prepTime: 5,
    rating: 4.3,
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Bread", "Garlic Butter", "Herbs"],
    tags: ["garlic", "bread", "buttery"],
  },
  {
    name: "Onion Rings",
    category: "starters",
    price: 5.49,
    description: "Beer-battered onion rings served with ranch dipping sauce.",
    calories: 410,
    prepTime: 7,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Onions", "Beer Batter", "Ranch Dressing"],
    tags: ["crispy", "beer-battered", "appetizer"],
  },
  {
    name: "Potato Skins",
    category: "starters",
    price: 7.99,
    description: "Crispy potato skins loaded with cheese and bacon.",
    calories: 480,
    prepTime: 10,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Potatoes", "Cheese", "Bacon", "Sour Cream"],
    tags: ["potato", "cheesy", "bacon"],
  },

  // Mains
  {
    name: "Grilled Salmon",
    category: "mains",
    price: 16.99,
    description:
      "Atlantic salmon fillet with lemon butter sauce and seasonal vegetables.",
    calories: 450,
    prepTime: 20,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Salmon", "Lemon Butter Sauce", "Seasonal Vegetables"],
    tags: ["seafood", "healthy", "grilled"],
  },
  {
    name: "BBQ Ribs",
    category: "mains",
    price: 18.99,
    description:
      "Slow-cooked pork ribs with BBQ sauce, served with coleslaw and fries.",
    calories: 780,
    prepTime: 25,
    rating: 4.8,
    isPopular: true,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Pork Ribs", "BBQ Sauce", "Coleslaw", "Fries"],
    tags: ["bbq", "ribs", "slow-cooked"],
  },
  {
    name: "Chicken Alfredo Pasta",
    category: "mains",
    price: 14.99,
    description:
      "Fettuccine pasta with grilled chicken and creamy Alfredo sauce.",
    calories: 620,
    prepTime: 15,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Fettuccine", "Grilled Chicken", "Alfredo Sauce", "Parmesan"],
    tags: ["pasta", "creamy", "chicken"],
  },
  {
    name: "Beef Stir Fry",
    category: "mains",
    price: 15.99,
    description:
      "Sliced beef with mixed vegetables in a savory stir-fry sauce.",
    calories: 480,
    prepTime: 18,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Beef", "Mixed Vegetables", "Stir-fry Sauce", "Rice"],
    tags: ["stir-fry", "beef", "asian"],
  },
  {
    name: "Vegetable Lasagna",
    category: "mains",
    price: 13.99,
    description: "Layers of pasta, vegetables, and cheese with tomato sauce.",
    calories: 520,
    prepTime: 22,
    rating: 4.4,
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: ["Pasta", "Vegetables", "Cheese", "Tomato Sauce"],
    tags: ["vegetarian", "pasta", "cheesy"],
  },
];

const importData = async () => {
  try {
    await ConnectDB();
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Category = require("./models/Category");
const Meal = require("./models/Meal");
const PromoCode = require("./models/PromoCode");

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");

    await User.deleteMany({});
    await Category.deleteMany({});
    await Meal.deleteMany({});
    await PromoCode.deleteMany({});

    const admin = await User.create({
      name: "Admin",
      email: "admin@restaurant.com",
      password: "admin123",
      role: "admin",
      phone: "+1234567890",
      address: "123 Admin St, City",
    });

    const customer = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user",
      phone: "+0987654321",
      address: "456 Customer Ave, Town",
    });

    console.log("Users seeded");

    const categories = await Category.insertMany([
      {
        name: "Pizzas",
        slug: "pizzas",
        description: "Wood-fired pizzas with premium toppings",
        color: "#e74c3c",
      },
      {
        name: "Burgers",
        slug: "burgers",
        description: "Juicy burgers with fresh ingredients",
        color: "#f39c12",
      },
      {
        name: "Pastas",
        slug: "pastas",
        description: "Authentic Italian pasta dishes",
        color: "#27ae60",
      },
      {
        name: "Salads",
        slug: "salads",
        description: "Fresh and healthy salad bowls",
        color: "#3498db",
      },
      {
        name: "Drinks",
        slug: "drinks",
        description: "Refreshing beverages and cocktails",
        color: "#9b59b6",
      },
    ]);

    console.log("Categories seeded");

    const pizzasCat = categories[0]._id;
    const burgersCat = categories[1]._id;
    const pastasCat = categories[2]._id;
    const saladsCat = categories[3]._id;
    const drinksCat = categories[4]._id;

    const meals = await Meal.insertMany([
      {
        name: "Margherita Pizza",
        description:
          "Classic tomato sauce, fresh mozzarella, basil leaves, and extra virgin olive oil on a crispy thin crust.",
        price: 14.99,
        category: pizzasCat,
        options: [
          { title: "Small (8\")", additionalPrice: 0 },
          { title: "Medium (12\")", additionalPrice: 4 },
          { title: "Large (16\")", additionalPrice: 7 },
        ],
        ingredients: [
          "Tomato Sauce",
          "Mozzarella",
          "Basil",
          "Olive Oil",
          "Dough",
        ],
        preparationTime: 18,
        isAvailable: true,
        isFeatured: true,
        nutritionalInfo: { calories: 266, protein: 12, carbs: 33, fat: 10, fiber: 2 },
        allergens: ["Gluten", "Dairy"],
        dietaryLabels: ["vegetarian"],
      },
      {
        name: "Pepperoni Pizza",
        description:
          "Loaded with premium pepperoni, mozzarella cheese, and our signature tomato sauce.",
        price: 16.99,
        category: pizzasCat,
        options: [
          { title: "Small (8\")", additionalPrice: 0 },
          { title: "Medium (12\")", additionalPrice: 4 },
          { title: "Large (16\")", additionalPrice: 7 },
        ],
        ingredients: [
          "Pepperoni",
          "Mozzarella",
          "Tomato Sauce",
          "Dough",
        ],
        preparationTime: 18,
        isAvailable: true,
        isFeatured: true,
        nutritionalInfo: { calories: 311, protein: 14, carbs: 33, fat: 14, fiber: 2 },
        allergens: ["Gluten", "Dairy"],
        dietaryLabels: [],
      },
      {
        name: "BBQ Chicken Pizza",
        description:
          "Grilled chicken, BBQ sauce, red onions, cilantro, and a blend of mozzarella and smoked gouda.",
        price: 17.99,
        category: pizzasCat,
        options: [
          { title: "Small (8\")", additionalPrice: 0 },
          { title: "Medium (12\")", additionalPrice: 4 },
          { title: "Large (16\")", additionalPrice: 7 },
        ],
        ingredients: [
          "Chicken",
          "BBQ Sauce",
          "Red Onion",
          "Mozzarella",
          "Gouda",
          "Cilantro",
        ],
        preparationTime: 20,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 290, protein: 16, carbs: 32, fat: 11, fiber: 2 },
        allergens: ["Gluten", "Dairy"],
        dietaryLabels: [],
      },
      {
        name: "Veggie Supreme Pizza",
        description:
          "Bell peppers, mushrooms, olives, onions, tomatoes, and mozzarella on a garlic herb crust.",
        price: 15.99,
        category: pizzasCat,
        options: [
          { title: "Small (8\")", additionalPrice: 0 },
          { title: "Medium (12\")", additionalPrice: 4 },
          { title: "Large (16\")", additionalPrice: 7 },
        ],
        ingredients: [
          "Bell Peppers",
          "Mushrooms",
          "Olives",
          "Onions",
          "Tomatoes",
          "Mozzarella",
        ],
        preparationTime: 20,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 240, protein: 10, carbs: 31, fat: 9, fiber: 4 },
        allergens: ["Gluten", "Dairy"],
        dietaryLabels: ["vegetarian"],
      },
      {
        name: "Classic Beef Burger",
        description:
          "Flame-grilled beef patty with lettuce, tomato, pickles, onions, and our special sauce on a brioche bun.",
        price: 12.99,
        category: burgersCat,
        options: [
          { title: "Single", additionalPrice: 0 },
          { title: "Double", additionalPrice: 4 },
          { title: "Triple", additionalPrice: 7 },
        ],
        ingredients: [
          "Beef Patty",
          "Lettuce",
          "Tomato",
          "Pickles",
          "Onions",
          "Special Sauce",
          "Brioche Bun",
        ],
        preparationTime: 12,
        isAvailable: true,
        isFeatured: true,
        nutritionalInfo: { calories: 540, protein: 32, carbs: 40, fat: 28, fiber: 3 },
        allergens: ["Gluten", "Sesame"],
        dietaryLabels: [],
      },
      {
        name: "Chicken Burger",
        description:
          "Crispy chicken fillet with coleslaw, lettuce, and spicy mayo on a toasted sesame bun.",
        price: 11.99,
        category: burgersCat,
        options: [
          { title: "Single", additionalPrice: 0 },
          { title: "Double", additionalPrice: 4 },
        ],
        ingredients: [
          "Chicken Fillet",
          "Coleslaw",
          "Lettuce",
          "Spicy Mayo",
          "Sesame Bun",
        ],
        preparationTime: 12,
        isAvailable: true,
        isFeatured: true,
        nutritionalInfo: { calories: 480, protein: 28, carbs: 42, fat: 22, fiber: 2 },
        allergens: ["Gluten", "Sesame"],
        dietaryLabels: [],
      },
      {
        name: "Mushroom Swiss Burger",
        description:
          "Beef patty topped with sautéed mushrooms, Swiss cheese, and garlic aioli.",
        price: 13.99,
        category: burgersCat,
        options: [
          { title: "Single", additionalPrice: 0 },
          { title: "Double", additionalPrice: 4 },
        ],
        ingredients: [
          "Beef Patty",
          "Mushrooms",
          "Swiss Cheese",
          "Garlic Aioli",
          "Brioche Bun",
        ],
        preparationTime: 14,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 560, protein: 34, carbs: 38, fat: 30, fiber: 2 },
        allergens: ["Gluten", "Dairy", "Sesame"],
        dietaryLabels: [],
      },
      {
        name: "Spicy Chicken Burger",
        description:
          "Crispy spicy chicken with jalapeños, pepper jack cheese, and chipotle mayo.",
        price: 12.49,
        category: burgersCat,
        options: [
          { title: "Single", additionalPrice: 0 },
          { title: "Double", additionalPrice: 4 },
        ],
        ingredients: [
          "Spicy Chicken",
          "Jalapeños",
          "Pepper Jack",
          "Chipotle Mayo",
          "Brioche Bun",
        ],
        preparationTime: 12,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 510, protein: 30, carbs: 40, fat: 24, fiber: 2 },
        allergens: ["Gluten", "Sesame"],
        dietaryLabels: ["spicy"],
      },
      {
        name: "Spaghetti Carbonara",
        description:
          "Classic Italian pasta with pancetta, egg, parmesan, and black pepper in a creamy sauce.",
        price: 14.99,
        category: pastasCat,
        options: [
          { title: "Regular", additionalPrice: 0 },
          { title: "Large", additionalPrice: 4 },
        ],
        ingredients: [
          "Spaghetti",
          "Pancetta",
          "Egg",
          "Parmesan",
          "Black Pepper",
        ],
        preparationTime: 15,
        isAvailable: true,
        isFeatured: true,
        nutritionalInfo: { calories: 480, protein: 22, carbs: 52, fat: 20, fiber: 3 },
        allergens: ["Gluten", "Dairy", "Eggs"],
        dietaryLabels: [],
      },
      {
        name: "Penne Arrabbiata",
        description:
          "Penne pasta in a spicy tomato sauce with garlic, chili flakes, and fresh parsley.",
        price: 12.99,
        category: pastasCat,
        options: [
          { title: "Regular", additionalPrice: 0 },
          { title: "Large", additionalPrice: 4 },
        ],
        ingredients: [
          "Penne",
          "Tomato Sauce",
          "Garlic",
          "Chili Flakes",
          "Parsley",
        ],
        preparationTime: 12,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 340, protein: 10, carbs: 56, fat: 8, fiber: 4 },
        allergens: ["Gluten"],
        dietaryLabels: ["vegan", "spicy"],
      },
      {
        name: "Fettuccine Alfredo",
        description:
          "Creamy parmesan alfredo sauce tossed with fettuccine and topped with grilled chicken.",
        price: 15.99,
        category: pastasCat,
        options: [
          { title: "Regular", additionalPrice: 0 },
          { title: "Large", additionalPrice: 4 },
        ],
        ingredients: [
          "Fettuccine",
          "Parmesan",
          "Butter",
          "Cream",
          "Grilled Chicken",
        ],
        preparationTime: 15,
        isAvailable: true,
        isFeatured: true,
        nutritionalInfo: { calories: 560, protein: 28, carbs: 48, fat: 28, fiber: 2 },
        allergens: ["Gluten", "Dairy"],
        dietaryLabels: [],
      },
      {
        name: "Caesar Salad",
        description:
          "Crisp romaine lettuce, croutons, parmesan, and our house-made Caesar dressing.",
        price: 9.99,
        category: saladsCat,
        options: [
          { title: "Regular", additionalPrice: 0 },
          { title: "With Chicken", additionalPrice: 3 },
        ],
        ingredients: [
          "Romaine Lettuce",
          "Croutons",
          "Parmesan",
          "Caesar Dressing",
        ],
        preparationTime: 8,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 180, protein: 8, carbs: 12, fat: 12, fiber: 3 },
        allergens: ["Gluten", "Dairy", "Eggs"],
        dietaryLabels: [],
      },
      {
        name: "Greek Salad",
        description:
          "Fresh tomatoes, cucumbers, olives, feta cheese, and red onion with olive oil dressing.",
        price: 10.99,
        category: saladsCat,
        options: [
          { title: "Regular", additionalPrice: 0 },
          { title: "With Chicken", additionalPrice: 3 },
        ],
        ingredients: [
          "Tomatoes",
          "Cucumbers",
          "Olives",
          "Feta",
          "Red Onion",
          "Olive Oil",
        ],
        preparationTime: 8,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 160, protein: 6, carbs: 10, fat: 12, fiber: 3 },
        allergens: ["Dairy"],
        dietaryLabels: ["vegetarian", "gluten-free"],
      },
      {
        name: "Fresh Lemonade",
        description:
          "Freshly squeezed lemonade with a hint of mint.",
        price: 4.99,
        category: drinksCat,
        options: [
          { title: "Regular", additionalPrice: 0 },
          { title: "Large", additionalPrice: 2 },
        ],
        ingredients: ["Lemon", "Sugar", "Mint", "Water"],
        preparationTime: 5,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 120, protein: 0, carbs: 32, fat: 0, fiber: 0 },
        allergens: [],
        dietaryLabels: ["vegan", "gluten-free"],
      },
      {
        name: "Iced Tea",
        description:
          "Chilled black tea with lemon and a touch of honey.",
        price: 3.99,
        category: drinksCat,
        options: [
          { title: "Regular", additionalPrice: 0 },
          { title: "Large", additionalPrice: 1.5 },
        ],
        ingredients: ["Black Tea", "Lemon", "Honey"],
        preparationTime: 3,
        isAvailable: true,
        isFeatured: false,
        nutritionalInfo: { calories: 90, protein: 0, carbs: 24, fat: 0, fiber: 0 },
        allergens: [],
        dietaryLabels: ["vegan", "gluten-free"],
      },
    ]);

    console.log(`${meals.length} meals seeded`);

    const promos = await PromoCode.insertMany([
      {
        code: "WELCOME20",
        description: "20% off your first order",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 20,
        maxDiscountAmount: 15,
        isActive: true,
      },
      {
        code: "SAVE10",
        description: "$10 off orders over $50",
        discountType: "fixed",
        discountValue: 10,
        minOrderAmount: 50,
        isActive: true,
      },
      {
        code: "FREEDELIVERY",
        description: "Free delivery on any order",
        discountType: "fixed",
        discountValue: 5.99,
        minOrderAmount: 0,
        isActive: true,
      },
    ]);

    console.log(`${promos.length} promo codes seeded`);
    console.log("\n--- Seed Complete ---");
    console.log("Admin: admin@restaurant.com / admin123");
    console.log("User: john@example.com / password123");
    console.log("Promo Codes: WELCOME20, SAVE10, FREEDELIVERY");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();

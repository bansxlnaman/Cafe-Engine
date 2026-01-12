export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  isVeg: boolean;
  category: string;
  image?: string;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  { id: 'starters', name: 'Starters', icon: '🍟', description: 'Crispy beginnings' },
  { id: 'burgers', name: 'Burgers', icon: '🍔', description: 'Juicy goodness' },
  { id: 'pizza-pasta', name: 'Pizza & Pasta', icon: '🍕', description: 'Italian favorites' },
  { id: 'chinese', name: 'Chinese', icon: '🍜', description: 'Wok-fresh flavors' },
  { id: 'beverages', name: 'Beverages', icon: '☕', description: 'Sip & chill' },
  { id: 'desserts', name: 'Desserts', icon: '🍰', description: 'Sweet endings' },
];

export const menuItems: MenuItem[] = [
  // Starters
  { id: 's1', name: 'Peri-Peri Fries', price: 99, isVeg: true, category: 'starters', isPopular: true, description: 'Crispy fries with spicy peri-peri seasoning' },
  { id: 's2', name: 'Cheese Loaded Fries', price: 149, isVeg: true, category: 'starters', description: 'Golden fries smothered in melted cheese' },
  { id: 's3', name: 'Garlic Bread', price: 89, isVeg: true, category: 'starters', description: 'Toasted bread with garlic butter' },
  { id: 's4', name: 'Cheese Garlic Bread', price: 119, isVeg: true, category: 'starters', description: 'Garlic bread topped with cheese' },
  { id: 's5', name: 'Paneer Tikka', price: 179, isVeg: true, category: 'starters', description: 'Grilled cottage cheese with spices' },
  { id: 's6', name: 'Chicken Wings', price: 199, isVeg: false, category: 'starters', description: 'Crispy wings with your choice of sauce' },

  // Burgers
  { id: 'b1', name: 'Classic Veg Burger', price: 99, isVeg: true, category: 'burgers', description: 'Crispy patty with fresh veggies' },
  { id: 'b2', name: 'Cheese Burst Burger', price: 139, isVeg: true, category: 'burgers', isPopular: true, description: 'Loaded with melted cheese' },
  { id: 'b3', name: 'Paneer Tikka Burger', price: 149, isVeg: true, category: 'burgers', description: 'Spiced paneer patty' },
  { id: 'b4', name: 'Chicken Burger', price: 159, isVeg: false, category: 'burgers', description: 'Juicy chicken patty' },
  { id: 'b5', name: 'Double Chicken Burger', price: 219, isVeg: false, category: 'burgers', description: 'Double the chicken, double the joy' },

  // Pizza & Pasta
  { id: 'p1', name: 'Margherita Pizza', price: 199, isVeg: true, category: 'pizza-pasta', description: 'Classic tomato and mozzarella' },
  { id: 'p2', name: 'Veggie Supreme Pizza', price: 279, isVeg: true, category: 'pizza-pasta', description: 'Loaded with garden fresh veggies' },
  { id: 'p3', name: 'Chicken Tikka Pizza', price: 329, isVeg: false, category: 'pizza-pasta', description: 'Spiced chicken with tikka flavor' },
  { id: 'p4', name: 'White Sauce Pasta', price: 179, isVeg: true, category: 'pizza-pasta', isPopular: true, description: 'Creamy Alfredo pasta' },
  { id: 'p5', name: 'Red Sauce Pasta', price: 169, isVeg: true, category: 'pizza-pasta', description: 'Tangy tomato-based pasta' },
  { id: 'p6', name: 'Pink Sauce Pasta', price: 189, isVeg: true, category: 'pizza-pasta', description: 'Best of both worlds' },

  // Chinese
  { id: 'c1', name: 'Veg Hakka Noodles', price: 149, isVeg: true, category: 'chinese', description: 'Wok-tossed noodles with veggies' },
  { id: 'c2', name: 'Schezwan Noodles', price: 169, isVeg: true, category: 'chinese', description: 'Spicy schezwan flavored noodles' },
  { id: 'c3', name: 'Chicken Noodles', price: 189, isVeg: false, category: 'chinese', description: 'Noodles with tender chicken' },
  { id: 'c4', name: 'Veg Fried Rice', price: 149, isVeg: true, category: 'chinese', description: 'Aromatic rice with vegetables' },
  { id: 'c5', name: 'Chicken Fried Rice', price: 179, isVeg: false, category: 'chinese', description: 'Rice with succulent chicken pieces' },
  { id: 'c6', name: 'Manchurian', price: 159, isVeg: true, category: 'chinese', description: 'Crispy veg balls in tangy sauce' },

  // Beverages
  { id: 'd1', name: 'Cappuccino', price: 99, isVeg: true, category: 'beverages', isPopular: true, description: 'Rich espresso with steamed milk foam' },
  { id: 'd2', name: 'Café Latte', price: 109, isVeg: true, category: 'beverages', isPopular: true, description: 'Smooth espresso with creamy milk' },
  { id: 'd3', name: 'Cold Coffee', price: 119, isVeg: true, category: 'beverages', description: 'Chilled coffee with ice cream' },
  { id: 'd4', name: 'Mocha', price: 129, isVeg: true, category: 'beverages', description: 'Espresso with chocolate' },
  { id: 'd5', name: 'Hot Chocolate', price: 99, isVeg: true, category: 'beverages', description: 'Rich cocoa delight' },
  { id: 'd6', name: 'Fresh Lime Soda', price: 69, isVeg: true, category: 'beverages', description: 'Refreshing citrus fizz' },
  { id: 'd7', name: 'Mojito', price: 89, isVeg: true, category: 'beverages', description: 'Minty fresh cooler' },
  { id: 'd8', name: 'Oreo Shake', price: 139, isVeg: true, category: 'beverages', description: 'Creamy Oreo milkshake' },

  // Desserts
  { id: 'ds1', name: 'Brownie', price: 89, isVeg: true, category: 'desserts', isPopular: true, description: 'Rich chocolate brownie' },
  { id: 'ds2', name: 'Brownie with Ice Cream', price: 139, isVeg: true, category: 'desserts', description: 'Warm brownie with vanilla ice cream' },
  { id: 'ds3', name: 'Chocolate Lava Cake', price: 149, isVeg: true, category: 'desserts', description: 'Molten chocolate center' },
  { id: 'ds4', name: 'Cheesecake', price: 159, isVeg: true, category: 'desserts', description: 'Creamy New York style' },
];

export const getItemsByCategory = (categoryId: string) => 
  menuItems.filter(item => item.category === categoryId);

export const getPopularItems = () => 
  menuItems.filter(item => item.isPopular);

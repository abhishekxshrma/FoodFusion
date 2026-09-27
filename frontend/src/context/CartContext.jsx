import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("foodfusion_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("foodfusion_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (item, restaurant) => {
    const itemId = item._id || item.id;
    const restId = restaurant ? (restaurant._id || restaurant.id) : (item.restaurant || item.restaurantId);
    const restName = restaurant ? restaurant.name : (item.restaurantName || "Restaurant");

    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => (cartItem._id || cartItem.id) === itemId
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          (cartItem._id || cartItem.id) === itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          ...item,
          restaurantId: restId,
          restaurantName: restName,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => (item._id || item.id) !== itemId)
    );
  };

  const increaseQuantity = (itemId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        (item._id || item.id) === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          (item._id || item.id) === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("foodfusion_cart");
    } catch {}
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
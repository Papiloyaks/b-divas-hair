import { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext();

const STORAGE_KEY = "bdivas_wishlist";

const loadInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { items: [] };
  } catch {
    return { items: [] };
  }
};

function wishlistReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_ITEM": {
      const exists = state.items.some((i) => i._id === action.payload._id);
      return exists
        ? { items: state.items.filter((i) => i._id !== action.payload._id) }
        : { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i._id !== action.payload) };
    case "CLEAR_WISHLIST":
      return { items: [] };
    default:
      return state;
  }
}

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleItem = (product) => dispatch({ type: "TOGGLE_ITEM", payload: product });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const clearWishlist = () => dispatch({ type: "CLEAR_WISHLIST" });
  const isWishlisted = (id) => state.items.some((i) => i._id === id);

  return (
    <WishlistContext.Provider
      value={{ items: state.items, toggleItem, removeItem, clearWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
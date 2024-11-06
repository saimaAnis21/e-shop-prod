import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { CartProductType } from "../app/product/[productId]/ProductDetails";
import toast, { Toast } from "react-hot-toast";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (product: CartProductType) => void;
  removeProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent:(val:string|null)=>void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props:Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[] | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);
  useEffect(() => {
    const cartItems: any = localStorage.getItem("eShopCartItems");
    const crtPrdcts: CartProductType[] | null = JSON.parse(cartItems);
    const eshopPaymentIntent: any = localStorage.getItem("eshopPaymentIntent");
    const paymentIntent: string|null = JSON.parse(eshopPaymentIntent);
    
    setCartProducts(crtPrdcts);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
       const {total, qty} = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          { total: 0, qty: 0 }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    } 
    getTotals();
  }, [cartProducts]);
   
  const handleAddProductToCart = useCallback(
    (product: CartProductType) => {
      const updatedCart = cartProducts ? [...cartProducts, product] : [product];
      setCartProducts(updatedCart);
      toast.success("Product added to cart");
      localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
    },
    [cartProducts]
  );

  const handleCartQtyIncrease = useCallback((product: CartProductType) => {
    let updatedCart;
    if (product.quantity === 10) return toast.error("Max quantity reached");

    if (cartProducts) {
      updatedCart = [...cartProducts];
      const existingIndex = cartProducts.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        updatedCart[existingIndex].quantity = updatedCart[existingIndex].quantity + 1;
      }
      setCartProducts(updatedCart);
      localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
    }


  }, [cartProducts]);
  
  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (product.quantity === 1) return toast.error("Min quantity reached");

      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingIndex = cartProducts.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity = updatedCart[existingIndex].quantity - 1;
        }
        setCartProducts(updatedCart);
        localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartProducts]
  );

  const handleClearCart = useCallback(() => {
    if (cartProducts) {
      setCartProducts(null);
      setCartTotalQty(0);
      localStorage.setItem("eShopCartItems", JSON.stringify(null));
    }
  }, [cartProducts]);

  const removeProductFromCart = useCallback((product: CartProductType) => {
    if (cartProducts) {
      const filteredProducts = cartProducts.filter(item => item.id !== product.id);
      setCartProducts(filteredProducts);
      toast.success("Product removed");
      localStorage.setItem("eShopCartItems", JSON.stringify(filteredProducts));
    }
  }, [cartProducts]);

  const handleSetPaymentIntent = useCallback((val:string|null) => {
    localStorage.setItem("eshopPaymentIntent", JSON.stringify(val));
  },[paymentIntent])

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts,
    handleAddProductToCart,
    removeProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value} {...props} />
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === null) throw new Error("useCart hook must be used with in a CartCOntext Propvider");
  return context;
}
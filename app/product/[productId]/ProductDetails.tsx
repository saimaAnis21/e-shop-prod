'use client';

import { Rating } from "@mui/material";
import { productRating } from "../../../utils/productRating";
import { useCallback, useEffect, useState } from "react";
import SetColor from "../../components/products/SetColor";
import SetQuantity from "../../components/products/SetQuantity";
import Button from "../../components/Button";
import ProductImage from "../../components/products/ProductImage";
import { useCart } from "../../../hooks/useCart";
import { MdCheckCircle } from "react-icons/md";
import { useRouter } from "next/navigation";

interface ProductDetailsProps {
  product: any
}

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImgType,
  quantity: number,
  price: number
};

export type SelectedImgType = {
  color: string,
  colorCode: string,
  image:string
}

const Horizontal = () => {
  return <hr className="w-[30%] my-2" />
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { handleAddProductToCart, cartProducts, cartTotalQty } = useCart()
  const [isProductInCart, setIsProductInCart] = useState(false);

  const [cartProduct, setCartProduct] = useState<CartProductType>({
      id: product.id,
      name: product.name,
      description: product.description,
      category:product.category,
      brand: product.brand,
      selectedImg: {...product.images[0]},
      quantity: 1,
      price: product.price
  });
  const router = useRouter();

  useEffect(() => {
    setIsProductInCart(false);
    if (cartProducts) {
      const existingIndex = cartProducts.findIndex((item) => item.id === product.id)
      if (existingIndex > -1) setIsProductInCart(true);
    }
  }, [cartProducts]);

  const handleColorSelect = useCallback((value: SelectedImgType) =>
  {
    setCartProduct(prev => {
      return { ...prev, selectedImg: { ...value } };
    });
   }, [cartProduct.selectedImg])
  
  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity === 10) return;
    setCartProduct(prev => {return {...prev, quantity: prev.quantity+1}})
  }, [cartProduct.quantity])
  
  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) return;
    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity-1 };
    });
  }, [cartProduct.quantity]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating(product.reviews)} />
          <div>{product.reviews.length} reviews</div>
        </div>
        <Horizontal />
        <div className="text-justify">{product.description}</div>
        <Horizontal />
        <div>
          <span className="font-semibold">CATEGORY: </span>
          {product.category}
        </div>
        <div>
          <span className="font-semibold">BRAND: </span>
          {product.brand}
        </div>
        <div className={product.inStock ? "text-teal-400" : "text-rose-400"}>
          {product.inStock ? "In stock" : "Out of stock"}
        </div>
        <Horizontal />
        {isProductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle size={20} className="text-teal-400" />
              <span>Product Added To Cart</span>
            </p>
            <div className="max-w-[300px]">
              <Button
                label="View Cart"
                outline
                onClick={() => {
                  router.push("/cart");
                }}
              />
            </div>
          </>
        ) : (
          <>
            <SetColor
              images={product.images}
              cartProduct={cartProduct}
              handleColorSelect={handleColorSelect}
            />
            <Horizontal />
            <SetQuantity
              cartProduct={cartProduct}
              handleQtyIncrease={handleQtyIncrease}
              handleQtyDecrease={handleQtyDecrease}
            />
            <Horizontal />
            <div className="max-w-[300px]">
              <Button label="Add to Cart" onClick={() => handleAddProductToCart(cartProduct)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductDetails

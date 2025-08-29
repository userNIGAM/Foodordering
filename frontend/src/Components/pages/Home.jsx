import React from "react";
// import { product } from "../lists/Products";
import { ShoppingCart, Star } from "lucide-react";
import HeroSection from "./HeroSection";
import ProductsGrid from "../pages/products/ProductsGrid";

const Home = () => {
  return (
    <>
      <HeroSection />
      <ProductsGrid />
    </>
  );
};

export default Home;

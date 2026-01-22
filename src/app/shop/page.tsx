"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import "./Shop.css"; // Importing the CSS file created in step 2

// --- SIMULATED DATABASE ---
// In a real app, this data would come from your SQL/Mongo database
const MOCK_DATABASE = [
  {
    id: 1,
    name: "Classic White Tee",
    type: "Clothing",
    price: 10,
    image: "https://placehold.co/200?text=Shirt",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    type: "Electronics",
    price: 25,
    image: "https://placehold.co/200?text=Mouse",
  },
  {
    id: 3,
    name: "Ceramic Mug",
    type: "Home",
    price: 20,
    image: "https://placehold.co/200?text=Mug",
  },
  {
    id: 4,
    name: "Denim Jeans",
    type: "Clothing",
    price: 50,
    image: "https://placehold.co/200?text=Jeans",
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    type: "Electronics",
    price: 100,
    image: "https://placehold.co/200?text=Keyboard",
  },
  {
    id: 6,
    name: "Succulent Plant",
    type: "Home",
    price: 30,
    image: "https://placehold.co/200?text=Plant",
  },
];

type Product = {
  id: number;
  name: string;
  type: string;
  price: number;
  image: string;
};

const Shop = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState(0);

  // 1. Simulate fetching data from a database
  useEffect(() => {
    // This simulates an API call delay (e.g., fetching from Node/Express)
    setTimeout(() => {
      setProducts(MOCK_DATABASE);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 2. Fetch player coins from API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/pet");
        if (res.ok) {
          const data = await res.json();
          setCoins(typeof data.coins === "number" ? data.coins : 0);
        }
      } catch (e) {
        console.error("Failed to load coins", e);
      }
    })();
  }, []);

  return (
    <div className="shop-container">
      <header className="shop-header">
        <button
          onClick={() => router.push("/pet")}
          className="back-btn"
          title="Go back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1>Shop</h1>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 border-2 border-black bg-white rounded-md flex items-center justify-center font-bold text-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            C
          </div>
          <div className="w-24 h-8 border-2 border-black bg-white rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-bold">
            {coins}
          </div>
        </div>
      </header>

      {/* Loading State */}
      {isLoading ? (
        <div className="loading">Loading products...</div>
      ) : (
        /* THE PRODUCT LOOP */
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <span className="product-type">{product.type}</span>
                <h3>{product.name}</h3>
                <p className="product-price">C{product.price.toFixed(2)}</p>
                <button className="add-btn">Buy</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;

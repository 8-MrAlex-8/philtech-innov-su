"use client";

import React, { useState, useEffect } from 'react';
import './Shop.css'; // Importing the CSS file created in step 2

// --- SIMULATED DATABASE ---
// In a real app, this data would come from your SQL/Mongo database
const MOCK_DATABASE = [
  { id: 1, name: "Classic White Tee", type: "Clothing", price: 19.99, image: "https://placehold.co/200?text=Shirt" },
  { id: 2, name: "Wireless Mouse", type: "Electronics", price: 45.00, image: "https://placehold.co/200?text=Mouse" },
  { id: 3, name: "Ceramic Mug", type: "Home", price: 12.50, image: "https://placehold.co/200?text=Mug" },
  { id: 4, name: "Denim Jeans", type: "Clothing", price: 59.99, image: "https://placehold.co/200?text=Jeans" },
  { id: 5, name: "Mechanical Keyboard", type: "Electronics", price: 120.00, image: "https://placehold.co/200?text=Keyboard" },
  { id: 6, name: "Succulent Plant", type: "Home", price: 15.00, image: "https://placehold.co/200?text=Plant" },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Simulate fetching data from a database
  useEffect(() => {
    // This simulates an API call delay (e.g., fetching from Node/Express)
    setTimeout(() => {
      setProducts(MOCK_DATABASE);
      setIsLoading(false);
    }, 1000); 
  }, []);

  return (
    <div className="shop-container">
      <header className="shop-header">
        <h1>Shop</h1>
      </header>

      {/* Loading State */}
      {isLoading ? (
        <div className="loading">Loading products...</div>
      ) : (
        /* THE PRODUCT LOOP */
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <span className="product-type">{product.type}</span>
                <h3>{product.name}</h3>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <button className="add-btn">Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
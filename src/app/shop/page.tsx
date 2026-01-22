"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Sparkles,
  Zap,
  Heart,
  Star,
  Crown,
  Shield,
  Sword,
  Wand2,
  Gem,
  Trophy,
  Target,
  Gift,
  Coins,
} from "lucide-react";
import "./Shop.css";

type ProductType = {
  id: number;
  name: string;
  type: string;
  price: number;
  icon: React.ComponentType<{ className?: string }>;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  description: string;
};

// --- GAMIFIED SHOP DATABASE ---
const MOCK_DATABASE: ProductType[] = [
  {
    id: 1,
    name: "Health Potion",
    type: "Consumable",
    price: 15,
    icon: Heart,
    rarity: "common" as const,
    description: "Restore 50 HP",
  },
  {
    id: 2,
    name: "Lightning Charm",
    type: "Accessory",
    price: 45,
    icon: Zap,
    rarity: "rare" as const,
    description: "+20% Speed",
  },
  {
    id: 3,
    name: "Star Gem",
    type: "Currency",
    price: 30,
    icon: Star,
    rarity: "uncommon" as const,
    description: "Premium currency",
  },
  {
    id: 4,
    name: "Royal Crown",
    type: "Cosmetic",
    price: 150,
    icon: Crown,
    rarity: "legendary" as const,
    description: "Show your status",
  },
  {
    id: 5,
    name: "Flame Sword",
    type: "Weapon",
    price: 120,
    icon: Sword,
    rarity: "epic" as const,
    description: "+50 Attack Power",
  },
  {
    id: 6,
    name: "Magic Wand",
    type: "Weapon",
    price: 80,
    icon: Wand2,
    rarity: "rare" as const,
    description: "+35 Magic",
  },
  {
    id: 7,
    name: "Diamond Shield",
    type: "Armor",
    price: 100,
    icon: Shield,
    rarity: "epic" as const,
    description: "+40 Defense",
  },
  {
    id: 8,
    name: "XP Booster",
    type: "Consumable",
    price: 25,
    icon: Sparkles,
    rarity: "uncommon" as const,
    description: "2x XP for 1 hour",
  },
  {
    id: 9,
    name: "Trophy Collection",
    type: "Cosmetic",
    price: 200,
    icon: Trophy,
    rarity: "legendary" as const,
    description: "Ultimate flex",
  },
  {
    id: 10,
    name: "Precision Scope",
    type: "Accessory",
    price: 60,
    icon: Target,
    rarity: "rare" as const,
    description: "+25% Accuracy",
  },
  {
    id: 11,
    name: "Mystery Box",
    type: "Lootbox",
    price: 50,
    icon: Gift,
    rarity: "epic" as const,
    description: "Random rare item",
  },
  {
    id: 12,
    name: "Gem of Fortune",
    type: "Currency",
    price: 90,
    icon: Gem,
    rarity: "epic" as const,
    description: "Premium gem pack",
  },
];

const Shop = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState(0);
  const [filter, setFilter] = useState("All");
  const [purchasedItems, setPurchasedItems] = useState<number[]>([]);
  const [purchaseAnimation, setPurchaseAnimation] = useState<number | null>(
    null,
  );

  const rarityColors = {
    common: "from-gray-400 to-gray-600",
    uncommon: "from-green-400 to-green-600",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-600",
  };

  const rarityGlow = {
    common: "shadow-gray-500/50",
    uncommon: "shadow-green-500/50",
    rare: "shadow-blue-500/50",
    epic: "shadow-purple-500/50",
    legendary: "shadow-yellow-500/50",
  };

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

  const handlePurchase = async (product: ProductType) => {
    if (coins < product.price) {
      alert("Not enough coins!");
      return;
    }

    // Trigger purchase animation
    setPurchaseAnimation(product.id);
    setTimeout(() => setPurchaseAnimation(null), 1000);

    // Deduct coins
    const newCoins = coins - product.price;
    setCoins(newCoins);

    // Update coins via API
    try {
      await fetch("/api/pet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coins: newCoins }),
      });
    } catch (e) {
      console.error("Failed to update coins", e);
    }

    // Mark as purchased
    setPurchasedItems([...purchasedItems, product.id]);
  };

  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((p: ProductType) => p.type === filter);

  const categories = ["All", ...new Set(MOCK_DATABASE.map((p) => p.type))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="shop-container-modern">
        <header className="shop-header-modern">
          <button
            onClick={() => router.push("/pet")}
            className="back-btn-modern"
            title="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 drop-shadow-lg">
              ⚔️ Item Shop ⚔️
            </h1>
            <p className="text-purple-300 text-sm mt-1">
              Equip your adventure!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="coin-display">
              <Coins className="w-6 h-6 text-yellow-400 animate-pulse" />
              <span className="text-2xl font-bold text-white">{coins}</span>
            </div>
          </div>
        </header>

        {/* Category Filters */}
        <div className="filter-section">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`filter-btn ${
                filter === cat
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="loading-modern">
            <Sparkles className="w-12 h-12 animate-spin text-purple-400" />
            <p>Loading epic items...</p>
          </div>
        ) : (
          <div className="product-grid-modern">
            {filteredProducts.map((product: ProductType) => {
              const IconComponent = product.icon;
              const isPurchased = purchasedItems.includes(product.id);
              const isAnimating = purchaseAnimation === product.id;
              const canAfford = coins >= product.price;

              return (
                <div
                  key={product.id}
                  className={`product-card-modern ${
                    rarityGlow[product.rarity as keyof typeof rarityGlow]
                  } ${isAnimating ? "animate-purchase" : ""} ${
                    isPurchased ? "opacity-60" : ""
                  }`}
                >
                  {/* Rarity Badge */}
                  <div
                    className={`rarity-badge bg-gradient-to-r ${
                      rarityColors[product.rarity as keyof typeof rarityColors]
                    }`}
                  >
                    {product.rarity.toUpperCase()}
                  </div>

                  {/* Icon Display */}
                  <div
                    className={`icon-container bg-gradient-to-br ${
                      rarityColors[product.rarity as keyof typeof rarityColors]
                    }`}
                  >
                    <IconComponent className="w-20 h-20 text-white drop-shadow-2xl" />
                    {product.rarity === "legendary" && (
                      <Sparkles className="sparkle-effect" />
                    )}
                  </div>

                  <div className="product-content">
                    <div className="product-header">
                      <span className="product-type-badge">{product.type}</span>
                      {isPurchased && (
                        <span className="owned-badge">OWNED</span>
                      )}
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>

                    <div className="product-footer">
                      <div className="price-display">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="text-2xl font-bold">
                          {product.price}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePurchase(product)}
                        disabled={!canAfford || isPurchased}
                        className={`buy-btn-modern ${
                          !canAfford
                            ? "opacity-50 cursor-not-allowed"
                            : isPurchased
                              ? "bg-green-600"
                              : ""
                        }`}
                      >
                        {isPurchased ? (
                          <>✓ Purchased</>
                        ) : !canAfford ? (
                          <>🔒 Locked</>
                        ) : (
                          <>Buy Now</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

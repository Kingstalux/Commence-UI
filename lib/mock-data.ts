import type { Product, CartItem, Discount, Transaction } from "@/features/types"

// Mock Users for Testing
export const MOCK_USERS = {
  user: {
    email: "user@test.com",
    password: "password123",
    role: "USER" as const,
  },
  admin: {
    email: "admin@test.com",
    password: "admin123",
    role: "ADMIN" as const,
  },
}

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 299.99,
    discountedPrice: 249.99,
    category: "Electronics",
    tags: ["wireless", "audio", "premium"],
    imageUrl: "/premium-wireless-headphones.png",
    inStock: true,
    stockCount: 25,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    description: "Comfortable ergonomic office chair with lumbar support and adjustable height.",
    price: 449.99,
    category: "Furniture",
    tags: ["office", "ergonomic", "comfort"],
    imageUrl: "/ergonomic-office-chair.png",
    inStock: true,
    stockCount: 12,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking watch with heart rate monitor and GPS.",
    price: 199.99,
    discountedPrice: 179.99,
    category: "Wearables",
    tags: ["fitness", "smart", "health"],
    imageUrl: "/smart-fitness-watch.png",
    inStock: true,
    stockCount: 8,
    createdAt: "2024-01-12T11:30:00Z",
    updatedAt: "2024-01-22T13:15:00Z",
  },
  {
    id: "4",
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical keyboard with tactile switches perfect for gaming and typing.",
    price: 129.99,
    category: "Electronics",
    tags: ["gaming", "mechanical", "rgb"],
    imageUrl: "/mechanical-gaming-keyboard.png",
    inStock: false,
    stockCount: 0,
    createdAt: "2024-01-08T14:20:00Z",
    updatedAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "5",
    name: "Portable Bluetooth Speaker",
    description: "Compact waterproof Bluetooth speaker with excellent sound quality.",
    price: 79.99,
    discountedPrice: 59.99,
    category: "Electronics",
    tags: ["bluetooth", "portable", "waterproof"],
    imageUrl: "/portable-bluetooth-speaker.png",
    inStock: true,
    stockCount: 35,
    createdAt: "2024-01-14T16:00:00Z",
    updatedAt: "2024-01-21T12:30:00Z",
  },
  {
    id: "6",
    name: "Standing Desk Converter",
    description: "Adjustable standing desk converter to transform any desk into a standing workstation.",
    price: 199.99,
    category: "Furniture",
    tags: ["standing", "desk", "adjustable"],
    imageUrl: "/standing-desk-converter.png",
    inStock: true,
    stockCount: 18,
    createdAt: "2024-01-11T08:45:00Z",
    updatedAt: "2024-01-19T15:20:00Z",
  },
]

// Mock Discounts
export const MOCK_DISCOUNTS: Discount[] = [
  {
    id: "1",
    code: "SAVE20",
    type: "percentage",
    value: 20,
    description: "20% off your entire order",
    isActive: true,
    minOrderAmount: 100,
    maxDiscountAmount: 50,
    expiresAt: "2024-12-31T23:59:59Z",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    code: "WELCOME10",
    type: "fixed",
    value: 10,
    description: "$10 off for new customers",
    isActive: true,
    minOrderAmount: 50,
    expiresAt: "2024-06-30T23:59:59Z",
    createdAt: "2024-01-05T12:00:00Z",
    updatedAt: "2024-01-20T14:15:00Z",
  },
]

// Mock Cart Items
export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "1",
    productId: "1",
    quantity: 2,
    addedAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "2",
    productId: "3",
    quantity: 1,
    addedAt: "2024-01-25T11:30:00Z",
  },
]

// Mock Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    userId: "user1",
    items: [
      { productId: "1", quantity: 1, price: 249.99 },
      { productId: "5", quantity: 2, price: 59.99 },
    ],
    subtotal: 369.97,
    discountAmount: 20.0,
    total: 349.97,
    status: "completed",
    createdAt: "2024-01-20T14:30:00Z",
    updatedAt: "2024-01-20T14:35:00Z",
  },
  {
    id: "2",
    userId: "user2",
    items: [{ productId: "2", quantity: 1, price: 449.99 }],
    subtotal: 449.99,
    discountAmount: 0,
    total: 449.99,
    status: "pending",
    createdAt: "2024-01-22T09:15:00Z",
    updatedAt: "2024-01-22T09:15:00Z",
  },
]

// Mock Timeline Events
export const MOCK_TIMELINE_EVENTS = [
  {
    id: "1",
    type: "conversation" as const,
    timestamp: "2024-01-25T10:30:00Z",
    title: "Customer Support Chat",
    content: {
      messages: [
        { role: "user", content: "Hi, I have a question about my order", timestamp: "2024-01-25T10:30:00Z" },
        {
          role: "assistant",
          content: "Hello! I'd be happy to help you with your order. What's your order number?",
          timestamp: "2024-01-25T10:31:00Z",
        },
        { role: "user", content: "It's #12345", timestamp: "2024-01-25T10:32:00Z" },
        {
          role: "assistant",
          content: "I can see your order is being processed and will ship within 2 business days.",
          timestamp: "2024-01-25T10:33:00Z",
        },
      ],
    },
  },
  {
    id: "2",
    type: "website" as const,
    timestamp: "2024-01-25T09:15:00Z",
    title: "Product Page Visit",
    content: {
      url: "https://example.com/products/wireless-headphones",
      title: "Premium Wireless Headphones - ProductionApp",
      description: "High-quality wireless headphones with noise cancellation",
      favicon: "/headphones-icon.png",
      screenshot: "/product-page-screenshot.png",
    },
  },
  {
    id: "3",
    type: "notes" as const,
    timestamp: "2024-01-25T08:45:00Z",
    title: "Meeting Notes",
    content: {
      title: "Product Strategy Meeting",
      content:
        "Discussed Q1 product roadmap and new feature priorities. Key decisions: 1) Focus on mobile app improvements, 2) Launch new product category by March, 3) Implement customer feedback system.",
      tags: ["strategy", "roadmap", "Q1"],
    },
  },
]

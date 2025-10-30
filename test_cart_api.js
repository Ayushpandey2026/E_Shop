// Test script to check if the cart API endpoint is working
import axios from 'axios';

const API_BASE = "https://e-shop-backend-iqb1.onrender.com/api/cart";
const TEST_TOKEN = "your_test_token_here"; // Replace with a valid token

async function testCartAPI() {
  try {
    console.log("Testing cart API endpoints...");
    
    // Test 1: Check if API is reachable
    console.log("\n1. Testing API connectivity...");
    try {
      const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${TEST_TOKEN}` }
      });
      console.log("✅ API is reachable:", response.status);
    } catch (error) {
      console.log("❌ API connectivity error:", error.response?.status, error.response?.data);
    }
    
    // Test 2: Test add to cart endpoint
    console.log("\n2. Testing add to cart endpoint...");
    try {
      const testProductId = "test_product_id"; // Replace with actual product ID
      const response = await axios.post(`${API_BASE}/add`, {
        productId: testProductId,
        quantity: 1
      }, {
        headers: { 
          Authorization: `Bearer ${TEST_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("✅ Add to cart successful:", response.status, response.data);
    } catch (error) {
      console.log("❌ Add to cart error:", error.response?.status, error.response?.data);
    }
    
    // Test 3: Test fetch cart endpoint
    console.log("\n3. Testing fetch cart endpoint...");
    try {
      const response = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${TEST_TOKEN}` }
      });
      console.log("✅ Fetch cart successful:", response.status);
      console.log("Cart items:", response.data.items?.length || 0);
    } catch (error) {
      console.log("❌ Fetch cart error:", error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error("Unexpected error:", error.message);
  }
}

// Check if token is provided
if (TEST_TOKEN === "your_test_token_here") {
  console.log("⚠️  Please replace TEST_TOKEN with a valid authentication token");
  console.log("You can get the token from localStorage in your browser console:");
  console.log("localStorage.getItem('token')");
} else {
  testCartAPI();
}

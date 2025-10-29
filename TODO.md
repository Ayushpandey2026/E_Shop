# TODO: Update Frontend to Connect to Render Backend

## Steps to Complete
- [x] Update baseURL in src/api.js to https://e-shop-backend-iqb1.onrender.com/api/web
- [x] Update baseURL in src/utils/axiosConfig.jsx to https://e-shop-backend-iqb1.onrender.com/api
- [x] Update baseURL in src/utils/axiosInstance.jsx to https://e-shop-backend-iqb1.onrender.com/api/web
- [x] Update baseURL in src/api/postApi.jsx to https://e-shop-backend-iqb1.onrender.com/api/web
- [ ] Replace all hardcoded http://localhost:8000 with https://e-shop-backend-iqb1.onrender.com in the following files:
  - [x] src/context/AuthContext.jsx
  - [x] src/pages/Contact.jsx
  - [x] src/pages/Order.jsx
- [x] src/pages/MyProfile.jsx
  - [ ] src/pages/ForgotPassword.jsx
  - [ ] src/pages/Cart.jsx
  - [ ] src/redux/LoginPage.jsx
  - [ ] src/redux/CartSlice.jsx
  - [ ] src/redux/SignUp.jsx
  - [ ] src/admin/adminMain/ManageUsers.jsx
  - [ ] src/admin/adminMain/ManageProducts.jsx
  - [ ] src/admin/adminMain/AllOrders.jsx
  - [ ] src/admin/adminMain/DashBoard.jsx
  - [ ] src/pages/ResetPassword.jsx
  - [ ] src/pages/ProductDetails.jsx
  - [ ] src/pages/Product.jsx
  - [ ] src/admin/redux/OrderSlice.js
  - [ ] src/admin/redux/CartSlice.js
  - [ ] test_cart_api.js
- [ ] Test the frontend to ensure products load and API calls work with the new backend URL

## Notes
- Assumed API base paths remain the same (/api and /api/web).
- If the render backend has different paths, further adjustments may be needed.

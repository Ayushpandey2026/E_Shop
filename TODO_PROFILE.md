# Profile Section Implementation TODO

✅ **PHASE 1: Backend (API endpoints)**
✅ - [x] 1. Update `server/App/models/User.js`: Add `phone: String`, `avatar: String`
- [ ] 2. Install multer: `cd server && npm i multer`
- [ ] 3. `server/App/controllers/authController.js`: Add `updateUser` (PUT name/email/phone/avatar w/multer), `changePassword`
- [ ] 4. `server/App/routes/authRoutes.js`: Add `PUT /update`, `POST /change-password`
- [ ] 5. `server/App/controllers/orderController.js`: Add `getMyOrders` (GET /orders/my)
- [ ] 6. `server/App/routes/orderRoutes.js`: Add `GET /my`
- [ ] 7. Create Wishlist: model/controller/routes (`/wishlist/my` GET, `/:id` DELETE)

✅ **PHASE 2: Frontend (UI fixes + new tabs)**
- [ ] 8. `MyProfile.jsx`: Fix API paths (/user/addresses, /orders/my etc.), add tabs (Cart, Recommendations, History, Preferences, Watchlist, Content&Devices, Subscribe&Save, Memberships), integrate AuthContext
- [ ] 9. `AuthContext.jsx`: Expose token fully
- [ ] 10. `MyProfile.css`: Styles for new tabs
- [ ] 11. `Header.jsx`: Enhance dropdown (add new links?)

✅ **PHASE 3: Testing & Polish**
- [ ] Test all tabs load/edit
- [ ] Add sample data seed
- [ ] Responsive testing
- [ ] [attempt_completion]

*Current: Starting Phase 1 Step 1*

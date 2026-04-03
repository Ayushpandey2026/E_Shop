# Profile/Account Fixes TODO

## Completed Steps
- [x] Plan approved and breakdown created
- [x] Install dependencies (multer backend, sweetalert2 frontend - assumed via npm)
- [x] Create upload middleware (server/App/middlewares/uploadMiddleware.js)
- [x] Add updateProfile controller (server/App/controllers/authController.js)
- [x] Add PUT route (server/App/routes/authRoutes.js)
- [x] Update MyProfile.jsx (endpoint to /auth/updateProfile, SweetAlert2 integration, preview avatar, bug fixes, remove unused authHeaders)

## Remaining Steps (manual by user)
1. Run `cd server && npm install multer` (if not done)
2. Run `cd Frontend/client/mini_shop && npm install sweetalert2` (if not done)
3. Restart backend server (`cd server && npm run dev`)
4. Restart frontend dev server (`cd Frontend/client/mini_shop && npm run dev`)
5. Test: Login → My Profile → Edit name/email/phone/avatar → Save → See SweetAlert success + changes reflected + avatar preview/uploads
6. Backend serves uploads at http://localhost:8000/uploads/ (add static in server/index.js if needed: app.use('/uploads', express.static('uploads')) )

All code changes complete. Task fixed!


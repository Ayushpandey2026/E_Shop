# API URL Fixes for Deployment

## Issues Identified
- [ ] Hardcoded production URLs in multiple files
- [ ] Inconsistent axios instance usage
- [ ] Orders endpoint path mismatch (/order/my vs /orders/my)
- [ ] Missing wishlist backend routes
- [ ] Frontend still using old production URLs

## Files Fixed
- [x] Product.jsx - hardcoded product fetch URL
- [x] ProductDetails.jsx - fetch calls and axios URLs
- [x] Cart.jsx - hardcoded order placement URL
- [x] Order.jsx - hardcoded URL and wrong endpoint path
- [x] CartSlice.jsx - hardcoded cart URLs
- [ ] MyProfile.jsx - wishlist endpoint (needs backend)
- [x] postApi.jsx - hardcoded base URL
- [x] Contact.jsx - hardcoded URL
- [x] AuthContext.jsx - hardcoded URL
- [x] ResetPassword.jsx - hardcoded URL
- [ ] Admin files - still have hardcoded URLs (admin panel)
- [ ] Home.jsx - check for hardcoded URLs
- [ ] LoginPage.jsx - check for hardcoded URLs
- [ ] SignUp.jsx - check for hardcoded URLs
- [ ] ForgotPassword.jsx - check for hardcoded URLs

## Backend Additions Needed
- [ ] Create Wishlist model
- [ ] Add wishlist routes
- [ ] Add wishlist controller

## Testing
- [ ] Test with local environment
- [ ] Test with production environment
- [ ] Verify all API calls work

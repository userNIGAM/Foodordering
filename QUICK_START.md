# Real Orders Integration - Quick Start Guide

## ✅ What's Been Done

Your kitchen dashboard now automatically receives real orders when users place them. The system:
- Auto-verifies orders instantly
- Auto-assigns to available chefs  
- Sends real-time socket notifications
- Creates detailed order timelines

## 🚀 Quick Start (3 Steps)

### Step 1: Ensure You Have a Chef User
Run this command to seed a test chef to the database:

```bash
cd /home/nigam/Desktop/programmingground/FullStack/E-commerce/FoodOrdering/backend
node scripts/seedChef.js
```

**Chef Credentials:**
- Email: `chef@gmail.com`
- Password: `chef123`
- Role: Chef
- Max Capacity: 10 orders

### Step 2: Restart Backend Server
Kill the current backend and restart it:

```bash
# In the backend terminal:
# Press Ctrl+C to stop current process

npm start
# or
node index.js
```

### Step 3: Test Real Orders
1. **Open Frontend** → http://localhost:5173
2. **Place an Order**
   - Add items to cart
   - Click checkout
   - Fill customer details (name, email, phone, address)
   - Complete order

3. **Check Kitchen Dashboard**
   - Login as Chef: `chef@gmail.com` / `chef123`
   - Go to Kitchen Orders page
   - 🎉 Your real order should appear!

---

## 📊 What You'll See

### On Order Placement:
- Order created with customer items
- Auto-assigned to Chef (lowest capacity picked)
- Status: "assigned_to_kitchen"

### In Kitchen Dashboard:
- Order appears in the orders table
- Stats update (confirmed, preparing, prepared, issues)
- Chef can:
  - View full order details
  - Confirm preparation
  - Start preparing
  - Mark as prepared
  - Report issues

### Real-Time Updates:
- Socket.io pushes updates to all connected clients
- No page refresh needed
- Live status changes visible instantly

---

## 🔧 Technical Details

### Order Auto-Assignment Algorithm:
```
For each new order:
1. Find all chefs with role="chef"
2. Sort by currentCapacity (lowest first)
3. Assign to first chef with capacity < maxCapacity
4. Update chef.currentCapacity++
5. Send email + socket notification
```

### Chef Capacity System:
- **maxCapacity**: How many orders a chef can handle (default: 10)
- **currentCapacity**: Currently assigned orders
- Chef can accept orders until: `currentCapacity < maxCapacity`

### Email Notifications:
Chef receives email when assigned new order with:
- Order ID
- Customer name
- Item list  
- Total amount
- Action link to kitchen dashboard

---

## ⚙️ Troubleshooting

### Problem: "No orders showing in kitchen dashboard"
**Solution:** 
- Make sure chef user exists: `node scripts/seedChef.js`
- Check backend is restarted
- Verify you're logged in as the chef
- Try placing a new order

### Problem: "Order shows but can't perform actions"
**Solution:**
- Refresh page (F5)
- Check browser console for errors
- Verify chef token in localStorage

### Problem: "Can't place order from frontend"
**Solution:**
- Check backend is running on port 5000
- Verify `VITE_API_URL` in frontend .env
- Check console for API errors

### Problem: "Chef doesn't receive email"
**Solution:**
- Check SMTP credentials in backend .env
- Verify Gmail app password (not regular password)
- Check spam folder

---

## 📈 Next Steps

1. ✅ Seed chef user
2. ✅ Restart backend
3. ✅ Place test order
4. ✅ Verify in kitchen dashboard
5. Test all features (confirm, prepare, report issue)
6. Optional: Create more chefs for load testing

---

## 🎯 Expected Behavior After Changes

| Action | Before | After |
|--------|--------|-------|
| User places order | Stays pending, never shows to chef | Auto-verified & assigned to kitchen ✅ |
| Order in dashboard | No real orders, only dummy data | Shows real user orders ✅ |
| Chef notification | Manual admin assignment needed | Auto-sent to assigned chef ✅ |
| Real-time updates | None | Socket events push updates ✅ |

---

**Ready to test? Run:** `node scripts/seedChef.js` → Restart backend → Place an order! 🚀

# ✅ Backend Verification Checklist

Use this checklist to verify that your backend is working correctly.

---

## 📋 Pre-Flight Checks

### Environment Setup
- [ ] `.env` file created with all required variables
- [ ] MongoDB is installed and running
- [ ] Node.js and npm are installed
- [ ] Dependencies installed (`npm install`)

### Environment Variables Check
```bash
# Verify these are set in your .env file:
- [ ] PORT=8000
- [ ] MONGODB_URL=mongodb://localhost:27017
- [ ] ACCESS_TOKEN_SECRET (at least 32 characters)
- [ ] ACCESS_TOKEN_EXPIRY=1d
- [ ] REFRESH_TOKEN_SECRET (at least 32 characters)
- [ ] REFRESH_TOKEN_EXPIRY=30d
- [ ] NODE_ENV=development
```

---

## 🚀 Server Startup Test

### Start the Server
```bash
npm run dev
```

### Expected Output
```
✅ Database connected successfully
✅ Server is running on port 8000
```

**If you see both messages, proceed to API tests!**

---

## 🧪 API Testing Checklist

### 1. Authentication Tests

#### Register User
```bash
POST /api/auth/register
```
**Request:**
```json
{
  "name": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "phonenumber": "+1234567890"
}
```
- [ ] Status: 201
- [ ] Response contains user data
- [ ] No password in response

#### Login User
```bash
POST /api/auth/login
```
**Request:**
```json
{
  "name": "testuser",
  "password": "password123"
}
```
- [ ] Status: 200
- [ ] Response contains accessToken
- [ ] Response contains refreshToken
- [ ] Cookies are set

#### Logout User
```bash
POST /api/auth/logout
Authorization: Bearer <token>
```
- [ ] Status: 200
- [ ] Cookies are cleared

---

### 2. User & Friend Tests

#### Search Users
```bash
POST /api/users/search-users?username=test
Authorization: Bearer <token>
```
- [ ] Status: 200
- [ ] Returns array of users

#### Get Discover Users
```bash
GET /api/users/get-discover-users
Authorization: Bearer <token>
```
- [ ] Status: 200
- [ ] Returns available users

#### Get User Summary
```bash
GET /api/users/get-user-summary
Authorization: Bearer <token>
```
- [ ] Status: 200
- [ ] Returns friends, balances

---

### 3. Group Tests

#### Create Group
```bash
POST /api/groups/create-group
Authorization: Bearer <token>
```
**Request:**
```json
{
  "name": "Test Trip",
  "description": "Testing",
  "membernames": ["testuser"]
}
```
- [ ] Status: 201
- [ ] Response contains group with _id
- [ ] Members array includes creator

#### Get User Groups
```bash
GET /api/groups/get-user-groups
Authorization: Bearer <token>
```
- [ ] Status: 200
- [ ] Returns array of groups

#### Get Group Details
```bash
GET /api/groups/get-group-details/<groupId>
Authorization: Bearer <token>
```
- [ ] Status: 200
- [ ] Returns group info, expenses, balances

---

### 4. Expense Tests

#### Create Expense
```bash
POST /api/expenses/create-expense
Authorization: Bearer <token>
```
**Request:**
```json
{
  "groupId": "<your_group_id>",
  "items": [
    {
      "itemName": "Test Expense",
      "itemPrice": 100,
      "givername": "testuser",
      "takersname": ["testuser"]
    }
  ]
}
```
- [ ] Status: 201
- [ ] Expense created
- [ ] Balance updated (check with get-group-details)

#### Add Expense Items
```bash
POST /api/expenses/add-expense-items
Authorization: Bearer <token>
```
- [ ] Status: 200
- [ ] Items added to existing expense

#### Settle Payment
```bash
POST /api/expenses/settle-payment
Authorization: Bearer <token>
```
**Request:**
```json
{
  "groupId": "<group_id>",
  "fromUserId": "<user1_id>",
  "toUserId": "<user2_id>",
  "amount": 50
}
```
- [ ] Status: 200
- [ ] Balances updated correctly

---

## 🔍 Error Handling Tests

### Test Invalid Scenarios

#### Invalid Login
```bash
POST /api/auth/login
{
  "name": "wronguser",
  "password": "wrongpass"
}
```
- [ ] Status: 404 or 401
- [ ] Error message returned

#### Missing Token
```bash
GET /api/groups/get-user-groups
(without Authorization header)
```
- [ ] Status: 401
- [ ] Error: "unauthenticated"

#### Invalid Group ID
```bash
GET /api/groups/get-group-details/invalid_id
Authorization: Bearer <token>
```
- [ ] Status: 404 or 500
- [ ] Error message returned

---

## 💾 Database Verification

### Check MongoDB Collections
```bash
mongosh
use give_take_db
show collections
```

**Expected Collections:**
- [ ] users
- [ ] groups
- [ ] expenses
- [ ] groupbalances
- [ ] frends

### Verify Data
```bash
db.users.find().pretty()
db.groups.find().pretty()
db.expenses.find().pretty()
db.groupbalances.find().pretty()
```

**Check that:**
- [ ] Passwords are hashed (not plain text)
- [ ] Group members are ObjectIds
- [ ] Balances are numbers
- [ ] Timestamps exist (createdAt, updatedAt)

---

## 🧮 Balance Calculation Test

### Test Scenario
Create this scenario to verify balance logic:

1. **Create group** with 3 users: Alice, Bob, Charlie
2. **Add expense:**
   - Alice pays $300 for hotel
   - Shared by all 3 people
3. **Expected balances:**
   - Alice: +$200 (paid $300, owes $100)
   - Bob: -$100 (owes $100)
   - Charlie: -$100 (owes $100)

- [ ] Alice balance = +200
- [ ] Bob balance = -100
- [ ] Charlie balance = -100
- [ ] Total balances sum to 0

---

## 🔐 Security Tests

### Token Tests
- [ ] Expired token is rejected
- [ ] Invalid token is rejected
- [ ] No token returns 401

### Password Tests
- [ ] Password is hashed in database
- [ ] Password not returned in responses
- [ ] Wrong password is rejected

### Authorization Tests
- [ ] Non-members can't access group details
- [ ] Can't add expenses to groups you're not in
- [ ] Can't access other users' private data

---

## 📊 Performance Tests (Optional)

### Response Time
- [ ] Login < 500ms
- [ ] Get groups < 500ms
- [ ] Create expense < 1s

### Concurrent Requests
- [ ] Multiple users can login simultaneously
- [ ] Multiple expenses can be added to same group

---

## 🐛 Common Issues Resolved

### If Server Won't Start
```bash
✅ Check: MongoDB is running
✅ Check: Port 8000 is not in use
✅ Check: .env file exists and is valid
✅ Check: node_modules installed (npm install)
```

### If Database Won't Connect
```bash
✅ Check: MongoDB service is running
✅ Check: MONGODB_URL in .env is correct
✅ Check: No firewall blocking connection
```

### If Authentication Fails
```bash
✅ Check: ACCESS_TOKEN_SECRET is set
✅ Check: Password was hashed correctly
✅ Check: Token is included in request
```

---

## ✅ Final Verification

### All Systems Go!
If you can check all these boxes, your backend is ready:

- [ ] Server starts without errors
- [ ] Can register and login users
- [ ] Can create and manage groups
- [ ] Can add and view expenses
- [ ] Balances calculate correctly
- [ ] No errors in console
- [ ] Database stores data correctly
- [ ] Authentication works properly
- [ ] All routes respond as expected

---

## 🎉 Success Criteria

Your backend is **production-ready** if:

1. ✅ All 12 bugs have been fixed
2. ✅ Server starts and connects to database
3. ✅ All API endpoints work correctly
4. ✅ Balance calculations are accurate
5. ✅ Authentication is secure
6. ✅ No errors in console or logs
7. ✅ Data persists in MongoDB
8. ✅ Error handling works properly

---

## 📝 Testing Notes

**Date Tested:** _________________

**Tested By:** _________________

**Issues Found:**
- _________________
- _________________

**Notes:**
_________________
_________________

---

## 🚀 Ready for Frontend!

Once all checks pass, you're ready to:
- Start frontend development
- Integrate API endpoints
- Build user interfaces
- Deploy to production

**Good luck with your frontend! 🎨**

---

**Refer to API_DOCUMENTATION.md for complete API specifications**

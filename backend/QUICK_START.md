# 🚀 Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or cloud instance)
- npm or yarn package manager

---

## 📦 Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your configuration:
```env
PORT=8000
NODE_ENV=development
MONGODB_URL=mongodb://localhost:27017
ACCESS_TOKEN_SECRET=your_secure_random_string_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=another_secure_random_string_here
REFRESH_TOKEN_EXPIRY=30d
```

**To generate secure secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# Windows
mongod

# Mac/Linux
sudo service mongod start
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
Database connected successfully
Server is running on port 8000
```

---

## 🧪 Testing the API

### Option 1: Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "phonenumber": "+1234567890"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "name": "testuser",
    "password": "password123"
  }'
```

### Option 2: Using Postman

1. Import the API collection (see API_DOCUMENTATION.md)
2. Set base URL to `http://localhost:8000`
3. After login, copy the `accessToken` from response
4. Add to Authorization header: `Bearer <accessToken>`

### Option 3: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create new request
3. Follow examples in API_DOCUMENTATION.md

---

## 📁 Project Structure

```
backend/
├── app.js                 # Express app configuration
├── server.js              # Server entry point
├── package.json           # Dependencies
├── .env                   # Environment variables (create this)
├── .env.example           # Environment template
│
├── controller/            # Business logic
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── group.controller.js
│   └── expencess.controller.js
│
├── db/                    # Database connection
│   └── index.js
│
├── middleware/            # Custom middleware
│   └── auth_middleware.js
│
├── model/                 # Mongoose models
│   ├── user.model.js
│   ├── group.model.js
│   ├── expense.model.js
│   ├── balance.model.js
│   └── frend.model.js
│
├── router/                # API routes
│   ├── auth.router.js
│   ├── user.router.js
│   ├── group.router.js
│   └── expense.router.js
│
└── utils/                 # Utility functions
    ├── ApiError.js
    ├── ApiResponse.js
    └── asyncHandler.js
```

---

## 🔗 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (requires auth)

### Users & Friends
- `POST /api/users/send-friend-request` - Send friend request
- `POST /api/users/respond-friend-request` - Accept/reject request
- `POST /api/users/search-users?username=<name>` - Search users
- `GET /api/users/get-discover-users` - Get available users
- `GET /api/users/get-user-summary` - Get user summary

### Groups
- `POST /api/groups/create-group` - Create new group
- `POST /api/groups/add-group-members/:groupId` - Add members
- `GET /api/groups/get-user-groups` - Get user's groups
- `GET /api/groups/get-group-details/:groupId` - Get group details

### Expenses
- `POST /api/expenses/create-expense` - Create expense
- `POST /api/expenses/add-expense-items` - Add expense items
- `POST /api/expenses/settle-payment` - Settle payment

**Full documentation:** See `API_DOCUMENTATION.md`

---

## 🔧 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:** 
- Ensure MongoDB is running
- Check `MONGODB_URL` in `.env` is correct
- Try: `mongodb://localhost:27017` or `mongodb://127.0.0.1:27017`

### Issue: "Invalid access token"
**Solution:**
- Make sure `ACCESS_TOKEN_SECRET` is set in `.env`
- Token might be expired - login again
- Include token in header: `Authorization: Bearer <token>`

### Issue: "Port already in use"
**Solution:**
- Change `PORT` in `.env` to different number (e.g., 8001)
- Or kill process using port 8000:
  ```bash
  # Windows
  netstat -ano | findstr :8000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:8000 | xargs kill -9
  ```

### Issue: "Module not found"
**Solution:**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`

---

## 📊 Sample Workflow

### 1. Create Users
```bash
# Register User 1
POST /api/auth/register
{
  "name": "alice",
  "email": "alice@example.com",
  "password": "pass123",
  "phonenumber": "+1111111111"
}

# Register User 2
POST /api/auth/register
{
  "name": "bob",
  "email": "bob@example.com",
  "password": "pass123",
  "phonenumber": "+2222222222"
}
```

### 2. Login as Alice
```bash
POST /api/auth/login
{
  "name": "alice",
  "password": "pass123"
}
# Save the accessToken
```

### 3. Create a Group
```bash
POST /api/groups/create-group
Authorization: Bearer <alice_token>
{
  "name": "Weekend Trip",
  "description": "Beach vacation",
  "membernames": ["alice", "bob"]
}
# Save the groupId
```

### 4. Add an Expense
```bash
POST /api/expenses/create-expense
Authorization: Bearer <alice_token>
{
  "groupId": "<group_id>",
  "items": [
    {
      "itemName": "Hotel",
      "itemPrice": 200,
      "givername": "alice",
      "takersname": ["alice", "bob"]
    }
  ]
}
```

### 5. Check Balances
```bash
GET /api/groups/get-group-details/<group_id>
Authorization: Bearer <alice_token>
```

**Result:**
- Alice balance: +$100 (she paid $200, her share is $100)
- Bob balance: -$100 (he owes $100)

---

## 🐛 Debugging Tips

### Enable Detailed Logging
Add to your code:
```javascript
console.log('Request body:', req.body);
console.log('User:', req.user);
```

### Check MongoDB Data
```bash
# Open MongoDB shell
mongosh

# Use database
use give_take_db

# View collections
show collections

# Query data
db.users.find()
db.groups.find()
db.expenses.find()
db.groupbalances.find()
```

### Test Individual Routes
Use VS Code REST Client or Thunder Client to test each endpoint individually.

---

## 📚 Additional Resources

- **API Documentation:** `API_DOCUMENTATION.md`
- **Bug Fixes:** `BUGS_FIXED.md`
- **Mongoose Docs:** https://mongoosejs.com/
- **Express Docs:** https://expressjs.com/

---

## 🎉 You're Ready!

Your backend is now set up and ready for frontend integration. Check `API_DOCUMENTATION.md` for detailed API specifications.

**Happy Coding! 🚀**

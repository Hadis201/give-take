# 🗺️ API Routes Reference - Quick Summary

## Base URL
```
http://localhost:8000
```

---

## 🔐 Authentication Routes
**Base Path:** `/api/auth`

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/register` | ❌ No | Register new user |
| POST | `/login` | ❌ No | Login user |
| POST | `/logout` | ✅ Yes | Logout user |

---

## 👥 User & Friend Routes
**Base Path:** `/api/users`

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/send-friend-request` | ✅ Yes | Send friend request |
| POST | `/respond-friend-request` | ✅ Yes | Accept/reject friend request |
| POST | `/search-users?username=<name>` | ✅ Yes | Search users by name |
| GET | `/get-discover-users` | ✅ Yes | Get users to connect with |
| GET | `/get-user-summary` | ✅ Yes | Get user's friends & balances |

---

## 🏢 Group Routes
**Base Path:** `/api/groups`

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/create-group` | ✅ Yes | Create new group |
| POST | `/add-group-members/:groupId` | ✅ Yes | Add members to group |
| GET | `/get-user-groups` | ✅ Yes | Get user's groups |
| GET | `/get-group-details/:groupId` | ✅ Yes | Get group details & balances |

---

## 💰 Expense Routes
**Base Path:** `/api/expenses`

| Method | Endpoint | Auth Required | Description |
|--------|----------|--------------|-------------|
| POST | `/create-expense` | ✅ Yes | Create new expense |
| POST | `/add-expense-items` | ✅ Yes | Add items to expense |
| POST | `/settle-payment` | ✅ Yes | Record payment settlement |

---

## 📝 Request Body Examples

### Register User
```json
{
  "name": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phonenumber": "+1234567890"
}
```

### Login
```json
{
  "name": "john_doe",
  "password": "securePassword123"
}
```

### Send Friend Request
```json
{
  "receiverId": "65abc456..."
}
```

### Create Group
```json
{
  "name": "Weekend Trip",
  "description": "Beach vacation",
  "membernames": ["alice", "bob", "charlie"]
}
```

### Create Expense
```json
{
  "groupId": "65group1...",
  "items": [
    {
      "itemName": "Hotel",
      "itemPrice": 300,
      "givername": "alice",
      "takersname": ["alice", "bob"]
    }
  ]
}
```

### Settle Payment
```json
{
  "groupId": "65group1...",
  "fromUserId": "65abc456...",
  "toUserId": "65abc123...",
  "amount": 100
}
```

---

## 🔑 Authentication Header

For all routes marked with ✅:

```
Authorization: Bearer <accessToken>
```

Or use cookies (automatically set after login).

---

## 📊 Response Format

### Success (200/201)
```json
{
  "statusCode": 200,
  "data": { /* ... */ },
  "message": "Success message",
  "success": true
}
```

### Error (400/401/403/404/500)
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## ⚡ Quick Testing Commands

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"test","email":"test@ex.com","password":"pass123","phonenumber":"+123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"test","password":"pass123"}'

# Create Group (with token)
curl -X POST http://localhost:8000/api/groups/create-group \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Trip","membernames":["alice","bob"]}'

# Get User Groups
curl -X GET http://localhost:8000/api/groups/get-user-groups \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Common Use Cases

### 1. User Registration & Login Flow
```
POST /api/auth/register → Create account
POST /api/auth/login    → Get access token
```

### 2. Create Group & Add Expense
```
POST /api/groups/create-group     → Create group
POST /api/expenses/create-expense → Add expense
GET  /api/groups/get-group-details/:groupId → Check balances
```

### 3. Friend Management
```
POST /api/users/search-users?username=john  → Find user
POST /api/users/send-friend-request         → Send request
POST /api/users/respond-friend-request      → Accept/reject
GET  /api/users/get-user-summary            → View friends
```

### 4. Expense Settlement
```
GET  /api/groups/get-group-details/:groupId → Check who owes
POST /api/expenses/settle-payment           → Record payment
GET  /api/groups/get-group-details/:groupId → Verify updated balances
```

---

## 📌 Important Notes

1. **Authentication:** Most routes require `Authorization: Bearer <token>` header
2. **Group ID:** Use actual MongoDB ObjectId (returned from create-group)
3. **User Names:** Must exist in database (case-sensitive)
4. **Balances:** Automatically calculated and updated
5. **Cookies:** Set automatically on login (can be used instead of header)

---

**For detailed documentation, see:** `API_DOCUMENTATION.md`

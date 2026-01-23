# Group Expense-Sharing API Documentation

**Base URL:** `http://localhost:8000`

---

## 📋 Table of Contents
- [Authentication](#authentication)
- [Users & Friends](#users--friends)
- [Groups](#groups)
- [Expenses](#expenses)
- [Response Format](#response-format)

---

## 🔐 Authentication

### 1. Register User
**POST** `/api/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "name": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phonenumber": "+1234567890"
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "65abc123...",
    "name": "john_doe",
    "email": "john@example.com",
    "phonenumber": "+1234567890",
    "friends": [],
    "groups": [],
    "createdAt": "2026-01-23T10:00:00.000Z"
  },
  "message": "user registered successfully",
  "success": true
}
```

---

### 2. Login User
**POST** `/api/auth/login`

Authenticates user and returns access & refresh tokens.

**Request Body:**
```json
{
  "name": "john_doe",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "65abc123...",
      "name": "john_doe",
      "email": "john@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

**Cookies Set:**
- `accessToken` (httpOnly)
- `refreshToken` (httpOnly)

---

### 3. Logout User
**POST** `/api/auth/logout`

**Headers:** `Authorization: Bearer <accessToken>` OR Cookie

Logs out the user and clears tokens.

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "user logged out successfully",
  "success": true
}
```

---

## 👥 Users & Friends

**Note:** All routes in this section require authentication.

### 1. Send Friend Request
**POST** `/api/users/send-friend-request`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "receiverId": "65abc456..."
}
```

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "65def789...",
    "sender": "65abc123...",
    "receiver": "65abc456...",
    "status": "pending",
    "createdAt": "2026-01-23T10:00:00.000Z"
  },
  "message": "Friend request sent successfully",
  "success": true
}
```

---

### 2. Respond to Friend Request
**POST** `/api/users/respond-friend-request`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "requestId": "65def789...",
  "action": "accepted"
}
```

**Actions:** `"accepted"` or `"rejected"`

**Response (200) - Accepted:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "65def789...",
    "sender": "65abc123...",
    "receiver": "65abc456...",
    "status": "accepted"
  },
  "message": "Friend request accepted",
  "success": true
}
```

**Response (200) - Rejected:**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Friend request rejected",
  "success": true
}
```

---

### 3. Search Users by Name
**POST** `/api/users/search-users`

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
- `username` (string, required): Search term

**Example:** `/api/users/search-users?username=john`

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "65abc123...",
      "name": "john_doe",
      "email": "john@example.com",
      "phonenumber": "+1234567890"
    }
  ],
  "message": "Users fetched successfully",
  "success": true
}
```

---

### 4. Get Discover Users
**GET** `/api/users/get-discover-users`

**Headers:** `Authorization: Bearer <accessToken>`

Returns users who are not yet connected.

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "65abc789...",
      "name": "jane_smith",
      "email": "jane@example.com",
      "phonenumber": "+0987654321"
    }
  ],
  "message": "Available users fetched successfully",
  "success": true
}
```

---

### 5. Get User Summary
**GET** `/api/users/get-user-summary`

**Headers:** `Authorization: Bearer <accessToken>`

Returns user's friends, total owing, total debt, and group balances.

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "friends": [
      {
        "_id": "65def123...",
        "sender": {
          "name": "john_doe",
          "email": "john@example.com"
        },
        "receiver": {
          "name": "jane_smith",
          "email": "jane@example.com"
        },
        "status": "accepted"
      }
    ],
    "totalOwing": 150.50,
    "totalDebt": 75.25,
    "groupBalances": [
      {
        "_id": "65ghi789...",
        "groupId": {
          "_id": "65group1...",
          "name": "Trip to Paris"
        },
        "userId": "65abc123...",
        "balance": 75.25
      }
    ]
  },
  "message": "User summary fetched successfully",
  "success": true
}
```

**Balance Explanation:**
- `balance > 0`: Others owe you money (Owing)
- `balance < 0`: You owe others money (Debt)

---

## 🏢 Groups

**Note:** All routes require authentication.

### 1. Create Group
**POST** `/api/groups/create-group`

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "name": "Trip to Paris",
  "description": "Summer vacation 2026",
  "membernames": ["john_doe", "jane_smith", "bob_wilson"]
}
```

**Fields:**
- `name` (string, required): Group name
- `description` (string, optional): Group description
- `membernames` (array of strings, optional): Usernames to add as members (creator is automatically added)

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "65group1...",
    "name": "Trip to Paris",
    "description": "Summer vacation 2026",
    "members": [
      {
        "_id": "65abc123...",
        "name": "john_doe",
        "email": "john@example.com"
      },
      {
        "_id": "65abc456...",
        "name": "jane_smith",
        "email": "jane@example.com"
      }
    ],
    "createdAt": "2026-01-23T10:00:00.000Z"
  },
  "message": "Group created successfully",
  "success": true
}
```

---

### 2. Add Members to Group
**POST** `/api/groups/add-group-members/:groupId`

**Headers:** `Authorization: Bearer <accessToken>`

**URL Parameters:**
- `groupId` (string): Group ID

**Request Body:**
```json
{
  "membernames": ["alice_jones", "charlie_brown"]
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "65group1...",
    "name": "Trip to Paris",
    "description": "Summer vacation 2026",
    "members": [
      {
        "_id": "65abc123...",
        "name": "john_doe",
        "email": "john@example.com",
        "phonenumber": "+1234567890"
      },
      {
        "_id": "65abc789...",
        "name": "alice_jones",
        "email": "alice@example.com",
        "phonenumber": "+1112223333"
      }
    ]
  },
  "message": "Members added successfully",
  "success": true
}
```

---

### 3. Get User's Groups
**GET** `/api/groups/get-user-groups`

**Headers:** `Authorization: Bearer <accessToken>`

Returns all groups the authenticated user is a member of.

**Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "65group1...",
      "name": "Trip to Paris",
      "description": "Summer vacation 2026",
      "members": ["65abc123...", "65abc456..."],
      "createdAt": "2026-01-23T10:00:00.000Z"
    }
  ],
  "message": "Groups fetched successfully",
  "success": true
}
```

---

### 4. Get Group Details
**GET** `/api/groups/get-group-details/:groupId`

**Headers:** `Authorization: Bearer <accessToken>`

**URL Parameters:**
- `groupId` (string): Group ID

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "groupName": "Trip to Paris",
    "totalMembers": 3,
    "members": [
      {
        "_id": "65abc123...",
        "name": "john_doe",
        "email": "john@example.com"
      }
    ],
    "expenses": [
      {
        "_id": "65exp123...",
        "groupId": "65group1...",
        "items": [
          {
            "itemName": "Hotel Booking",
            "itemPrice": 300,
            "paidBy": {
              "_id": "65abc123...",
              "name": "john_doe"
            },
            "sharedBy": [
              {
                "_id": "65abc123...",
                "name": "john_doe"
              },
              {
                "_id": "65abc456...",
                "name": "jane_smith"
              }
            ]
          }
        ],
        "totalAmount": 300,
        "createdAt": "2026-01-23T12:00:00.000Z"
      }
    ],
    "memberBalances": [
      {
        "_id": "65bal123...",
        "groupId": "65group1...",
        "userId": {
          "_id": "65abc123...",
          "name": "john_doe"
        },
        "balance": 150
      },
      {
        "_id": "65bal456...",
        "groupId": "65group1...",
        "userId": {
          "_id": "65abc456...",
          "name": "jane_smith"
        },
        "balance": -150
      }
    ]
  },
  "message": "Group details fetched successfully",
  "success": true
}
```

---

## 💰 Expenses

**Note:** All routes require authentication.

### 1. Create Expense
**POST** `/api/expenses/create-expense`

**Headers:** `Authorization: Bearer <accessToken>`

Records new expenses for a group. Automatically updates member balances.

**Request Body:**
```json
{
  "groupId": "65group1...",
  "items": [
    {
      "itemName": "Hotel Booking",
      "itemPrice": 300,
      "givername": "john_doe",
      "takersname": ["john_doe", "jane_smith", "bob_wilson"]
    },
    {
      "itemName": "Dinner",
      "itemPrice": 150,
      "givername": "jane_smith",
      "takersname": ["john_doe", "jane_smith"]
    }
  ]
}
```

**Fields Explanation:**
- `groupId` (string, required): Group ID
- `items` (array, required): List of expense items
  - `itemName` (string, required): Name/description of the item
  - `itemPrice` (number, required): Total price paid
  - `givername` (string, required): Username of the person who paid
  - `takersname` (array/string, required): Username(s) of people sharing this expense

**Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "65exp123...",
    "groupId": "65group1...",
    "items": [
      {
        "itemName": "Hotel Booking",
        "itemPrice": 300,
        "givername": "john_doe",
        "takersname": ["john_doe", "jane_smith", "bob_wilson"]
      }
    ],
    "totalAmount": 450,
    "createdAt": "2026-01-23T12:00:00.000Z"
  },
  "message": "Expense added successfully",
  "success": true
}
```

**Balance Calculation Logic:**
For an expense of $300 shared by 3 people:
- **Split amount per person:** $300 ÷ 3 = $100
- **Payer (john_doe) balance:** +$300 - $100 = **+$200** (owes himself $100, gets back $200)
- **Other members balance:** **-$100** each (they owe $100 to the group)

---

### 2. Add Expense Items
**POST** `/api/expenses/add-expense-items`

**Headers:** `Authorization: Bearer <accessToken>`

Adds more expense items to an existing group's expenses.

**Request Body:**
```json
{
  "groupId": "65group1...",
  "items": [
    {
      "itemName": "Lunch",
      "itemPrice": 75,
      "givername": "bob_wilson",
      "takersname": ["john_doe", "bob_wilson"]
    }
  ]
}
```

**Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "65exp123...",
    "groupId": "65group1...",
    "items": [
      {
        "itemName": "Hotel Booking",
        "itemPrice": 300,
        "givername": "john_doe",
        "takersname": ["john_doe", "jane_smith", "bob_wilson"]
      },
      {
        "itemName": "Lunch",
        "itemPrice": 75,
        "givername": "bob_wilson",
        "takersname": ["john_doe", "bob_wilson"]
      }
    ],
    "totalAmount": 375,
    "updatedAt": "2026-01-23T14:00:00.000Z"
  },
  "message": "Items added successfully",
  "success": true
}
```

---

### 3. Settle Payment
**POST** `/api/expenses/settle-payment`

**Headers:** `Authorization: Bearer <accessToken>`

Records a direct payment between two users to settle balances.

**Request Body:**
```json
{
  "groupId": "65group1...",
  "fromUserId": "65abc456...",
  "toUserId": "65abc123...",
  "amount": 100
}
```

**Fields:**
- `groupId` (string, required): Group ID
- `fromUserId` (string, required): User ID of payer
- `toUserId` (string, required): User ID of receiver
- `amount` (number, required): Amount being settled

**Response (200):**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Payment settled successfully",
  "success": true
}
```

**Effect on Balances:**
- **fromUserId balance:** Increases by amount (they paid, so they're owed more)
- **toUserId balance:** Decreases by amount (they received, so they owe less)

---

## 📊 Response Format

### Success Response
```json
{
  "statusCode": 200,
  "data": { /* response data */ },
  "message": "Success message",
  "success": true
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes
- `200`: Success (GET, PUT, DELETE)
- `201`: Created (POST)
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (not allowed)
- `404`: Not Found
- `500`: Internal Server Error

---

## 🔑 Authentication Notes

### How to Authenticate
Most endpoints require authentication. You can authenticate in two ways:

1. **Cookie (automatic after login):**
   - Cookies are set automatically upon login
   - No additional headers needed

2. **Authorization Header:**
   ```
   Authorization: Bearer <accessToken>
   ```

### Token Expiry
- **Access Token:** Short-lived (set in `ACCESS_TOKEN_EXPIRY` env variable)
- **Refresh Token:** Long-lived (set in `REFRESH_TOKEN_EXPIRY` env variable)

---

## 💡 Balance Logic Explained

The system maintains a **Net Balance** for each user in each group:

### Positive Balance (+)
User is **owed money** by the group. They've paid more than their share.

**Example:** John paid $300 for a hotel shared by 3 people
- His share: $100
- He paid: $300
- **His balance: +$200** (others owe him $200)

### Negative Balance (-)
User **owes money** to the group. They've paid less than their share.

**Example:** Jane's share of expenses is $150, but she hasn't paid anything
- **Her balance: -$150** (she owes $150 to the group)

### Zero Balance (0)
User has paid exactly their share. No money owed in either direction.

---

## 🚀 Quick Start Example

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "john_doe",
    "email": "john@example.com",
    "password": "pass123",
    "phonenumber": "+1234567890"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "name": "john_doe",
    "password": "pass123"
  }'
```

### 2. Create a Group
```bash
curl -X POST http://localhost:8000/api/groups/create-group \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekend Trip",
    "description": "Beach vacation",
    "membernames": ["jane_smith", "bob_wilson"]
  }'
```

### 3. Add an Expense
```bash
curl -X POST http://localhost:8000/api/expenses/create-expense \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "YOUR_GROUP_ID",
    "items": [{
      "itemName": "Gas",
      "itemPrice": 50,
      "givername": "john_doe",
      "takersname": ["john_doe", "jane_smith"]
    }]
  }'
```

### 4. Check Balances
```bash
curl -X GET http://localhost:8000/api/groups/get-group-details/YOUR_GROUP_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📝 Environment Variables Required

Create a `.env` file with:

```env
PORT=8000
MONGODB_URL=mongodb://localhost:27017
ACCESS_TOKEN_SECRET=your_access_token_secret_key
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
REFRESH_TOKEN_EXPIRY=30d
NODE_ENV=development
```

---

## ⚠️ Important Notes

1. **Group Membership Required:** Users must be members of a group to add expenses to it.

2. **User Validation:** When adding expenses, all usernames in `givername` and `takersname` must exist and be group members.

3. **Balance Updates:** Balances are automatically updated when expenses are added. No manual calculation needed.

4. **Currency:** All amounts are assumed to be in the same currency (no currency conversion).

5. **Precision:** Use decimal numbers for amounts (e.g., 150.50).

---

**Version:** 1.0.0  
**Last Updated:** January 23, 2026

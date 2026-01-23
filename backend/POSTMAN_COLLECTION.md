# 📬 Postman Collection - Group Expense Sharing API

## Import Instructions

### For Postman:
1. Open Postman
2. Click "Import" button
3. Copy the JSON below and paste it
4. Click "Import"

### For Thunder Client (VS Code):
1. Install Thunder Client extension
2. Click "Collections" tab
3. Click "Import" 
4. Paste the JSON below

---

## Collection JSON

```json
{
  "info": {
    "name": "Group Expense Sharing API",
    "description": "Complete API collection for the group expense-sharing backend",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8000",
      "type": "string"
    },
    {
      "key": "accessToken",
      "value": "",
      "type": "string"
    },
    {
      "key": "groupId",
      "value": "",
      "type": "string"
    },
    {
      "key": "userId",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"john_doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"phonenumber\": \"+1234567890\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login User",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "var jsonData = pm.response.json();",
                  "pm.collectionVariables.set(\"accessToken\", jsonData.data.accessToken);",
                  "pm.collectionVariables.set(\"userId\", jsonData.data.user._id);"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"john_doe\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Logout User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/auth/logout",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "logout"]
            }
          }
        }
      ]
    },
    {
      "name": "Users & Friends",
      "item": [
        {
          "name": "Send Friend Request",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"receiverId\": \"RECEIVER_USER_ID_HERE\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/send-friend-request",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "send-friend-request"]
            }
          }
        },
        {
          "name": "Respond to Friend Request",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"requestId\": \"FRIEND_REQUEST_ID_HERE\",\n  \"action\": \"accepted\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/respond-friend-request",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "respond-friend-request"]
            }
          }
        },
        {
          "name": "Search Users",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/search-users?username=john",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "search-users"],
              "query": [
                {
                  "key": "username",
                  "value": "john"
                }
              ]
            }
          }
        },
        {
          "name": "Get Discover Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/get-discover-users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "get-discover-users"]
            }
          }
        },
        {
          "name": "Get User Summary",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/get-user-summary",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "get-user-summary"]
            }
          }
        }
      ]
    },
    {
      "name": "Groups",
      "item": [
        {
          "name": "Create Group",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "var jsonData = pm.response.json();",
                  "if (jsonData.data && jsonData.data._id) {",
                  "    pm.collectionVariables.set(\"groupId\", jsonData.data._id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Weekend Trip\",\n  \"description\": \"Beach vacation with friends\",\n  \"membernames\": [\"jane_smith\", \"bob_wilson\"]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/groups/create-group",
              "host": ["{{baseUrl}}"],
              "path": ["api", "groups", "create-group"]
            }
          }
        },
        {
          "name": "Add Members to Group",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"membernames\": [\"alice_jones\", \"charlie_brown\"]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/groups/add-group-members/{{groupId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "groups", "add-group-members", "{{groupId}}"]
            }
          }
        },
        {
          "name": "Get User Groups",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/groups/get-user-groups",
              "host": ["{{baseUrl}}"],
              "path": ["api", "groups", "get-user-groups"]
            }
          }
        },
        {
          "name": "Get Group Details",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/groups/get-group-details/{{groupId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "groups", "get-group-details", "{{groupId}}"]
            }
          }
        }
      ]
    },
    {
      "name": "Expenses",
      "item": [
        {
          "name": "Create Expense",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"groupId\": \"{{groupId}}\",\n  \"items\": [\n    {\n      \"itemName\": \"Hotel Booking\",\n      \"itemPrice\": 300,\n      \"givername\": \"john_doe\",\n      \"takersname\": [\"john_doe\", \"jane_smith\"]\n    },\n    {\n      \"itemName\": \"Dinner\",\n      \"itemPrice\": 150,\n      \"givername\": \"jane_smith\",\n      \"takersname\": [\"john_doe\", \"jane_smith\", \"bob_wilson\"]\n    }\n  ]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/expenses/create-expense",
              "host": ["{{baseUrl}}"],
              "path": ["api", "expenses", "create-expense"]
            }
          }
        },
        {
          "name": "Add Expense Items",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"groupId\": \"{{groupId}}\",\n  \"items\": [\n    {\n      \"itemName\": \"Breakfast\",\n      \"itemPrice\": 50,\n      \"givername\": \"bob_wilson\",\n      \"takersname\": [\"john_doe\", \"bob_wilson\"]\n    }\n  ]\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/expenses/add-expense-items",
              "host": ["{{baseUrl}}"],
              "path": ["api", "expenses", "add-expense-items"]
            }
          }
        },
        {
          "name": "Settle Payment",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"groupId\": \"{{groupId}}\",\n  \"fromUserId\": \"USER_ID_WHO_PAYS\",\n  \"toUserId\": \"USER_ID_WHO_RECEIVES\",\n  \"amount\": 100\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/expenses/settle-payment",
              "host": ["{{baseUrl}}"],
              "path": ["api", "expenses", "settle-payment"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 📝 How to Use

### 1. Import Collection
Copy the JSON above and import it into Postman or Thunder Client.

### 2. Set Variables
The collection uses these variables:
- `baseUrl`: http://localhost:8000 (default)
- `accessToken`: Auto-set after login
- `groupId`: Auto-set after creating group
- `userId`: Auto-set after login

### 3. Test Flow
1. **Register User** - Create account
2. **Login User** - Get token (auto-saved)
3. **Create Group** - Make a group (ID auto-saved)
4. **Create Expense** - Add expense to group
5. **Get Group Details** - Check balances

### 4. Manual Variable Updates
If auto-save doesn't work:
1. Go to Collection Variables
2. Update `accessToken` from login response
3. Update `groupId` from create-group response

---

## 🎯 Quick Testing Steps

### A. Basic Flow
```
1. Register User → creates account
2. Login User → saves token automatically
3. Create Group → saves groupId automatically
4. Create Expense → uses saved groupId
5. Get Group Details → shows balances
```

### B. Multi-User Flow
```
1. Register User 1 (john_doe)
2. Register User 2 (jane_smith)
3. Login as john_doe
4. Create Group with jane_smith
5. Create Expense (john pays)
6. Login as jane_smith
7. Add Expense Items (jane pays)
8. Check balances
```

---

## 💡 Tips

1. **Token Expiry:** If you get 401 error, login again
2. **Group ID:** Replace `{{groupId}}` manually if auto-save fails
3. **User IDs:** Get from login response or user search
4. **Member Names:** Must be exact matches (case-sensitive)

---

## 🔍 Example Response

After running **Login User**, you'll see:
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

The `accessToken` is automatically saved to collection variables.

---

**Note:** Make sure your backend server is running on `http://localhost:8000` before testing!

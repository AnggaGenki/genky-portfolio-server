# User API Specifications

## Get Captcha Code

Endpoint : GET /captchaCode

Response Body Success :

```json
{
  "data": {
    "captcha_code": "?",
    "token": "?"
  }
}
```

Response Body Error :

```json
{
  "error": {
    "title": "?",
    "messages": ["?", "..."]
  }
}
```

## User Registration

Endpoint : POST /api/users/register

Additional Request Headers :

```json
{
  "Captcha-Code": "?",
  "Authentication": "?" // token
}
```

Request Body :

```json
{
  "username": "?",
  "password": "?",
  "password_confirm": "?"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "?",
    "token": "?"
  }
}
```

Response Body Error :

```json
{
  "error": {
    "title": "?",
    "messages": ["?", "..."]
  }
}
```

## User Login

Endpoint : POST /api/users/login

Additional Request Headers :

```json
{
  "Captcha-Code": "?",
  "Authentication": "?" // token
}
```

Request Body :

```json
{
  "username": "?",
  "password": "?"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "?",
    "token": "?"
  }
}
```

Response Body Error :

```json
{
  "error": {
    "title": "?",
    "messages": ["?", "..."]
  }
}
```

## User Update

Endpoint : PATCH /api/users/update

Additional Request Headers :

```json
{
  "Authorization": "?" // token
}
```

Request Body :

```json
{
  "username": "?", // optional
  "password": "?", // optional
  "password_confirm": "?", // appears if the password exists
  "current_password": "?" // appears if the password exists
}
```

Response Body Success :

```json
{
  "data": {
    "username": "?"
  }
}
```

Response Body Error :

```json
{
  "error": {
    "title": "?",
    "messages": ["?", "..."]
  }
}
```

## User Logout

Endpoint : DELETE /api/users/logout

Additional Request Headers :

```json
{
  "Authorization": "?" // token
}
```

Response Body Success :

```json
{
  "data": {
    "status": "Logout Successful"
  }
}
```

Response Body Error :

```json
{
  "error": {
    "title": "?",
    "messages": ["?", "..."]
  }
}
```

## User Delete Account

Endpoint : DELETE /api/users/delete

Additional Request Headers :

```json
{
  "Authorization": "?" // token
}
```

Response Body Success :

```json
{
  "data": {
    "status": "Delete Account Successfully"
  }
}
```

Response Body Error :

```json
{
  "error": {
    "title": "?",
    "messages": ["?", "..."]
  }
}
```

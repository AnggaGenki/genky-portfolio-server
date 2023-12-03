# User API Specifications

## Get Captcha Code

Endpoint : GET /captchaCode

Response Body Success :

```json
{
  "data": {
    "captcha_code": "?"
  }
}
```

Response Body Error :

```json
{
  "errors": {
    "title": "?",
    "message": ["?", "..."]
  }
}
```

## User Registration

Endpoint : POST /users/register

Additional Request Headers :

```json
{
  "captcha_code": "?"
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
  "errors": {
    "title": "?",
    "messages": ["?", "..."]
  }
}
```

## User Login

Endpoint : POST /users/login

Additional Request Headers :

```json
{
  "captcha_code": "?"
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
  "errors": {
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
  "token": "?"
}
```

Request Body :

```json
{
  "username": "?", // optional
  "password": "?", // optional
  "password_confirm": "?" // appears if the password exists
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
  "errors": {
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
  "token": "?"
}
```

Response Body Success :

```json
{
  "data": {
    "status": "Logout Success"
  }
}
```

Response Body Error :

```json
{
  "errors": {
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
  "token": "?"
}
```

Response Body Success :

```json
{
  "data": {
    "status": "Delete Account Success"
  }
}
```

Response Body Error :

```json
{
  "errors": {
    "title": "?",
    "messages": ["?", "..."]
  }
}
```

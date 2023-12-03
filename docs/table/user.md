# User Table Specifications

## id

- primary key
- auto increment

## username

- varchar
- max length (100)
- min length (3)
- valid character
  - a-z
  - A-Z
  - 0-9
  - separator (\_- )

## password

- encrypted
- varchar
- request max length (100)
- column max length (255)
- reqeust min length (5)
- reqeust valid character
  - a-z
  - A-Z
  - 0-9
  - special characters (!@#$%^&\*\_-+=/\|()[]{}:;"'<>,.?)

## token

- varchar
- max length (255)

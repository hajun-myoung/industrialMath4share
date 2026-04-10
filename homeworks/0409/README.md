# Directory Structure

```sh
homeworks/0409
├── css
│   └── global.css
├── js
│   ├── pages
│   │   ├── signin.js
│   │   ├── signup.js
│   │   └── welcome.js
│   └── utils
│       ├── storage.js
│       └── validation.js
├── public
│   └── images
├── README.md
├── signin.html
├── signup.html
└── welcome.html
```

- `/css/` contains global and shared styles
- `/js/` contains all JavaScript logic
- `/public/` contains static assets (e.g., images)
- `README.md` project documentation
- `signin.html` sign-in page
- `signup.html` sign-up page
- `welcome.html` page shown after successful sign-in

## Features

- [x] Sign up
- [x] Sign in
- [x] Encrypted password
  - [x] Sign up
  - [x] Sign in
- [x] Structured saving, based on localStorage
  - [x] auth:users
  - [x] auth:session
- [x] Session based state managing
- [x] Validating inputs, thorwing errors

## CAUTION: Auth

User data is stored as an array under `auth:users` in localStorage, allowing multiple accounts and duplicate email validation

This logic is not the best way to secure user information  
But still a good way to simple-static-web

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

- [ ] Sign up
- [ ] Sign in
- [ ] Encrypted password
- [ ] Structured saving, based on localStorage
  - [ ] auth:user
  - [ ] auth:session
- [ ] Session based state managing
- [ ] Validating inputs, thorwing errors

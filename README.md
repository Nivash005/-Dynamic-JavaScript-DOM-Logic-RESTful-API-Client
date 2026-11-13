# Dynamic JavaScript DOM Logic & RESTful API Client

A vanilla JavaScript ES6+ product explorer demonstrating asynchronous REST API consumption, dynamic DOM updates, client-side search/filter/sort, and persistent cart state.

## Features
- Async/await and Fetch API using Fake Store API
- Modular JavaScript: `api.js`, `app.js`, `dom.js`, and `state.js`
- Real-time search without page reloads
- Category tabs and sorting by price, rating, and name
- Shopping cart persisted with localStorage
- Loading skeletons and user-friendly error banner
- Responsive layout and accessible labels
- Abortable network requests using AbortController

## Project structure
```
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── api.js
│   ├── app.js
│   ├── dom.js
│   └── state.js
└── README.md
```

## Run locally
ES modules require a local web server.

Python:
```bash
python -m http.server 5500
```
Open http://localhost:5500

Alternatively, use the VS Code Live Server extension.

## API
Products are loaded from https://fakestoreapi.com/products.

## Submission evidence
- [x] REST API integration with async/await
- [x] Dynamic DOM rendering
- [x] Live search
- [x] Category filtering
- [x] Sorting
- [x] localStorage state caching
- [x] Loading skeletons
- [x] Error handling
- [x] Modular JavaScript files

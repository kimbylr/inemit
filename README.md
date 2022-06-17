# Inemit!

**Inemit** is a Web App / PWA for practicing vocabulary (or anything else) using [Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition).

Features include:

- Lists. With stuff. To learn. (Yes, it's rocket science.)
- A clever algorithm to evaluate if the solution entered is correct (starship science, at least)
- A nice palette of green colours. Also some smilies.
- A progress graphic meant to be motivating. That is, if you learn regularly.
- Glitches: possibly more than zero, but far less than could be (Software keyboard handling. Return does what it should. That kind of stuff.)
- Image prompts with search
- Import

`Ine mit` means "In with it" in Swiss German.

## Setup and run

Make sure to use Node.js v16

```sh
nvm use
```

### API

1. Copy `.env.dist` -> `.env` and set env variables (you'll need an auth service like Auth0 and a Mongo DB)

2. Install dependencies

```sh
npm install
```

3. Run locally (http://localhost:3003)

```sh
npm run dev
```

### Frontend

1. Copy `.env.dist` -> `.env` and set env variables

2. Install dependencies

```sh
npm install
```

3. Run locally (http://localhost:8080):

```sh
npm run dev
```

If env var `VITE_LIVE_API` is true, this will hit the `VITE_API_URL`. Set to false to use with local API.

### Tests

```sh
npm test
```

## Credits

Made with [createapp.dev](https://createapp.dev/)

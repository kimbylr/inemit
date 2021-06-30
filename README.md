# Inemit!

**Inemit** is a Web App / PWA for practicing vocabulary (or anything else) using [Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition). It was born out of dissatisfaction with the available options after my former learning platform of choice had shut down their spaced repetition feature.

Features include:

- Lists. With stuff. To learn. (Yes, it's rocket science.)
- A clever algorithm to evaluate if the solution entered is correct (starship science, at least)
- A nice palette of green colours. Also some smilies.
- A progress graphic meant to be motivating. That is, if you learn regularly.
- Glitches: possibly more than zero, but far less than could be (Sensible sizes. Software keyboard handling. Return does what it should. That kind of stuff.)
- Image prompts with search
- Import

`Ine mit` means "In with it" in Swiss German.

## Setup and run

Node version: 12

### API

1. Copy `.env.dist` -> `.env` and set env variables (you'll need an auth service like auth0 and a mongo DB)

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

3. Run locally (http://localhost:8080) using local API:

```sh
npm run dev
```

or using live API:

```sh
npm run dev:liveapi
```

(`npm run dev` runs postinstall script as a quick fix for a type problem, see this [github discussion](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33311))

### Tests

```sh
npm test
```

## Credits

Made with [createapp.dev](https://createapp.dev/)

# Inemit!

Inemit is a Web App / PWA for practicing vocabulary (or anything else) using [Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition). It is in an early usable stadium and there are plans to enhance it further. It mainly covers my own needs after the learning platform of choice has shut down their spaced repetition feature.

`Ine mit` means "In with it" in Swiss German.

## Setup and run

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

3. Run locally (http://localhost:8080) – defaults to local API, set `LIVE_API=yesplease` to use live API.

```sh
(LIVE_API=yesplease) npm run dev
```

(`npm run dev` runs postinstall script because of https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33311)

## Credits

Made with [createapp.dev](https://createapp.dev/)

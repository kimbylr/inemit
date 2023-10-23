# Inemit!

**Inemit** is a Web App / PWA for practicing vocabulary (or anything else) using [Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition).

v1 (2020): SPA; v2 (2023): partial rewrite using Next.js

Features:

- **Edit mode**: Create and maintain self-curated lists of vocuabulary (or other stuff to learn)
  - Add images from Unsplash or import lists
  - Search and duplicate detection
- **Learn mode**: Get it into your head
  - Spaced repetition is made for long-term retention
  - Evaluation algorithm takes care of variants
  - Flagging and quick edit
  - Progress visualisations
- Simple yet powerful

`Ine mit!` is Swiss German for "Get it in!".


## Setup

1. Make sure to use correct Node.js version: `nvm use`

2. Install dependencies: `npm install`

3. Copy `.env.dist` -> `.env` and set env variables for Auth0, Mongo DB, Deepl, and Unsplash


## Run

Run Next.js dev server: `npm run dev`


## Tests

```sh
npm test
```

# 🐝 Beearly

This repository contains the source code for the **Beearly** waitlist creation web app.

<img src="./public/beearly-logo.svg">

## 📋 Features

The app is a factory that allows users to create waitlists, to let their followers participate in the launch of new projects and products or even to kick start a brand new community.
Users can also set deadlines for their waitlists or establish special requirements for joining.

People can enter a user's waitlist with just one click by interacting with a tailor-made Farcaster Frame, whose url link is automatically generated by **beearly**.

Inside the app the user can manage his waitlists and check their current state, give updates to whitelisted people by sending them direct casts and even see a leaderboard with people that put high effort in sharing the waitlist by their own.

## 📦 Installation

To install and run the app locally, follow these steps:

1. Clone the repository

```bash
git clone https://github.com/builders-garden/beearly.git
cd beearly
```

2. Install the dependencies using your package manager of choice

```bash
npm install # using npm
yarn install # using yarn
pnpm install # using pnpm
```

3. Copy the `.env.sample` file to `.env` and fill in the required fields

```bash
cp .env.example .env
```

4. Build and start the web app

```bash
npm run build && npm run start # using npm
yarn build && yarn start # using yarn
pnpm build && pnpm start # using pnpm
```

The app should be running in the chosen port (`3000` by default).

## 📝 License

This project is licensed under the **MIT License**. check the [LICENSE.md](/LICENSE.md) file for more information.

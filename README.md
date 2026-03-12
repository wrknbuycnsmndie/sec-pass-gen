# Secure Password Generator

A small password generator built with Next.js, TypeScript, Zustand, and ShadCN UI.

Built for use by me and my gf. Huge thanks to LastPass for the inspiration btw.

The app focuses on a simple interface and stronger defaults:

- cryptographically secure password generation via Web Crypto
- configurable length and character categories
- persisted user preferences without storing the generated password
- lightweight Node-based tests
- GitHub Actions CI and Dependabot updates

## Preview

The generator lets you:

- choose password length
- include uppercase letters
- include lowercase letters
- include numbers
- include symbols
- generate and copy a password in one screen

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Zustand
- ShadCN UI
- Tailwind CSS v4
- Motion

## Requirements

- Node.js 22 or newer
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
```

Runs the app in development mode.

```bash
npm run build
```

Builds the app for production.

```bash
npm run start
```

Starts the production build locally.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run test
```

Runs the Node test suite for the password generator and store behavior.

## Project Notes

- Password generation is implemented in `src/lib/password.ts`.
- UI state is managed in `src/store/store.ts`.
- Only preferences are persisted between sessions; generated passwords are not.
- Tests live in `tests/` and run on Node 22.

## Automation

This repository includes:

- GitHub Actions CI for test, lint, and build checks
- Dependabot for weekly dependency and workflow updates

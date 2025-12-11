# Next.js Starter Template

A production-ready Next.js starter template with TypeScript, Tailwind CSS, and shadcn/ui.

## Author

Bisakto Rahi

## Features

- Next.js 15+ with App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Dark mode support
- Motion animations
- Pre-configured fonts
- ESLint and Prettier
- Responsive design

## Getting Started

1. Clone or copy this template
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── error.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── motion/
│   ├── components/
│   │   ├── feature/
│   │   │   └── sample-feature.tsx
│   │   └── ui/
│   │       ├── button.tsx
│   │       └── theme-toggle.tsx
│   ├── config/
│   │   ├── configURL.ts
│   │   └── const.ts
│   ├── context/
│   │   └── store.ts
│   ├── data/
│   ├── hooks/
│   ├── interface/
│   │   └── book.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── middleware/
│   ├── provider/
│   │   ├── storeProvider.tsx
│   │   └── themeProvider.tsx
│   ├── services/
│   │   └── book.service.ts
│   ├── style/
│   │   └── globals.css
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm run start` - Runs the built app in production mode
- `npm run lint` - Runs ESLint

Start building your next application without worrying about basic setup!
# Pathcte Setup Guide

## Initial Setup

Follow these steps to get Pathcte up and running on your local machine.

### 1. Install Dependencies

```bash
# From the root directory
cd /mnt/c/Users/rosej/Documents/Projects/pathcte.app
npm install
```

This will install dependencies for all packages in the monorepo.

### 2. Configure Environment Variables

You need to add your Supabase anon key to the environment file:

```bash
# Edit packages/web/.env
nano packages/web/.env
```

Replace `your_supabase_anon_key_here` with your actual Supabase anon key.

The Supabase URL is already configured:
- **URL**: https://festwdkldwnpmqxrkiso.supabase.co

### 3. Start Development Server

```bash
# From the root directory
npm run dev
```

Or directly from the web package:

```bash
cd packages/web
npm run dev
```

The app will open at: **http://localhost:5173**

### 4. Build for Production

```bash
npm run build
```

This will create an optimized production build in `packages/web/dist/`.

## Project Structure

```
pathcte.app/
├── packages/
│   ├── shared/           # Shared types, services, hooks
│   │   ├── src/
│   │   │   ├── types/    # TypeScript type definitions
│   │   │   ├── config/   # Supabase config, constants
│   │   │   └── index.ts  # Main export file
│   │   └── package.json
│   │
│   └── web/              # React web application
│       ├── src/
│       │   ├── components/   # React components
│       │   ├── pages/        # Page components
│       │   ├── hooks/        # Custom React hooks
│       │   ├── utils/        # Utility functions
│       │   ├── styles/       # Global styles
│       │   ├── App.tsx       # Main app component
│       │   └── main.tsx      # Entry point
│       ├── public/           # Static assets
│       ├── index.html        # HTML template
│       ├── vite.config.ts    # Vite configuration
│       └── package.json
│
├── docs/                 # Documentation
├── package.json          # Root package.json (workspace)
└── README.md
```

## Available Scripts

### Root Level
- `npm run dev` - Start web dev server
- `npm run build` - Build web app for production
- `npm run test` - Run tests across all packages
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check with TypeScript

### Web Package
- `npm run dev --workspace=packages/web` - Start dev server
- `npm run build --workspace=packages/web` - Build for production
- `npm run preview --workspace=packages/web` - Preview production build

## Next Steps

### Phase 1: Complete Foundation
1. Set up Supabase database schema
2. Implement authentication (sign up, login, logout)
3. Create protected routes
4. Build core UI component library

### Phase 2: Student Features
1. Game joining flow
2. Simple game mode (Career Quest)
3. Pathkey collection display
4. User dashboard

### Phase 3: Teacher Features
1. Question set creation
2. Game hosting
3. Analytics dashboard

### Phase 4: Advanced Features
1. More game modes
2. Trading system
3. Achievements
4. Leaderboards

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Edit vite.config.ts and change the port number
server: {
  port: 5174, // or any other available port
}
```

### Module Not Found Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules packages/*/node_modules
npm install
```

### TypeScript Errors
Run type checking:
```bash
npm run typecheck
```

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

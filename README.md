# PathCTE

**Career Exploration Gaming Platform**

PathCTE is a gamified career exploration platform that makes learning about careers fun through interactive games and collectible "Pathkeys". Students play educational games to unlock career collectibles, while teachers can create custom question sets and host live multiplayer sessions.

## 🎯 Project Overview

- **Web App**: React + TypeScript + Vite + Tailwind CSS
- **Mobile Apps**: React Native + Expo (iOS & Android) - Coming Q2 2025
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **Hosting**: Netlify with continuous deployment
- **Assets**: Azure Blob Storage for media content

## 🏗️ Architecture

This is a monorepo managed with npm workspaces:

```
pathcte.app/
├── packages/
│   ├── shared/          # Shared code (types, services, hooks, utils)
│   ├── web/             # React web application
│   └── mobile/          # React Native mobile app (future)
├── docs/                # Documentation
└── .github/workflows/   # CI/CD pipelines
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Supabase account
- Azure Blob Storage account (for media assets)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp packages/web/.env.example packages/web/.env
# Edit .env with your Supabase and Azure credentials

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start web development server
- `npm run build` - Build production bundle
- `npm run test` - Run tests across all packages
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Type check with TypeScript

## 🎮 Features

### For Students
- Join live games with a code
- Play 20+ educational game modes
- Unlock and collect Pathkeys
- Explore careers through engaging content
- Track progress and achievements

### For Teachers
- Create custom question sets
- Host live multiplayer games
- Assign homework
- View detailed analytics
- Manage student progress

### Game Modes
- **Career Quest**: Trivia-based career exploration
- **Path Defense**: Strategy tower defense with career themes
- **Career Clash**: Head-to-head career knowledge battles
- **Mystery Path**: Guess-the-career challenges
- And many more!

## 🎨 Design System

PathCTE uses a custom design system built with Tailwind CSS and shared design tokens. All components are built to work seamlessly across web and mobile platforms.

## 📱 Mobile Development

Native iOS and Android apps are planned for Q2 2025 using React Native with Expo. The codebase is architected with mobile-first principles to enable 70% code reuse between web and mobile platforms.

See [Mobile App Strategy](./docs/Pathcte_Mobile_App_Strategy.md) for details.

## 🔐 Security

- Row Level Security (RLS) policies in Supabase
- Secure authentication with Supabase Auth
- Environment-based configuration
- HTTPS-only in production

## 🤝 Integration with Pathfinity

PathCTE integrates seamlessly with Pathfinity:
- Premium Pathfinity subscribers get full Pathcte access
- SSO authentication between platforms
- Featured placement in Discovered Live! Arcade
- Shared career content and data

## 📄 License

Proprietary - All Rights Reserved

## 🌐 Links

- **Production**: https://pathcte.com
- **Documentation**: [Implementation Guide](./docs/Pathcte_Implementation_Guide_Claude_Code.md)
- **Mobile Strategy**: [Mobile App Strategy](./docs/Pathcte_Mobile_App_Strategy.md)

---

**Built with ❤️ by the Pathfinity Team**

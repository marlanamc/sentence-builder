# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### React + Vite Version
```bash
cd sentence-builder-complete/source
pnpm install        # Install dependencies (uses pnpm package manager)
pnpm run dev       # Start development server on localhost
pnpm run build     # Build for production (outputs to dist/)
pnpm run lint      # Run ESLint for code quality checks
pnpm run preview   # Preview production build locally
```

### Next.js Version
```bash
cd sentence-builder-nextjs
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Testing
No test suite is currently configured in either project. Consider adding Vitest for React or Jest for Next.js.

## Architecture

### Project Structure
The repository contains two parallel implementations of an ESOL sentence builder game:
- **sentence-builder-complete/** - React + Vite implementation with complete 45-level system, fully production-ready
- **sentence-builder-nextjs/** - Next.js implementation with server-side features and Supabase integration

### Core Systems

The application implements a sophisticated grammar engine with several interconnected systems:

1. **Grammar Engine** (`src/data/enhancedGrammarEngine.js`) - Validates sentence construction with context-aware rules for tense usage, subject-verb agreement, and article placement

2. **Level Progression** (`src/data/comprehensiveLevels45.js`) - 45 progressive levels organized into 9 grammar categories, from basic present tense to advanced conditionals

3. **Verb System** (`src/data/enhancedVerbDatabase.js`) - Database of 229+ verbs with all conjugation forms (V1, V2, V3, V1_3rd), categorized by difficulty and type

4. **Time Expression System** (`src/data/timeExpressionSystem.js`) - Critical for teaching the difference between present perfect and past simple through finished/unfinished time markers

5. **Component Architecture** - Main App.jsx orchestrates category selection, level progression, and game mechanics through modular components (CategorySelector, LevelSelector, GameificationSystem)

### Key Design Patterns

- **State Management**: React hooks (useState, useEffect) with custom hooks for settings and game stats
- **Word Toggling**: Clickable tiles that cycle through forms (eat/eats, book/books) for grammar practice
- **Progressive Unlocking**: Categories and levels unlock based on points and achievements
- **Mobile-First**: Touch-optimized UI using Tailwind CSS with responsive breakpoints

### Build Configuration

- **Vite** as build tool with React plugin and Tailwind CSS integration
- **Path aliasing**: `@/` maps to `./src` directory for cleaner imports
- **ESLint** configured with React hooks and refresh plugins
- **Package manager**: pnpm with lockfile (v10.4.1)
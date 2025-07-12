# Copilot Instructions for SidepanelLLM Chrome Extension

## Project Overview
This is a Chrome extension that provides an AI chat interface in the browser's side panel. Built with React, TypeScript, and Vite using a monorepo structure with Turbo and pnpm.

## Architecture & Key Concepts

### Monorepo Structure
- Uses **Turbo** for build orchestration - see `turbo.json` for pipeline configuration
- **pnpm workspaces** manage dependencies across packages
- Core components: `/pages/` (UI components), `/chrome-extension/` (manifest & background), `/packages/` (shared utilities)

### Extension Architecture
- **Manifest V3** extension with service worker background script
- **Side panel** as primary UI (`pages/sidepanel/`) 
- **Background script** (`chrome-extension/lib/background/`) handles message passing and API calls
- **Content script** (`pages/content/`) for minimal page interaction
- **Options page** (`pages/options/`) for configuration

### Key Data Flow
1. User clicks sidepanel buttons → triggers message to background script
2. Background script executes browser APIs (screenshots, text extraction, YouTube subtitles)
3. Results sent back to sidepanel for AI chat integration
4. AI API calls handled entirely in background script for security

## Development Workflow

### Build & Development
```bash
pnpm dev           # Start development with HMR
pnpm build         # Production build
pnpm dev:firefox   # Firefox-specific development
```

### Key Commands
- Extension builds to `/dist/` directory
- HMR server runs on separate process for live reloading
- Use Chrome's "Load unpacked" with `/dist/` folder for testing

## Project-Specific Patterns

### Message Passing Architecture
- All sidepanel↔background communication uses `chrome.runtime.sendMessage()`
- Message types defined in `pages/sidepanel/src/types/MessageType.ts`
- Background script listener pattern in `chrome-extension/lib/background/index.ts`

### Storage Pattern
- Custom storage abstraction in `packages/storage/` using Chrome storage API
- Storage hooks with Suspense: `useStorageSuspense()` pattern
- Key storages: `ApiKeyStorage`, `SystemPromptStorage`, `SideButtonSettingStorage`

### UI Integration
- Uses `react-ai-chat-view` library for chat interface
- Button configuration in `FormSideButtons.tsx` with icon + function pattern
- Error boundaries and Suspense wrappers on all major components

### Extension-Specific Features
- **YouTube subtitle extraction**: Injects script to access video subtitle data
- **Page text extraction**: Uses content script to gather all text content
- **Screenshot capture**: `chrome.tabs.captureVisibleTab()` API
- **Text selection**: Content script-based selected text retrieval

## Critical Files
- `chrome-extension/manifest.js` - Extension configuration (dynamic manifest generation)
- `pages/sidepanel/src/SidePanel.tsx` - Main chat interface
- `chrome-extension/lib/background/index.ts` - Message router & API handler
- `packages/storage/lib/` - Storage abstractions
- `turbo.json` - Build pipeline configuration

## Environment & Configuration
- Uses environment variables for development builds (`__DEV__`, `__FIREFOX__`)
- API keys stored securely using Chrome storage API
- Development mode logging throughout codebase

## Testing & Debugging
- Load extension in Chrome using `/dist/` folder
- Check background script logs in Chrome's service worker inspector
- Sidepanel logs visible in regular DevTools when panel is open
- Use `import.meta.env.MODE === 'development'` for debug logging

# RisuAI Architecture Documentation

> **Last Updated**: 2025-11-18
> **Purpose**: Comprehensive overview of the RisuAI codebase structure for developers and AI agents

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Key Components](#key-components)
- [Architecture Patterns](#architecture-patterns)
- [Data Flow](#data-flow)
- [Core Systems](#core-systems)
- [Configuration Files](#configuration-files)
- [Build & Development](#build--development)
- [Cross-Platform Support](#cross-platform-support)
- [Code Metrics](#code-metrics)

---

## Project Overview

**RisuAI** is a cross-platform AI chatting application that provides a unified frontend for interacting with multiple AI providers. It features character-driven conversations, customizable AI models, and rich extensibility through plugins.

### Key Features
- Multi-provider AI integration (OpenAI, Claude, Gemini, OpenRouter, local models)
- Character card support with emotion/expression images
- Group chat capabilities
- Advanced memory systems (HypaMemory V2/V3, SupaMemory)
- Plugin architecture for extending functionality
- Regex-based output modification
- Multi-language translation support
- Local model support (Ollama, Ooba, WebLLM)
- Lorebook/world info system
- Model Context Protocol (MCP) support
- Text-to-speech and speech-to-text
- Stable Diffusion integration

---

## Technology Stack

### Frontend
- **Framework**: Svelte 5.1.9 (with reactive .svelte.ts files)
- **Language**: TypeScript 5.6.3
- **Build Tool**: Vite 5.4.9
- **Styling**: Tailwind CSS 3.4.1 + PostCSS
- **Package Manager**: pnpm

### Desktop & Mobile
- **Desktop**: Tauri 2.5 (Rust-based, cross-platform)
- **Mobile**: Capacitor 5.6.0 (Android/iOS)
- **Tauri Plugins**: File system, HTTP, shell, dialog

### Backend (Rust)
- **Runtime**: Tauri 2.5.1
- **Key Libraries**:
  - `reqwest` - HTTP requests
  - `tokio` - Async runtime
  - `serde_json` - JSON serialization
  - `tiktoken-rs` - Token counting
  - `oauth2` - Authentication

### AI/ML Integration
- OpenAI, Claude (Anthropic), Gemini, DeepInfra, OpenRouter
- Local models: Ollama, Ooba, WebLLM
- Translation: Bergamot translator
- Embeddings: Hugging Face transformers
- TTS/STT capabilities

### Notable Dependencies
- `@mlc-ai/web-llm` - Browser-based LLM
- `@huggingface/transformers` - ML transformers
- `pdfjs-dist` - PDF processing
- `showdown` - Markdown parsing
- `monaco-editor` - Code editing
- `three.js` - 3D graphics
- `pyodide` - Python runtime in browser

---

## Directory Structure

```
/home/user/RisuAI/
├── src/                          # Frontend source (Svelte + TypeScript)
│   ├── lib/                       # Svelte components (125 total)
│   │   ├── ChatScreens/           # Chat UI components
│   │   ├── SideBars/              # Sidebar UI & navigation
│   │   ├── Setting/               # Settings pages & panels
│   │   ├── UI/                    # Reusable UI components
│   │   │   ├── GUI/               # Custom GUI components
│   │   │   ├── NewGUI/            # New GUI system
│   │   │   └── Realm/             # Character realm/card UI
│   │   ├── Mobile/                # Mobile-specific components
│   │   ├── LiteUI/                # Lightweight UI variant
│   │   ├── Others/                # Miscellaneous components
│   │   ├── Playground/            # Testing/dev components
│   │   └── VisualNovel/           # Visual novel display
│   │
│   ├── ts/                        # TypeScript modules (105+ files)
│   │   ├── storage/               # Data persistence
│   │   │   ├── database.svelte.ts # Main database schema
│   │   │   ├── risuSave.ts        # Save file handling
│   │   │   ├── autoStorage.ts     # Auto-save system
│   │   │   ├── persistant.ts      # Persistent storage
│   │   │   ├── accountStorage.ts  # Account data
│   │   │   └── [mobile, node]     # Platform-specific storage
│   │   │
│   │   ├── process/               # Core processing logic
│   │   │   ├── index.svelte.ts    # Main chat processing (1,972 LOC)
│   │   │   │
│   │   │   ├── request/           # API request handlers
│   │   │   │   ├── request.ts     # Main request router
│   │   │   │   ├── openAI.ts      # OpenAI implementation
│   │   │   │   ├── antrophic.ts   # Claude/Anthropic
│   │   │   │   ├── google.ts      # Google Vertex API
│   │   │   │   └── [others]       # Additional providers
│   │   │   │
│   │   │   ├── templates/         # Prompt templates & formatting
│   │   │   │
│   │   │   ├── memory/            # Memory systems (7 implementations)
│   │   │   │   ├── hypav3.ts      # HypaMemory v3 (latest)
│   │   │   │   ├── hypav2.ts      # HypaMemory v2
│   │   │   │   ├── supaMemory.ts  # SupaMemory implementation
│   │   │   │   └── [others]       # Alternative memory backends
│   │   │   │
│   │   │   ├── models/            # Model-specific logic
│   │   │   ├── embedding/         # Embedding systems
│   │   │   ├── dynamicutils/      # Dynamic utilities (PDF, images)
│   │   │   ├── mcp/               # Model Context Protocol
│   │   │   ├── files/             # File handling
│   │   │   ├── triggers.ts        # Trigger system (2,794 LOC)
│   │   │   ├── scripts.ts         # Script execution
│   │   │   ├── scriptings.ts      # Scripting engine (Lua, JS)
│   │   │   ├── prompt.ts          # Prompt building (486 LOC)
│   │   │   ├── tts.ts             # Text-to-speech
│   │   │   └── stringlize.ts      # Chat formatting
│   │   │
│   │   ├── plugins/               # Plugin system
│   │   │   └── plugins.ts         # Plugin loader & API
│   │   │
│   │   ├── model/                 # Model support
│   │   │   ├── modellist.ts       # Available models registry
│   │   │   ├── openrouter.ts      # OpenRouter integration
│   │   │   └── ooba.ts            # Ooba integration
│   │   │
│   │   ├── gui/                   # UI utilities
│   │   ├── creation/              # Character creation
│   │   ├── drive/                 # Cloud sync/storage
│   │   ├── kei/                   # Backup system
│   │   ├── translator/            # Translation features
│   │   ├── 3d/                    # 3D character rendering
│   │   ├── horde/                 # Horde AI integration
│   │   ├── sync/                  # Multi-user sync
│   │   ├── rpack/                 # Resource packing
│   │   │
│   │   ├── globalApi.svelte.ts    # Global API layer (2,439 LOC)
│   │   ├── stores.svelte.ts       # Svelte reactive stores
│   │   ├── parser.svelte.ts       # Chat parsing (1,935 LOC)
│   │   ├── characters.ts          # Character management
│   │   ├── characterCards.ts      # Character card handling (1,949 LOC)
│   │   ├── cbs.ts                 # Complex behavior system (2,370 LOC)
│   │   └── util.ts                # Utilities (1,210 LOC)
│   │
│   ├── App.svelte                 # Root component
│   ├── main.ts                    # Entry point
│   ├── preload.ts                 # Pre-initialization
│   ├── LiteMain.svelte            # Lite version entry
│   ├── lang/                      # Internationalization
│   ├── etc/                       # Documentation & examples
│   └── test/                      # Testing utilities
│
├── src-tauri/                     # Tauri desktop backend
│   ├── src/
│   │   └── main.rs                # Rust entry point (19,557 LOC)
│   ├── src-python/                # Python utilities
│   ├── Cargo.toml                 # Rust dependencies
│   ├── tauri.conf.json            # Tauri configuration
│   └── icons/                     # App icons
│
├── android/                       # Android Gradle project
│   ├── app/                       # Android app source
│   └── gradle/                    # Build configuration
│
├── public/                        # Static assets
│   ├── token/                     # Tokenizer models
│   ├── lua/                       # Lua runtime
│   ├── welcome/                   # Welcome screens
│   ├── sample/                    # Sample characters/data
│   ├── sw.js                      # Service worker
│   └── [logos, icons, assets]
│
├── server/                        # Web server
│   └── node/                      # Node.js implementation
│
├── functions/                     # Cloud functions
│
├── vite.config.ts                 # Vite build configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind configuration
├── package.json                   # NPM dependencies
├── index.html                     # HTML entry point
├── manifest.json                  # PWA manifest
├── capacitor.config.ts            # Capacitor configuration
│
├── README.md                      # Main documentation
├── AGENTS.md                      # Development guide
├── ARCHITECTURE.md                # This file
└── plugins.md                     # Plugin API documentation
```

---

## Key Components

### Critical Files (by LOC and importance)

| File | Purpose | Lines of Code |
|------|---------|---------------|
| `src-tauri/src/main.rs` | Tauri desktop backend | 19,557 |
| `src/ts/process/triggers.ts` | Trigger/regex system | 2,794 |
| `src/ts/globalApi.svelte.ts` | Global API & file operations | 2,439 |
| `src/ts/cbs.ts` | Complex behavior system | 2,370 |
| `src/ts/process/index.svelte.ts` | Main chat processing pipeline | 1,972 |
| `src/ts/characterCards.ts` | Character card handling | 1,949 |
| `src/ts/parser.svelte.ts` | Chat message parsing | 1,935 |
| `src/ts/util.ts` | Utility functions | 1,210 |
| `src/ts/characters.ts` | Character management | 883 |
| `src/ts/loggen.ts` | Log generation | 753 |

### Entry Points

- **Web**: `src/main.ts` → `App.svelte`
- **Desktop**: Same as web, wrapped in Tauri window
- **Lite Mode**: `src/LiteMain.svelte`
- **Mobile**: Capacitor wrapper around web build

---

## Architecture Patterns

### 1. Reactive State Management (Svelte 5 Runes)

**Primary Stores** (`src/ts/stores.svelte.ts`):
```typescript
- selectedCharID      // Current active character
- DBState            // Reactive database state
- loadedStore        // App initialization status
- alertStore         // Notification system
- CustomCSSStore     // Theme customization
```

### 2. Modular Processing Pipeline

```
┌──────────────┐
│  User Input  │
└──────┬───────┘
       ↓
┌──────────────┐
│    Parser    │ (src/ts/parser.svelte.ts)
└──────┬───────┘
       ↓
┌──────────────┐
│   Triggers   │ (src/ts/process/triggers.ts)
└──────┬───────┘
       ↓
┌──────────────┐
│    Memory    │ (src/ts/process/memory/)
│  Processing  │
└──────┬───────┘
       ↓
┌──────────────┐
│   Prompt     │ (src/ts/process/prompt.ts)
│  Building    │
└──────┬───────┘
       ↓
┌──────────────┐
│    Model     │ (src/ts/process/request/)
│  Selection   │
└──────┬───────┘
       ↓
┌──────────────┐
│ API Request  │ (Provider-specific)
└──────┬───────┘
       ↓
┌──────────────┐
│   Response   │
│  Processing  │
└──────┬───────┘
       ↓
┌──────────────┐
│  TTS/Output  │
└──────┬───────┘
       ↓
┌──────────────┐
│   Storage    │ (src/ts/storage/)
└──────────────┘
```

### 3. Plugin Architecture

**Plugin System** (`src/ts/plugins/plugins.ts`):
- V2 plugin system with direct API access
- No sandbox restrictions
- Plugins can:
  - Add custom AI providers
  - Intercept requests/responses
  - Add custom script handlers
  - Extend UI components
  - Register new commands

### 4. Storage Abstraction

**AutoStorage** (`src/ts/storage/autoStorage.ts`):
- Platform-agnostic storage layer
- Supports:
  - Node.js filesystem
  - Tauri native file system
  - Capacitor (mobile)
  - Browser IndexedDB
- Features:
  - Encrypted data support
  - Automatic backup system
  - Save file versioning

### 5. Multi-Platform Detection

```typescript
// Platform detection (src/ts/storage/autoStorage.ts)
isTauri = !!window.__TAURI_INTERNALS__
isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)
isNodeServer = !!globalThis.__NODE__
```

---

## Data Flow

### Chat Message Flow

1. **Input Reception** → User types message in chat UI
2. **Pre-processing** → Parser extracts user intent, variables
3. **Trigger System** → Regex patterns modify/enhance message
4. **Context Building** → Gather character data, lorebook, chat history
5. **Memory Processing** → Apply memory compression (HypaV3/SupaMemory)
6. **Prompt Assembly** → Build final prompt with templates
7. **Model Selection** → Choose appropriate AI provider/model
8. **API Request** → Send to provider with streaming support
9. **Response Handling** → Process, parse, apply post-processing triggers
10. **Output** → Display in chat, optionally trigger TTS
11. **Persistence** → Save to database with metadata

### Database Schema

**Primary Collections** (`src/ts/storage/database.svelte.ts`):
```typescript
interface Database {
  characters: Character[]      // Character definitions
  chats: Chat[]               // Conversation histories
  personas: Persona[]         // User personas
  presets: Preset[]           // Model configuration presets
  lorebook: Lorebook[]        // World information
  globalLorebook: Entry[]     // Global lore entries
  plugins: Plugin[]           // Installed plugins
  settings: Settings          // Application settings
}
```

---

## Core Systems

### 1. Memory Systems (`src/ts/process/memory/`)

**Available Implementations:**
- **HypaMemory V3** (`hypav3.ts`) - Latest, most advanced
- **HypaMemory V2** (`hypav2.ts`) - Previous generation
- **SupaMemory** (`supaMemory.ts`) - Alternative compression
- **Hanurei** - Token-based compression
- **Classical** - Simple truncation
- **Subgenre** - Genre-specific optimization
- **Selective** - Manual selection

**Purpose**: Compress long chat histories to fit within model context limits while preserving important information.

### 2. Trigger System (`src/ts/process/triggers.ts`)

**Features**:
- Regex-based message modification
- Pre/post-processing hooks
- Variable substitution (`{{var}}`)
- Conditional execution
- Script integration (JavaScript/Lua)
- 2,794 lines of sophisticated pattern matching

### 3. Prompt Building (`src/ts/process/prompt.ts`)

**Capabilities**:
- Dynamic template assembly
- Conditional blocks
- Character-specific formatting
- Multi-turn conversation history
- System message injection
- Model-specific adaptations

### 4. Request Handling (`src/ts/process/request/`)

**Supported Providers**:
- OpenAI (`openAI.ts`)
- Anthropic/Claude (`antrophic.ts`)
- Google Vertex (`google.ts`)
- OpenRouter (multi-model gateway)
- Local models (Ollama, Ooba)
- WebLLM (browser-based)
- Horde AI (distributed)

**Features**:
- Streaming responses
- Retry logic
- Error handling
- Token counting
- Rate limiting
- Cost tracking

### 5. Scripting Engine (`src/ts/process/scriptings.ts`)

**Supported Languages**:
- JavaScript (native)
- Lua (via fengari)
- Python (via Pyodide)

**Use Cases**:
- Custom message processing
- Dynamic content generation
- Advanced trigger logic
- Plugin development

### 6. Model Context Protocol (`src/ts/process/mcp/`)

**Features**:
- Tool calling support
- Function execution
- Structured outputs
- Multi-step reasoning

---

## Configuration Files

### `tauri.conf.json`
- Desktop app window configuration
- Plugin permissions (fs, http, shell, dialog)
- Security settings (CSP)
- Build targets

### `vite.config.ts`
- Build settings
- WASM support for ML models
- Path aliases (@src, @lib)
- Rollup optimization

### `tsconfig.json`
- TypeScript strict mode: disabled
- Target: ES2023
- Module resolution: bundler
- Svelte plugin integration

### `tailwind.config.js`
- Theme colors:
  - Primary: Customizable
  - Secondary: Accent colors
  - Danger: Error states
- Responsive breakpoints
- Custom utilities

### `capacitor.config.ts`
- Mobile app configuration
- Android/iOS settings
- Native plugin registration

### `package.json`
- 97 total dependencies
- Scripts for dev, build, tauri
- Svelte-check for type checking

---

## Build & Development

### Development Commands

```bash
# Web development
pnpm dev                    # Start Vite dev server (http://localhost:5173)

# Desktop development
pnpm tauri dev              # Launch Tauri app with hot reload

# Mobile development
pnpm cap sync               # Sync web assets to mobile
pnpm cap open android       # Open Android Studio
pnpm cap open ios           # Open Xcode

# Production builds
pnpm build                  # Web build → dist/
pnpm tauri build            # Desktop build → src-tauri/target/release/
pnpm cap build android      # Android APK

# Testing & validation
pnpm check                  # TypeScript + Svelte type checking
pnpm lint                   # Code linting

# Server
pnpm runserver              # Node.js server for web hosting
```

### Build Tools

- **Vite 5.4.9**: Fast HMR, plugin system
- **SWC**: Fast TypeScript transpilation
- **Rollup**: Bundling and tree-shaking
- **WASM Support**: For ML models (transformers.js, web-llm)
- **Tauri CLI**: Desktop packaging
- **Capacitor CLI**: Mobile packaging

### Build Targets

- **Web**: Standard SPA, can be hosted statically
- **Desktop**: Native executables (Windows .exe, macOS .app, Linux .AppImage)
- **Mobile**: Android APK/AAB, iOS IPA
- **PWA**: Progressive Web App with service worker

---

## Cross-Platform Support

### Platform Matrix

| Platform | Technology | Status |
|----------|-----------|--------|
| Windows | Tauri | ✅ Full support |
| macOS | Tauri | ✅ Full support |
| Linux | Tauri | ✅ Full support |
| Web | SPA + PWA | ✅ Full support |
| Android | Capacitor | ✅ Full support |
| iOS | Capacitor | ⚠️ Configured, needs testing |

### Platform-Specific Features

**Desktop (Tauri)**:
- Native file system access
- System dialogs
- OAuth2 authentication
- Native HTTP client
- Shell command execution

**Mobile (Capacitor)**:
- Touch-optimized UI
- Mobile-specific storage
- Camera access
- Filesystem plugin
- Share functionality

**Web**:
- IndexedDB storage
- Service Worker (PWA)
- Web Workers
- WASM execution

---

## Code Metrics

### File Count
- **Total TypeScript/Svelte files**: 248+
- **Svelte Components**: 125
- **TypeScript Modules**: 105+
- **Configuration Files**: 7 major configs

### Lines of Code (Key Files)
- **Rust Backend**: 19,557 LOC (`main.rs`)
- **TypeScript Core**: ~18,500+ LOC (major files combined)
- **Total Project**: 100,000+ LOC estimated

### Dependencies
- **Production**: 97 npm packages
- **Critical Frontend**: Svelte, Vite, Tailwind
- **Critical Backend**: Tauri, Rust crates
- **AI/ML**: 8+ specialized libraries

---

## Development Guidelines

### Code Organization
- Components in `src/lib/` organized by feature
- Business logic in `src/ts/` organized by domain
- Shared utilities in `src/ts/util.ts`
- Types defined inline or in module files

### State Management
- Use Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Central stores in `src/ts/stores.svelte.ts`
- Database access via reactive `DBState`

### Adding New Features

1. **UI Component**: Add to `src/lib/` in appropriate subfolder
2. **Business Logic**: Add to `src/ts/` in domain folder
3. **API Integration**: Add to `src/ts/process/request/`
4. **Storage**: Update schema in `src/ts/storage/database.svelte.ts`
5. **Settings**: Add to settings UI in `src/lib/Setting/`

### Plugin Development

See `plugins.md` for full API documentation.

**Basic Structure**:
```typescript
export default {
  id: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  init: (risuAPI) => {
    // Plugin initialization
  }
}
```

---

## Resources

### Documentation Files
- `README.md` - Features, installation, screenshots
- `AGENTS.md` - Development conventions, build instructions
- `ARCHITECTURE.md` - This file (structural overview)
- `plugins.md` - Plugin V2 API reference

### Internal Documentation
- `/src/etc/docs/` - Additional technical docs
- `/public/welcome/` - User onboarding screens
- Code comments - JSDoc in TypeScript files

### External Links
- GitHub Repository: https://github.com/kwaroran/RisuAI
- Issue Tracker: GitHub Issues
- Community: Check README for links

---

## Summary

RisuAI is a sophisticated, feature-rich AI chatting platform demonstrating:

- ✅ **Modern Architecture**: Svelte 5, TypeScript, reactive patterns
- ✅ **Cross-Platform**: Desktop (Tauri), Web (SPA/PWA), Mobile (Capacitor)
- ✅ **Extensibility**: Plugin system, scripting support, MCP integration
- ✅ **Advanced AI**: Multi-provider support, memory systems, streaming
- ✅ **Performance**: Efficient bundling, WASM acceleration, lazy loading
- ✅ **User Experience**: Rich UI, themes, customization, i18n

The codebase is well-organized with clear module boundaries, making it suitable for both users and developers seeking to extend or contribute to the project.

---

**For questions or contributions, see AGENTS.md and the GitHub repository.**

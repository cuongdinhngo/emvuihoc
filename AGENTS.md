# Vui học - Educational Board Game

## 🎯 Project Overview
"Vui học" software for elementary students, focusing on learning basic knowledge through play:
- **Lịch sử** (History)
- **Địa lý** (Geography) 
- **Khoa học** (Science)
- **Đạo Đức** (Ethics)
- **Sức khỏe** (Health)

## 🎮 Game Mechanics
- **Board Game/Puzzle Game**: Players answer questions to receive puzzle pieces
- **Reward System**: Correct answer = 1 puzzle piece
- **Puzzle Assembly**: Collect enough pieces → arrange correctly → complete the game
- **3 Difficulty Levels**: Easy, Medium, Hard

## 🛠 Tech Stack
- **Framework**: Nuxt 4.1.3 (Vue 3)
- **Styling**: Tailwind CSS (mobile-first design)
- **Internationalization**: @nuxtjs/i18n (Vietnamese default)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions with Node.js 20

## 🚀 Features Implemented
- ✅ **Responsive Design**: Mobile-first UI with Tailwind CSS
- ✅ **Multi-language Support**: Vietnamese (default) + English
- ✅ **Level Selection**: 3 difficulty levels with visual feedback
- ✅ **Dynamic Puzzle System**: Auto-generates puzzle list from `public/puzzles/`
- ✅ **Game Progress**: Local storage for tracking completion
- ✅ **Mobile Optimization**: Touch-friendly interface

## 📁 Project Structure
```
├── pages/
│   ├── index.vue          # Game hub with level selection
│   ├── game/[subject].vue # Question gameplay
│   ├── sector/[sector].vue # Subject selection
│   └── puzzle.vue         # Jigsaw puzzle assembly
├── public/puzzles/        # Puzzle images (auto-discovered)
├── scripts/
│   └── generate-puzzle-list.js # Build-time puzzle discovery
└── .github/workflows/
    └── deploy.yml         # GitHub Actions deployment
```

## 🌐 Live Site
**URL**: https://cuongdinhngo.github.io/emvuihoc/

## 🔧 Development
- **Local Dev**: `npm run dev`
- **Build**: `npm run generate`
- **Puzzle List**: `npm run generate-puzzle-list`
- **Deploy**: Automatic via GitHub Actions
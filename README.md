# 🧺 Laundry Tracker

A beautiful, mobile-first web application for college students to track their laundry items, manage weight quotas, submit laundry history, and monitor package expiration.

## ✨ Features

### � Image Upload
- Take photos of clothing items with your phone camera
- Upload images from gallery
- Visual identification of items
- Optional - works with or without photos

### ✅ Checklist Interface
- Simple checkbox to toggle item status
- Checked = In Laundry
- Unchecked = In Cupboard
- Quick and intuitive status management

### 📋 Laundry History
- Record when you submit laundry (date + weight)
- Automatic weight deduction from package
- View submission history
- Track items count per submission
- Delete records to restore weight

### 📊 Smart Tracking
- Track individual clothing items
- Real-time weight calculations
- Expiration countdown timer
- Statistics dashboard

### 📱 Mobile-First Design
- Optimized for smartphones
- Camera access for photo uploads
- PWA - installable on home screen
- iOS and Android support
- Touch-friendly interface

### 💾 Data Management
- Automatic local storage persistence
- Export backup as JSON
- Import from backup file
- No internet required after initial load

### 🎨 Modern UI/UX
- Glassmorphism effects
- Vibrant gradient colors
- Dark mode support
- Smooth animations

## 🚀 Quick Start

1. Open `index.html` in a web browser (or run a local server)
2. Configure settings (⚙️ icon)
3. Add clothing items with photos
4. Submit laundry and track history!

## 📱 Mobile Installation

### iOS (Safari)
1. Tap Share button → "Add to Home Screen"
2. App runs in standalone mode

### Android (Chrome)
1. Tap menu (⋮) → "Add to Home screen"
2. Or wait for install banner

**Note**: For camera access, serve via HTTPS or localhost (`python -m http.server`)

## 💻 Technical Stack

- **Pure Vanilla JavaScript** - No frameworks
- **CSS3 with Variables** - Modern styling
- **LocalStorage API** - Persistent data
- **PWA Manifest** - Installable app
- **Base64 Image Storage** - Photos in localStorage

## 🔒 Privacy

All data stored locally on your device. No server, no tracking, completely private.

## 🎯 Usage Tips

1. Take clear photos of items for easy identification
2. Submit laundry regularly to maintain accurate history
3. Check remaining weight before each submission
4. Export data regularly for backup

---

Made with ❤️ for efficient laundry management!

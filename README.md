# 🧺 Laundry Tracker

A beautiful, mobile-first web application for college students to track their laundry items, manage weight quotas, and monitor package expiration.

## Features

### 📊 Smart Tracking
- Track individual clothing items with names and weights
- Toggle status between "In Laundry" and "In Cupboard"
- Real-time weight calculations and package usage
- Expiration countdown timer

### 📱 Mobile-First Design
- Optimized for smartphone screens
- Smooth animations and transitions
- Touch-friendly interface (44px minimum touch targets)
- Progressive Web App (PWA) - installable on home screen

### 💾 Data Management
- Automatic local storage persistence
- Export backup as JSON
- Import from backup file
- No internet required after initial load

### 🎨 Modern UI/UX
- Glassmorphism effects
- Vibrant gradient colors
- Dark mode support (system preference)
- Responsive design for all screen sizes

## Quick Start

1. Open `index.html` in a web browser
2. Configure your settings (⚙️ icon):
   - Package weight (default: 90kg)
   - Current remaining weight (default: 45kg)
   - Expiration date (default: May 1, 2026)
   - Load weight range (2-10kg)
3. Start adding your clothing items!

## How to Use

### Adding Items
1. Enter the item name (e.g., "Jeans", "T-shirt")
2. Enter the weight in kilograms
3. Select initial status (In Cupboard or In Laundry)
4. Click "Add Item"

### Managing Items
- **Toggle Status**: Click the status button to move items between laundry and cupboard
- **Edit Item**: Click the ✏️ icon to modify name or weight
- **Delete Item**: Click the 🗑️ icon to remove an item
- **Filter View**: Use the filter buttons to show All, Laundry, or Cupboard items

### Settings
Access settings (⚙️) to:
- Adjust package weight limits
- Update remaining weight
- Change expiration date
- Set min/max load weights
- Export/Import your data

## Mobile Installation

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home screen"
4. Tap "Add"

## Stats Dashboard

The app displays four key metrics:
- **In Laundry**: Number of items currently being washed
- **In Cupboard**: Number of items in storage
- **kg Used**: Total weight used from your package
- **Loads Left**: Estimated remaining laundry loads based on your weight range

## Technical Details

- **Pure Vanilla JavaScript** - No frameworks required
- **CSS3 with CSS Variables** - Easy theming and customization
- **LocalStorage API** - Persistent data without a backend
- **PWA Manifest** - Installable as native-like app
- **Responsive Design** - Mobile-first approach with breakpoints

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (iOS 13+)
- Any modern mobile browser

## Data Privacy

All data is stored locally on your device using browser LocalStorage. No data is sent to any server. Your laundry tracking information stays completely private.

## Tips

1. **Regular Updates**: Update your remaining weight in settings after each laundry load
2. **Backup Often**: Export your data regularly to prevent loss
3. **Weight Accuracy**: Be as accurate as possible with item weights for better tracking
4. **Expiration Alerts**: The app shows warnings when your package is about to expire

## Future Enhancements (Potential)

- Laundry history tracking
- Charts and analytics
- Multiple package support
- Cost tracking per load
- Reminder notifications

---

Made with ❤️ for college students managing their laundry efficiently!

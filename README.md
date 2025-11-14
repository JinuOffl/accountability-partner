# Bad Habit Accountability Tracker - Production Ready

A professional habit tracking web app focused on breaking bad habits, with friend accountability and payment integration.

## 🎯 Key Features

✅ **Google Sign-In** - Secure authentication via Google  
✅ **Bad Habit Tracking** - Focus on breaking bad habits  
✅ **Last 7 Days** - Clean checkbox view showing past week  
✅ **Activity Heatmap** - GitHub-style contribution visualization (Bad habits: Red, Good habits: Green)  
✅ **Flexible Payments** - Pay any amount with UPI QR code generation  
✅ **Clean UI** - Minimalist, professional design  
✅ **Firebase Backend** - Firestore database + Authentication  
✅ **Production Ready** - Zero habits & zero penalties by default

## 🚀 Deployment Checklist

Before deploying, ensure:

- [ ] Firebase project created and credentials configured
- [ ] Google OAuth configured in Firebase Console
- [ ] `firebaseConfig.js` updated with your Firebase config
- [ ] Environment variables set up (if using .env)
- [ ] Tests passed
- [ ] Build successful: `npm run build`

## 📋 Setup Instructions

### Prerequisites

- Node.js v14+
- npm or yarn
- Firebase account
- Google Cloud Console setup

### Installation

1. **Clone/Extract and navigate:**
```bash
cd habit-accountability-prod
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Firebase:**
   - Go to `src/firebaseConfig.js`
   - Replace placeholder values with your Firebase project credentials
   - Get credentials from Firebase Console → Project Settings

4. **Set up Google Sign-In:**
   - Firebase Console → Authentication → Sign-in method
   - Enable Google sign-in
   - Add authorized redirect URI: `http://localhost:3000` (dev) and your production domain

5. **Start development server:**
```bash
npm start
```

App opens at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── App.js                    # Main app logic
├── App.css                   # App styles
├── firebaseConfig.js         # Firebase configuration
├── index.js                  # Entry point
├── index.css                 # Global styles
├── components/
│   ├── HabitTable.js        # Habit list with checkboxes
│   ├── Heatmap.js           # Activity heatmap (Bad & Good)
│   ├── AddHabitModal.js     # Add new habit form
│   ├── SettingsModal.js     # Settings (edit/delete habits, UPI)
│   ├── PaymentModal.js      # Payment with flexible amount & QR
│   └── LoginComponent.js    # Google Sign-In
└── utils/
    └── storageManager.js    # Firestore database functions

public/
└── index.html               # HTML template
```

## 💻 Development

### Available Scripts

```bash
npm start          # Runs dev server at localhost:3000
npm run build      # Creates optimized production build
npm test           # Runs tests
npm run eject      # Ejects Create React App config (irreversible)
```

### Making Changes

1. Edit React components in `src/components/`
2. Modify styles in CSS files or `src/App.css`
3. Changes hot-reload automatically

## 🔐 Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project
3. Enable these services:
   - **Authentication** (Google sign-in)
   - **Cloud Firestore** (database)

### Configure Firestore Database

Create these collections:

```
/users/{userId}
  - email: string
  - upiId: string
  - totalPenalty: number
  - createdAt: timestamp

/habits/{habitId}
  - userId: string
  - name: string
  - type: string (bad/good)
  - penaltyAmount: number
  - gracePeriod: number
  - createdAt: timestamp

/tracking/{trackingId}
  - userId: string
  - habitId: string
  - date: string (YYYY-MM-DD)
  - completed: boolean
  - createdAt: timestamp
```

### Security Rules

Add to Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /habits/{habitId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid == request.resource.data.userId;
    }
    match /tracking/{trackingId} {
      allow read, write: if request.auth.uid == resource.data.userId || request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `/build` folder.

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag & drop /build folder to Netlify
```

## 🎨 UI Design

- **Clean minimalist** interface
- **Light mode only** - white background, black text
- **Color coding**: Red for bad habits, Green for good habits
- **Checkboxes** for daily tracking
- **GitHub-style heatmap** for activity visualization

## 💳 Payment System

- **UPI-based** payment integration
- **Dynamic QR code** generation (no API key needed)
- **Flexible amounts** - pay full or partial penalties
- **Friend's UPI ID** required for payment generation

## 🔧 Configuration

### Firebase Config (firebaseConfig.js)

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

Get these from Firebase Console → Project Settings.

## 🚨 Important Notes

1. **Authentication:** Google Sign-In required - users must have Google account
2. **Payment:** UPI payment is direct peer-to-peer using QR code
3. **Data:** All data stored in Firebase Firestore
4. **Privacy:** Only user can access their own data (enforced by Firebase Rules)
5. **Bad Habits Focus:** Primary goal is tracking bad habits to break

## 📱 Responsive Design

- Desktop: Full features
- Tablet: Optimized layout
- Mobile: Vertical stack with scrollable heatmap

## 🐛 Troubleshooting

**"Firebase is not configured"**
- Check `firebaseConfig.js` has valid credentials
- Verify Firebase project exists and services enabled

**"Google Sign-In not working"**
- Ensure OAuth is enabled in Firebase Console
- Check redirect URI matches deployment URL
- Clear browser cookies/cache

**"Heatmap not showing data"**
- Ensure Firestore collection `/tracking` exists
- Check Firestore security rules allow read access
- Verify tracking data is being saved

**"QR Code not generating"**
- Check UPI ID format is correct
- Verify payment amount is positive integer
- Try generating again

## 📚 Documentation

- [Firebase Docs](https://firebase.google.com/docs)
- [React Docs](https://react.dev)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [UPI Specs](https://www.npci.org.in/)

## 📝 License

MIT

## 👤 Support

For issues or questions, check Firebase Console logs or browser console for errors.

---

**Production Ready ✅**  
**Zero Habits by Default**  
**Zero Penalties by Default**

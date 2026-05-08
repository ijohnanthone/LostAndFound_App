# FoxFind - Lost & Found Community App 🦊

A full-stack Lost & Found application built with **React Native** (Expo), **TypeScript**, and **Firebase Firestore**. Connect with your community to report, search, and recover lost items in real-time.

## 📋 Features

- 🔐 **Secure Authentication** - Email/password authentication with Firebase
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 🔍 **Real-Time Search** - Find lost or found items instantly
- 📸 **Image Support** - Upload photos of lost/found items
- 🗺️ **Location Tracking** - Report items with location details
- 💬 **Community Integration** - Connect with other users to find items
- 🌓 **Dark Mode Support** - Automatic theme based on system settings
- ⚡ **Offline Support** - AsyncStorage for offline access to recent data

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ijohnanthone/LostAndFound_App.git
   cd LostAndFound_App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (if needed)
   - Update `firebaseConfig.js` with your Firebase credentials
   - Firebase rules are configured in `firestore.rules` and `storage.rules`

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open in your preferred environment**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web Browser
   - Scan QR code with Expo Go app on physical device

## 📁 Project Structure

```
LostAndFound_App/
├── app/                          # Expo Router pages & layouts
│   ├── (auth)/                   # Authentication routes (login, signup)
│   ├── (app)/                    # Main app routes (protected)
│   │   └── (mainTabs)/          # Tab-based navigation
│   ├── _layout.tsx               # Root layout with providers
│   ├── index.tsx                 # Splash screen
│   └── modal.tsx                 # Modal component
├── components/                   # Reusable UI components
│   ├── app/                      # App-specific components
│   ├── ui/                       # Generic UI components
│   ├── themed-text.tsx          # Theme-aware text
│   ├── themed-view.tsx          # Theme-aware view
│   └── ...                       # Other shared components
├── contexts/                     # React Context providers
│   └── auth-context.tsx         # Authentication state management
├── hooks/                        # Custom React hooks
│   └── use-color-scheme.ts      # Theme hook
├── constants/                    # App constants & configuration
├── assets/                       # Images, fonts, icons
├── firebaseConfig.js             # Firebase initialization
├── firestore.rules               # Firestore security rules
├── storage.rules                 # Cloud Storage security rules
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
├── app.json                      # Expo app configuration
└── eslint.config.js              # ESLint rules
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run web version |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset to blank project state |

## 🔐 Security

- Firebase authentication with secure token handling
- Firestore security rules for data access control
- Cloud Storage rules for safe file uploads
- Environment variables for sensitive data (not in `.gitignore` - add `.env.local`)

### Setup Environment Variables
Create a `.env.local` file:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... other Firebase config
```

## 🏗️ Tech Stack

- **Frontend**: React Native, Expo, TypeScript
- **Navigation**: Expo Router, React Navigation
- **Backend/Database**: Firebase (Firestore, Authentication, Storage)
- **State Management**: React Context API
- **Styling**: React Native StyleSheet
- **Code Quality**: ESLint, TypeScript strict mode

## 📦 Dependencies

### Core
- `react` 19.1.0 - UI library
- `react-native` 0.81.5 - Native framework
- `expo` ~54.0.33 - Managed React Native

### Navigation
- `expo-router` ~6.0.23 - File-based routing
- `@react-navigation/*` - Navigation primitives

### Firebase
- `firebase` ^12.12.1 - Backend services

### UI & Animation
- `react-native-reanimated` ~4.1.1 - Smooth animations
- `react-native-gesture-handler` ~2.28.0 - Touch handling
- `@expo/vector-icons` ^15.0.3 - Icon library

### Storage & Persistence
- `@react-native-async-storage/async-storage` ^3.0.2 - Local storage
- `expo-image-picker` ^55.0.20 - Image selection
- `expo-image` ~3.0.11 - Image component

## 🎨 Customization

### Colors & Theme
Edit theme colors in components using StyleSheet. App supports dark/light modes automatically.

### Firebase Rules
Modify `firestore.rules` and `storage.rules` to customize data access policies.

### App Configuration
Update `app.json` for:
- App name, icon, splash screen
- iOS/Android specific settings
- Plugins and experiments

## 📱 Building for Production

### iOS
```bash
eas build --platform ios --auto-submit
```

### Android
```bash
eas build --platform android --auto-submit
```

Requires [EAS CLI](https://docs.expo.dev/build/setup/) setup.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## 📝 License

This project is open source. Check LICENSE file for details.

## 🐛 Troubleshooting

**Issue**: Firebase connection fails
- **Solution**: Verify `firebaseConfig.js` credentials and internet connection

**Issue**: Emulator doesn't open
- **Solution**: Ensure Android Studio/Xcode is installed and emulator is running

**Issue**: TypeScript errors
- **Solution**: Run `npm install` and check `tsconfig.json` configuration

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)

## ✨ Future Enhancements

- [ ] Push notifications for item matches
- [ ] Advanced filtering and sorting
- [ ] User profiles and reputation system
- [ ] Chat messaging between users
- [ ] Map view for item locations
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Payment integration for rewards

---

**Created by**: [ijohnanthone](https://github.com/ijohnanthone)  
**Last Updated**: May 2026

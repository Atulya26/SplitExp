# Split Expense App

A modern React-based expense splitting application built with TypeScript, Tailwind CSS, and Firebase. Split bills fairly among friends and track group expenses with ease.

## Features

- 🏠 **Group Management**: Create and manage expense groups
- 👥 **Member Management**: Add and remove group members
- 💰 **Expense Tracking**: Add expenses with categories and split options
- 📊 **Balance Calculation**: Automatic balance calculation for all members
- 💸 **Settlement Suggestions**: Smart suggestions for settling debts
- 🔥 **Real-time Sync**: Firebase-powered real-time data synchronization
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Beautiful, intuitive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase (Firestore, Authentication)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SplitExp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Anonymous Authentication
   - Copy your Firebase config and update `src/firebase/config.ts`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Firebase Configuration

The app uses the following Firebase services:

- **Firestore**: For storing groups, expenses, and members
- **Authentication**: Anonymous authentication for user sessions

### Firestore Collections

- `groups`: Group information and metadata
- `expenses`: Individual expense records
- `members`: Group member information

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the Vite configuration
   - Set environment variables if needed
   - Deploy!

### Environment Variables

Create a `.env` file for local development:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Project Structure

```
SplitExp/
├── src/
│   ├── firebase/
│   │   ├── config.ts      # Firebase configuration
│   │   ├── auth.ts        # Authentication services
│   │   └── firestore.ts   # Firestore operations
│   └── main.tsx           # App entry point
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── AddExpense.tsx     # Expense addition form
│   ├── Balances.tsx       # Balance display
│   ├── ExpenseDirectory.tsx # Expense list
│   ├── Settlements.tsx    # Settlement suggestions
│   └── Sidebar.tsx        # Navigation sidebar
├── styles/
│   └── globals.css        # Global styles
├── App.tsx                # Main app component
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@example.com or create an issue in the repository. 
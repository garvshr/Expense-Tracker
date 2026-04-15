# 🧭 Expense-Tracker

**Cash Compass** is a premium, full-stack personal finance and expense tracking application. It empowers users to monitor their spending, visualize financial trends through beautiful analytics, and manage their budget with ease—all wrapped in a sleek, high-density "Quiet Authority" design.

## ✨ Features

- **📊 Intelligent Dashboard**: Real-time overview of your financial status, including total balance, income, and expenses.
- **📈 Advanced Analytics**: Interactive charts (Bar, Area, Pie) powered by `Recharts` to visualize spending patterns over time and by category.
- **🧾 Comprehensive Expense Management**: Create, edit, and delete transactions with detailed categorization.
- **💱 Multi-Currency Support**: Choose your preferred currency (INR, USD, EUR, etc.) with persistent global state.
- **🌓 Dynamic Themes**: Seamless toggle between deep dark mode and clean light mode.
- **🔐 Secure Authentication**: JWT-based session management with secure cookie storage and encrypted password hashing.
- **🚀 Ultra-Responsive UI**: Built with Tailwind CSS 4 and Framer Motion for buttery-smooth animations and a professional feel.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: React Context & Redux Toolkit
- **Icons**: Lucide React

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Security**: JWT, BcryptJS, Express Validator
- **Logging**: Morgan

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or a cloud URI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/garvshr/Expense-Tracker
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=8800
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_super_secret_key
   ```
   Start the backend:
   ```bash
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```text
.
├── backend/                # Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   └── middleware/     # Auth & Error handling
│   └── server.js           # Entry point
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI elements
│   │   ├── pages/          # Layout-level components
│   │   ├── context/        # Auth & Currency state
│   │   └── assets/         # Styles and images
│   └── vite.config.js
└── README.md
```

Built with ❤️

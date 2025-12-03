# 💬 Chatty - Real-time Chat Application

A modern, full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring real-time messaging, online status indicators, and image sharing capabilities.

![Chat Application](https://img.shields.io/badge/MERN-Stack-green)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## ✨ Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - HTTP-only cookies for token storage

- 💬 **Real-time Messaging**
  - Instant message delivery with Socket.io
  - Online/offline status indicators
  - Message delete functionality
  - Text and image messages

- 🤖 **AI-Powered Features** (Google Gemini 2.0 Flash)
  - **Chatty AI Assistant** - WhatsApp-style floating AI chatbot for conversations
  - **Smart Message Rewrite** - AI improves grammar, clarity, and professionalism
  - **Smart Reply Suggestions** - Instant contextual quick replies when receiving messages
  - **Smart Translations** - Translate messages to English with one click
  - **Smart Message Completion** - AI predicts and completes your sentences (Tab to accept)
  - **Conversation Summarizer** - Get key points from long chat histories

- 🎨 **Modern UI/UX**
  - Beautiful purple/pink gradient design
  - Glass-morphism effects
  - Smooth animations and transitions
  - Responsive design for all devices
  - Dark mode support

- 📸 **Media Sharing**
  - Profile picture uploads
  - Image sharing in chats
  - Cloudinary integration for media storage

- 🔔 **Real-time Features**
  - Live online status updates
  - Real-time message notifications
  - Active user indicators

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **DaisyUI** - UI components
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing
- **Google Generative AI** - AI features powered by Gemini 2.0 Flash

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB)
- **Cloudinary account** (optional, for image uploads)
- **Google Gemini API key** (for AI features)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ankit-84/chatting-app.git
cd "Chat Application"
```

### 2. Backend Setup

```bash
cd chatting-app-backend
npm install
```

Create a `.env` file in the `chatting-app-backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (Generate a random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup

```bash
cd ../chatting-app
npm install
```

The frontend connects to `http://localhost:5001/api` by default.

### 4. Run the Application

**Start Backend Server:**
```bash
cd chatting-app-backend
npm run dev
```

**Start Frontend Server:**
```bash
cd chatting-app
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5001

## 🔧 Configuration

### MongoDB Connection

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env` with your connection string

### Cloudinary Setup (Optional)

1. Create a Cloudinary account at https://cloudinary.com
2. Get your credentials from the dashboard
3. Add them to the `.env` file

**Note:** If you don't configure Cloudinary, profile picture uploads and image messages will be disabled, but the app will still work with text messages.

### Google Gemini AI Setup

1. Get your API key from https://aistudio.google.com/app/apikey
2. Add `GEMINI_API_KEY` to the `.env` file
3. AI features will automatically activate when configured

**AI Features Include:**
- 💬 Chatty AI Assistant - Conversational chatbot
- ✍️ Smart Message Rewrite - Improve message quality
- ✨ Smart Reply Suggestions - Quick contextual replies
- 🌍 Smart Translations - Translate messages instantly
- ⌨️ Smart Message Completion - Auto-complete sentences
- 📝 Conversation Summarizer - Summarize chat history

### JWT Secret

Generate a secure random string for `JWT_SECRET`. You can use:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📁 Project Structure

```
Chat Application/
├── chatting-app/                 # Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── store/               # Zustand state management
│   │   ├── lib/                 # Utilities (axios, utils)
│   │   └── constants/           # Constants
│   ├── public/                  # Static assets
│   └── package.json
│
└── chatting-app-backend/        # Backend
    ├── src/
    │   ├── controllers/         # Request handlers
    │   ├── models/              # MongoDB models
    │   ├── routes/              # API routes
    │   ├── middleware/          # Custom middleware
    │   ├── lib/                 # Utilities (db, socket, cloudinary)
    │   └── index.js             # Entry point
    └── package.json
```

## 🎯 Usage

### Basic Features
1. **Sign Up**: Create a new account with your name, email, and password
2. **Login**: Sign in with your credentials
3. **Chat**: Select a user from the sidebar to start chatting
4. **Send Messages**: Type your message and press Enter or click Send
5. **Send Images**: Click the image icon to upload and send images
6. **Update Profile**: Go to Profile page to update your profile picture
7. **Settings**: Change theme between light and dark mode

### AI-Powered Features
1. **Chatty AI Assistant**: Click the sparkles button (bottom-right) to chat with AI
2. **Smart Rewrite**: Type a message, click the ✨ button to improve it with AI
3. **Smart Replies**: Receive a message → see quick reply suggestions → click to use
4. **Translate**: Click the 🌐 icon on received messages to translate to English
5. **Auto-Complete**: Start typing → AI suggests completion → press Tab to accept
6. **Summarize**: Click "Summarize Conversation" button to get chat summary (3+ messages)

## 🔒 Security Features

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Environment variables for sensitive data
- ✅ Input validation and sanitization
- ✅ Protected API routes

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/update-profile` - Update profile picture
- `GET /api/auth/check` - Check authentication status

### Messages
- `GET /api/messages/users` - Get all users for sidebar
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user
- `DELETE /api/messages/delete/:id` - Delete a message

### AI Features
- `GET /api/ai/status` - Check AI availability
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/rewrite` - Rewrite message with AI
- `POST /api/ai/translate` - Translate message to target language
- `POST /api/ai/complete` - Get smart message completion
- `POST /api/ai/summarize` - Summarize conversation history

## 🎨 UI Customization

The application uses Tailwind CSS with DaisyUI. You can customize:
- **Colors**: Edit gradient colors in component files
- **Themes**: DaisyUI supports multiple themes
- **Components**: Modify components in `src/components/`

## 🐛 Troubleshooting

**Port Already in Use:**
```bash
# Windows
netstat -ano | findstr :5001
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:5001 | xargs kill -9
```

**MongoDB Connection Issues:**
- Check your connection string
- Ensure IP whitelist in MongoDB Atlas
- Verify network connectivity

**Cloudinary Upload Fails:**
- Verify credentials in `.env`
- Check Cloudinary dashboard for errors
- Ensure you haven't exceeded free tier limits

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Dheeraj Sai**
- GitHub: [@Ankit-84](https://github.com/Ankit-84)

## 🙏 Acknowledgments

- Socket.io for real-time communication
- MongoDB for database
- Cloudinary for image hosting
- Tailwind CSS & DaisyUI for beautiful UI
- React & Vite for amazing developer experience

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Chat Interface
![Chat Interface](screenshots/chat.png)

### Profile Settings
![Profile Settings](screenshots/profile.png)

---

⭐ **Star this repository if you found it helpful!**

💬 **Questions?** Feel free to open an issue or contact me!

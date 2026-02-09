# Forge

A Gemini-powered web-based autonomous agent that designs a skill-building practice plan, observes performance over time, detects stagnation or growth, and rewrites the practice loop at intervals without the user asking.

## Overview

Forge is an intelligent practice planning system that leverages AI to create personalized, adaptive practice sessions. The system continuously monitors your progress and adjusts your practice regimen to optimize skill development based on performance metrics.

## Features

- **AI-Powered Practice Plans**: Automatically generates customized practice plans using Google's Gemini AI
- **Performance Tracking**: Logs and monitors practice sessions with detailed metrics
- **Adaptive Learning**: Detects stagnation and growth patterns, adjusting the practice loop accordingly
- **Weekly Optimization**: Automatically rewrites practice plans based on performance analysis
- **Analytics Dashboard**: Visualize your progress over time with comprehensive analytics
- **Session Management**: Track individual practice sessions and view historical data
- **Timeline View**: See your skill development journey in a visual timeline format
- **Email Reminders**: Can send you reminders for your practice sessions to your mail as provided on creating a plan
- **Google Calendar Integration**: Connects to your Google calender using the email provided on creation of a practice session and automatically writes 4-days practice plan throughout your month.

## Project Structure

```
forge/
├── backend/               # Python Flask server
│   ├── server.py          # Main Flask application
│   ├── AI_Memory/         # Persistent memory storage for AI context
│   ├── requirements.txt   # Python dependencies
│   ├── .env.example       # Gemini API Key and Email Configuration
│   ├── Dockerfile         # Docker configuration environment
│
├── frontend/              # React + Vite web application
│   ├── public/            # Static assets (favicon)
│   ├── src/
│   │   ├── components/    # React components (Form, Analytics, Timeline, etc.)
│   │   ├── contextApi/    # Context API for state management
│   │   ├── Utilities/     # Reusable utility components
│   │   ├── scss/          # Styling with SCSS modules
│   │   └── main.jsx       # Application entry point
│   ├── package.json       # Node.js dependencies
│   └── vite.config.js     # Vite build configuration
│
└── README.md              # This file
```

## Prerequisites

- Python 3.12+
- Node.js 18+
- npm or yarn
- Google Gemini API access
- Docker (for containerized deployment)

## Installation

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate virtual environment:

```bash
python3 -m venv env
source env/bin/activate
```

3. Install dependencies:

```bash
pip3 install -r requirements.txt
```

4. Run the server:

```bash
python3 server.py
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

1. **Create an Account**: Start forging with a new ID or log in with an existing ID
2. **Define Your Skill**: Enter the skill you want to practice
3. **Set up Email (Optional)**: Check the box for recieving email updates and enter your email for reminders
4. **Start Practicing**: Complete assigned practice sessions
5. **Log Progress**: Record your performance metrics after each session
6. **Review Analytics**: Check your progress dashboard to see improvements
7. **Adjust Plans**: The system automatically updates your practice plan based on performance

## Key Components

### Backend

- **server.py**: Flask application handling API endpoints and AI integration
- **AI_Memory**: Stores conversation context and user progress data for the Gemini AI agent
- **Dockerfile**: Docker file to handle containerization

### Frontend

- **Form.jsx**: Practice session entry form
- **Analytics.jsx**: Performance dashboard and statistics
- **Timeline.jsx**: Visual timeline of your skill development
- **Narration.jsx**: UI for narrated guidance and practice narration
- **LogPracticeSession.jsx**: Interface for logging practice results
- **LandingPage.jsx**: Home page and project overview

## Environment Variables

Rename the `.env.example` to `.env` file in the backend directory and update with:

```
GEMINI_API_KEY=your_api_key_here
GOOGLE_BRIDGE_URL=your_google_script_for_email_service_url_here
```

## Docker Deployment

Build and run using Docker:

```bash
docker build -t forge .
docker run -p 5000:5000 forge
```

## Technology Stack

### Backend

- Python 3.12
- Flask - Web framework
- APScheduler - Task scheduling

### Frontend

- React - UI framework
- Vite - Build tool
- SCSS - Styling
- Context API - State management

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues, questions, or feature requests, please open an issue in the repository.

## Acknowledgments

- Powered by Google's Gemini AI
- Built with React and Flask
- Designed for continuous skill development
- Inspired by Google Gemini3 Hackathon on Devpost

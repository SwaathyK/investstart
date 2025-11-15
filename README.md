# Brokee

A simple, friendly platform that helps students learn micro-investing using gamified learning, mini-courses, and virtual practice investing.

## Features

- 🎮 **Gamified Learning** - Earn points, unlock achievements, and level up as you learn
- 📚 **Mini-Courses** - Bite-sized lessons designed for busy students
- 💰 **Virtual Practice** - Practice investing with virtual money in a safe environment
- 🎯 **Student-Focused** - Designed specifically for students starting their financial journey

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Chatbot**: OpenAI ChatGPT API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up environment variables:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Add your API key to `.env.local`:
     ```
     OPENAI_API_KEY=your_actual_api_key_here
     ```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

**Note**: The AI chatbot requires a valid OpenAI API key to function. Without it, the chatbot will show an error message when you try to send a message.

## Project Structure

```
brokee/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   │   └── chat/       # ChatGPT API endpoint
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # Reusable React components
│   ├── Chatbot.tsx     # AI Chatbot component
│   └── Navbar.tsx      # Navigation component
├── public/             # Static assets
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── next.config.js      # Next.js configuration
└── .env.example        # Environment variables template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Next Steps

- [ ] Set up authentication system
- [ ] Create course content structure
- [ ] Build virtual practice trading interface
- [ ] Implement gamification system (points, badges, levels)
- [ ] Add user dashboard
- [ ] Create course pages
- [ ] Set up database for user progress

## License

This project is private and proprietary.


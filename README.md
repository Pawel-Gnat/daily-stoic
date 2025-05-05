# DailyStoic

## Table of Contents

- [Project Name](#project-name)
- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Name

DailyStoic

## Project Description

DailyStoic is a web application that enables users to engage in daily reflections based on Stoic philosophy. The application presents users with a form containing three key questions:

1. What is most important to me?
2. What am I afraid to lose?
3. What do I want to achieve?

Upon submission of the form (with each answer limited to 500 characters), the system leverages AI to generate a personalized Stoic sentence that directly references the user's responses. The generated insights, along with the original reflections, are saved for future review. The app also features an ancient Greek-inspired user interface, complete with a distinctive typography, color palette, and layout, as well as toast notifications for error reporting.

## Tech Stack

- **Frontend:**

  - Astro 5
  - React 19
  - TypeScript 5
  - Tailwind CSS 4
  - Shadcn/ui

- **Backend:**

  - Supabase (provides PostgreSQL database and authentication)

- **AI Integration:**

  - Openrouter.ai (access to multiple AI models, e.g., OpenAI, Anthropic, Google, etc.)

- **CI/CD and Hosting:**

  - GitHub Actions (for continuous integration)
  - Cloudflare Pages (Hosting)

- **Testing:**
  - Vitest + React Testing Library (testy jednostkowe)
  - Playwright (testy end-to-end)

## Getting Started Locally

### Prerequisites

- Node.js (version specified in `.nvmrc`: v22.12.0)
- npm (or your preferred package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Pawel-Gnat/daily-stoic.git
   cd daily-stoic
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` (or the port specified by Astro) to view the application.

## Available Scripts

In the project directory, you can run:

- **`npm run dev`**: Starts the local development server
- **`npm run build`**: Builds the app for production
- **`npm run preview`**: Serves the production build for preview
- **`npm run astro`**: Runs Astro CLI commands
- **`npm run lint`**: Runs ESLint to analyze code for errors
- **`npm run lint:fix`**: Automatically fixes linting issues where possible
- **`npm run format`**: Formats the code using Prettier
- **`npm run test:unit`**: Runs unit tests using Vitest
- **`npm run test:unit:watch`**: Runs unit tests in watch mode
- **`npm run test:e2e`**: Runs end-to-end tests using Playwright
- **`npm run test:e2e:headed`**: Runs end-to-end tests in headed mode (shows browser)
- **`npm run test:e2e:report`**: Opens the Playwright HTML report

## Project Scope

- **Daily Reflections Form:** Users fill out a form with three questions (each with a 500 character limit).
- **AI-Generated Stoic Sentences:** The app generates a personalized Stoic sentence based on user input.
- **Data Persistence:** User entries, along with the generated sentences and timestamps, are saved in a database.
- **User Profile:** Users can view a chronological list of their reflections and delete entries if needed. Note: Editing of entries is not supported in the MVP.
- **Authentication:** User registration and login are managed via Supabase.
- **Error Handling:** The application displays toast notifications for errors, such as exceeding character limits or experiencing API delays.
- **Performance Monitoring:** The generation process from form submission to sentence display is designed to be completed within 10 seconds, with separate monitoring for backend and AI response times.

## Project Status

The DailyStoic project is currently in the MVP phase and is under active development. Future improvements may include additional features such as enhanced user feedback and further optimizations for performance.

## License

This project is licensed under the MIT License.

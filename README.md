# Portfolio Website

My professional portfolio website showcasing my skills, projects, and experience.

## Features

- 🌓 **Dark/Light Mode Toggle**: Clean appearance with smooth animation
- 💼 **Project Showcase**: Display of my recent work with descriptions and technologies used
- 🛠️ **Skills Section**: Visual representation of my technical skills
- 📝 **Contact Form**: Integrated with SendGrid for email delivery
- 📱 **Responsive Design**: Optimized for all device sizes
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Email**: SendGrid API integration
- **Deployment**: Ready for deployment with PM2 and Nginx

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Pongeek/Portfolio.git
   cd Portfolio
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```
   
4. Start the development server
   ```
   npm run dev:local
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Deployment

This project includes configuration files for deployment:

- `deploy.sh`: Setup script for deployment
- `ecosystem.config.js`: PM2 process manager configuration
- `nginx.conf`: Nginx server configuration

Follow the instructions in `DEPLOYMENT.md` for detailed deployment steps.

## License

This project is available for viewing and educational purposes.
Feel free to take inspiration, but please don't directly copy.

## Contact

Feel free to reach out through the contact form on my portfolio website
or connect with me on [GitHub](https://github.com/Pongeek).

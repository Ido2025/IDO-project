# SaaS AI Sales Representative Chatbot

## Introduction
This project is a **SaaS application** built with **Next.js**. The application provides tools for creating a fully customizable **AI sales representative chatbot**, capable of booking appointments, processing payments, and engaging with users through real-time chat. The platform is designed to be easily integrated into any website using a simple code snippet.

## Features
- **AI Sales Representative** – An automated chatbot that handles inquiries, bookings, and payments.
- **Appointment Booking** – Users can book appointments directly through the platform.
- **Real-Time Chat** – Chat functionality that can be either manual or automated.
- **Customizable Interface** – Fully customizable UI for branding and user experience.
- **Stripe Integration** – Secure payment processing via Stripe.
- **Secure File Uploads** – Secure file and image upload functionality.
- **Calendar Widget** – Built-in calendar for booking and appointment management.
- **Email Marketing** – Simple email marketing tools to engage users.
- **Financial Dashboard** – Provides insights into financial data and key metrics.
- **White-Labeling** – The platform can be rebranded to match your business.
- **SEO Optimized Blog** – Built-in SEO optimized blogging feature.
- **Light/Dark Mode Toggle** – Users can switch between light and dark themes.
- **Custom Login/Signup with OTP** – Secure login/signup using One-Time Password (OTP).
- **Feature Control** – Control feature availability based on subscription plans.

---

## Setup Instructions

### 1. Clone the Repository
```sh
git clone https://github.com/your-repository.git
```

### 2. Install Dependencies
```sh
cd my-app
npm install  # or yarn install, pnpm install, bun install
```

### 3. Run the Development Server
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Run the Chatbot Service
```sh
cd chatbot
npm install
npm run dev
```
Make sure both `my-app` and `chatbot` are running simultaneously.

### 5. Set Up Authentication
Follow the **Clerk Authentication** documentation to configure authentication.

### 6. Set Up Database
- Use **Neon Serverless Postgres** for the database.
- Configure Prisma schemas as per the project documentation.

### 7. Customize the UI
Modify the **Shadcn UI** components to match your branding, including light/dark mode settings.

### 8. Deploy to Production
You can deploy using platforms like **Vercel** or **Cloudways** for seamless hosting.

---

## License
This project is licensed under [IDO-KESHET].

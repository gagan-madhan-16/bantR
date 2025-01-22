# bantR

bantR is a full-stack real-time communication platform designed to provide seamless messaging, server management, and multimedia interactions. Built with cutting-edge technologies, bantR aims to deliver a fast, scalable, and user-friendly experience.

## Deployment

You can view the deployed version of bantR at : [bantR](https://bant-r.vercel.app/).

## Features

- **Real-time Messaging**: Instant communication using WebSockets for a seamless chat experience.
- **Server and Channel Management**: Create and manage servers with text, audio, and video channels.
- **User Roles and Permissions**: Support for roles like admin and moderator, with control over server settings and member permissions.
- **File Sharing**: Upload and share files, including images and PDF documents.
- **Infinite Scrolling**: Images load progressively as users scroll, optimizing performance.
- **Dark and Light Mode**: Toggle between dark and light themes for a personalized experience.
- **Video and Audio Chat**: Real-time video and audio calls powered by LiveKit.
- **Direct Messaging**: Private one-on-one conversations.

## Technologies Used

- **Next.js 15**: Provides server-side rendering, API routes, and performance optimizations.
- **React**: For building an interactive and responsive user interface.
- **Socket.io**: Enables real-time, bidirectional communication between clients and servers.
- **Prisma**: ORM for database interactions, simplifying data queries and management.
- **Tailwind CSS**: Utility-first CSS framework for responsive and customizable designs.
- **MySQL**: Relational database for storing user and server data, hosted via Aiven.
- **Clerk**: Authentication and user management, including sign-up, sign-in, and account settings.
- **UploadThing**: Secure and efficient file upload management.
- **LiveKit**: Infrastructure for real-time video and audio calling features.
- **Shadcn UI**: Simplifies the development of modern and accessible chat interfaces.

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/gagan-madhan-16/bantR.git
cd bantR
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

- Create a `.env` file in the root directory a sample `.env.example` file is present in root directory.
- Add the required variables for database connection, authentication (Clerk), and other integrations (LiveKit, UploadThing, etc.).

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open the application in your browser:

Navigate to [http://localhost:3000](http://localhost:3000/).

## Contributing

Contributions are welcome! If you’d like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes:

```bash
git commit -m "Add your commit message here"
```

4. Push your branch:

```bash
git push origin feature/your-feature-name
```

5. Open a pull request on GitHub.

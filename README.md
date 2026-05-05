# ApplyTogether 🚀

A social job-sharing platform where friends help friends find opportunities. Built with React + Vite frontend and Spring Boot backend.

## 🌟 Features

- **Social Job Discovery**: Share and discover job opportunities within your friend network
- **Application Tracking**: Track all your job applications in one place
- **Friend Network**: Follow friends and see what jobs they're applying to
- **Real-time Notifications**: Get notified when friends post new opportunities
- **Admin Dashboard**: Comprehensive analytics and user management
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend

- **Spring Boot 3.4** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **PostgreSQL** - Production database (H2 for local dev)
- **JWT** - Token-based authentication
- **HikariCP** - Connection pooling

## 📁 Project Structure

```
ApplyTogether/
├── Backend/                 # Spring Boot backend
│   ├── src/main/java/       # Java source code
│   └── src/main/resources/  # Configuration files
├── Frontend/                # React frontend
│   ├── src/                 # React components & logic
│   └── public/              # Static assets
├── README.md                # Project documentation
└── build-production.*      # Build scripts
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Java 21+
- Node.js 18+
- Optional: Docker (for local PostgreSQL)

### 1. Backend Setup

1. By default, the backend uses an in-memory H2 database (no setup needed).
2. Run: `cd Backend && ./mvnw spring-boot:run`

Optional: Local PostgreSQL via Docker

1. Run: `docker compose up -d`
2. Set environment variables:
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/applytogether`
   - `SPRING_DATASOURCE_USERNAME=postgres`
   - `SPRING_DATASOURCE_PASSWORD=password`

### 2. Frontend Setup

1. Install dependencies: `cd Frontend && npm install`
2. Run: `npm run dev`

---

## 🏗️ Production Deployment (Railway + Netlify)

This guide explains how to deploy using **Netlify** for the frontend and **Railway** for the backend/DB.

### 1. Backend & DB (Railway)

1. **Provision PostgreSQL**: Log in to Railway and add a PostgreSQL service.
2. **Deploy Backend**: Connect your GitHub repo. Set the Root Directory to `Backend`.
3. **Environment Variables**:
   - `SPRING_DATASOURCE_URL`: `jdbc:postgresql://${{PGHOST}}:${{PGPORT}}/${{PGDATABASE}}`
   - `SPRING_DATASOURCE_USERNAME`: `${{PGUSER}}`
   - `SPRING_DATASOURCE_PASSWORD`: `${{PGPASSWORD}}`
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `JWT_SECRET`: (Your secure 256-bit secret)
   - `FRONTEND_URL`: (Your Netlify domain)

### 2. Frontend (Netlify)

1. **Connect GitHub**: Select your repo.
2. **Settings**:
   - Base directory: `Frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Variables**: Set `VITE_API_BASE_URL` to your Railway backend URL.

---

## 📊 Performance & Optimization Summary

### Backend Optimizations

- ✅ **Lazy Initialization**: Configured for faster startup.
- ✅ **HikariCP**: Connection pool limited (2-10) to save memory.
- ✅ **Batching**: JPA batch processing enabled for bulk operations.
- ✅ **Gzip**: Compression enabled for all JSON/HTML responses.
- ✅ **Security**: Stack traces hidden and CORS strictly configured.

### Frontend Optimizations

- ✅ **Bundle Size**: ~500-600KB (gzipped).
- ✅ **Memoization**: AuthContext optimized with `useMemo` to prevent re-renders.
- ✅ **Build**: Tree-shaking and asset optimization via Vite.

### Resource Estimates (Cloud)

- **Backend JVM**: ~512MB RAM.
- **PostgreSQL**: Managed footprint.
- **Frontend**: Zero server cost (served via CDN).

---

## 📝 API Documentation (Brief)

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/jobs` - View all jobs
- `POST /api/jobs` - Post a job
- `GET /api/admin/stats` - Admin Analytics

---

## 👨‍💻 Author

**Thiru Vikram** - [GitHub](https://github.com/Thiru-Vikram)

**Made with ❤️ for the Friends**

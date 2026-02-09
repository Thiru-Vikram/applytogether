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
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Spring Boot 3.4** - Application framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **MySQL** - Database
- **JWT** - Token-based authentication
- **HikariCP** - Connection pooling

## 📁 Project Structure

```
ApplyTogether/
├── Backend/                 # Spring Boot backend
│   ├── src/main/java/
│   │   └── in/thiruvikram/applytogether/
│   │       ├── controller/  # REST controllers
│   │       ├── service/     # Business logic
│   │       ├── repository/  # Data access
│   │       ├── entity/      # JPA entities
│   │       ├── dto/         # Data transfer objects
│   │       └── security/    # Security config & JWT
│   └── src/main/resources/
│       ├── application.properties      # Dev config
│       └── application-prod.properties # Production config
│
├── Frontend/               # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── api/           # API configuration
│   │   └── index.css      # Global styles
│   ├── .env.example       # Environment template
│   └── .env               # Local environment (gitignored)
│
├── DEPLOYMENT.md          # Deployment guide
├── OPTIMIZATION_SUMMARY.md # Optimization details
└── build-production.*     # Build scripts
```

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8+
- Maven (included via wrapper)

### Backend Setup

1. **Configure Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE applytogether;
   ```

2. **Update Configuration**
   Edit `Backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/applytogether
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Run Backend**
   ```bash
   cd Backend
   ./mvnw spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure API URL**
   The `.env` file is already created with:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Run Frontend**
   ```bash
   npm run dev
   ```
   Frontend will start on `http://localhost:5173`

## 🏗️ Production Build

### Option 1: Automated Script

**Windows:**
```bash
build-production.bat
```

**Linux/Mac:**
```bash
chmod +x build-production.sh
./build-production.sh
```

### Option 2: Manual Build

**Backend:**
```bash
cd Backend
./mvnw clean package -DskipTests
```
Output: `Backend/target/applytogether-0.0.1-SNAPSHOT.jar`

**Frontend:**
```bash
cd Frontend
npm run build
```
Output: `Frontend/dist/`

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:
- Oracle Cloud ARM server setup
- Environment variable configuration
- Systemd service creation
- Nginx reverse proxy setup
- Netlify/Vercel frontend deployment

## 📊 Performance Optimizations

This application is optimized for a **12GB ARM server**:

### Backend
- ✅ Connection pool: 2-10 connections
- ✅ JVM heap: 512MB max
- ✅ Lazy initialization enabled
- ✅ Batch processing for bulk operations
- ✅ Gzip compression enabled
- ✅ Production logging optimized

### Frontend
- ✅ Bundle size: ~500KB (gzipped)
- ✅ Code splitting via React Router
- ✅ Optimized context providers
- ✅ Tree-shaking enabled
- ✅ Minimal re-renders

See [OPTIMIZATION_SUMMARY.md](OPTIMIZATION_SUMMARY.md) for detailed optimization information.

## 🔒 Security Features

- JWT-based authentication
- BCrypt password hashing
- CORS protection
- SQL injection prevention (JPA)
- XSS protection (React + Spring Security)
- Secure token storage
- Environment-based secrets

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (authenticated)
- `GET /api/jobs/{id}` - Get job by ID
- `GET /api/jobs/user/{userId}` - Get user's jobs

### Users
- `GET /api/users/{id}` - Get user profile
- `GET /api/users/search?query=` - Search users
- `POST /api/users/{id}/follow` - Follow user
- `POST /api/users/{id}/unfollow` - Unfollow user

### Applications
- `GET /api/applications/my-applications` - Get my applications
- `POST /api/applications` - Create application
- `PUT /api/applications/{id}` - Update application

### Admin (ADMIN role required)
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/{id}` - Delete user
- `GET /api/admin/jobs` - Get all jobs
- `DELETE /api/admin/jobs/{id}` - Delete job

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Thiru Vikram**
- GitHub: [@Thiru-Vikram](https://github.com/Thiru-Vikram)

## 🙏 Acknowledgments

- Spring Boot team for the amazing framework
- React team for the powerful UI library
- Bootstrap team for the beautiful components
- All contributors and users of ApplyTogether

---

**Made with ❤️ for the Friends**

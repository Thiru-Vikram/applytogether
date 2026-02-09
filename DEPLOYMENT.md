# ApplyTogether - Production Deployment Guide

## 📋 Prerequisites
- Oracle Cloud ARM Server (12GB RAM)
- MySQL Database
- Java 21
- Node.js 18+
- Domain name (optional)

## 🚀 Backend Deployment (Spring Boot)

### 1. Build the JAR file
```bash
cd Backend
./mvnw clean package -DskipTests
```

The JAR will be created in `target/applytogether-0.0.1-SNAPSHOT.jar`

### 2. Set Environment Variables on Server
```bash
export SPRING_PROFILES_ACTIVE=prod
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/applytogether
export SPRING_DATASOURCE_USERNAME=your_db_user
export SPRING_DATASOURCE_PASSWORD=your_db_password
export JWT_SECRET=your_secure_jwt_secret_key_here
export FRONTEND_URL=https://your-netlify-domain.netlify.app
```

### 3. Run the Application
```bash
java -Xmx512m -Xms256m -jar target/applytogether-0.0.1-SNAPSHOT.jar
```

### 4. Create Systemd Service (Recommended)
Create `/etc/systemd/system/applytogether.service`:

```ini
[Unit]
Description=ApplyTogether Backend
After=syslog.target network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/applytogether
ExecStart=/usr/bin/java -Xmx512m -Xms256m -jar /home/ubuntu/applytogether/applytogether-0.0.1-SNAPSHOT.jar
SuccessExitStatus=143
Environment="SPRING_PROFILES_ACTIVE=prod"
Environment="SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/applytogether"
Environment="SPRING_DATASOURCE_USERNAME=your_db_user"
Environment="SPRING_DATASOURCE_PASSWORD=your_db_password"
Environment="JWT_SECRET=your_jwt_secret"
Environment="FRONTEND_URL=https://your-netlify-domain.netlify.app"

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable applytogether
sudo systemctl start applytogether
sudo systemctl status applytogether
```

## 🌐 Frontend Deployment (React + Vite)

### 1. Set Environment Variable
In Netlify/Vercel, add:
```
VITE_API_BASE_URL=http://your-oracle-ip:8080/api
```

### 2. Build
```bash
cd Frontend
npm install
npm run build
```

### 3. Deploy to Netlify
- Connect your GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`
- Add environment variable `VITE_API_BASE_URL`

## 🔒 Security Checklist
- [ ] Change JWT_SECRET to a strong random value
- [ ] Update CORS origins in backend
- [ ] Enable HTTPS (use Nginx reverse proxy)
- [ ] Set strong MySQL password
- [ ] Configure firewall (allow only 80, 443, 8080)
- [ ] Disable root SSH login
- [ ] Set up automated backups

## 📊 Performance Optimization
- Backend uses lazy initialization
- Connection pool limited to 10 connections
- JPA batch processing enabled
- Gzip compression enabled
- Production logging set to WARN level

## 🔧 Troubleshooting

### Check Backend Logs
```bash
sudo journalctl -u applytogether -f
```

### Check Memory Usage
```bash
free -h
htop
```

### Restart Service
```bash
sudo systemctl restart applytogether
```

## 📈 Monitoring
- Health endpoint: `http://your-ip:8080/actuator/health`
- Application logs: `/var/log/applytogether/`

## 🔄 Updates
To deploy updates:
```bash
# Backend
./mvnw clean package -DskipTests
sudo systemctl restart applytogether

# Frontend
npm run build
# Netlify will auto-deploy on git push
```

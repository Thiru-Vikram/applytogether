# 🎯 Production Deployment Checklist

Use this checklist to ensure a smooth deployment to your Oracle Cloud ARM server.

## 📋 Pre-Deployment

### Backend Preparation
- [ ] Review `application-prod.properties` configuration
- [ ] Generate strong JWT secret (minimum 256 bits)
- [ ] Prepare MySQL database credentials
- [ ] Note down your Oracle Cloud server IP
- [ ] Ensure Java 21 is installed on server
- [ ] Test backend build locally: `./mvnw clean package -DskipTests`

### Frontend Preparation
- [ ] Decide on frontend hosting (Netlify/Vercel recommended)
- [ ] Prepare custom domain (optional)
- [ ] Test frontend build locally: `npm run build`
- [ ] Verify all pages work in production build: `npm run preview`

## 🗄️ Database Setup

- [ ] SSH into Oracle Cloud server
- [ ] Install MySQL 8: `sudo apt install mysql-server`
- [ ] Secure MySQL: `sudo mysql_secure_installation`
- [ ] Create database: `CREATE DATABASE applytogether;`
- [ ] Create database user with appropriate permissions
- [ ] Test database connection
- [ ] Configure MySQL for production (my.cnf optimization)

## 🔧 Backend Deployment

### Server Setup
- [ ] SSH into server: `ssh ubuntu@your-oracle-ip`
- [ ] Update system: `sudo apt update && sudo apt upgrade`
- [ ] Install Java 21: `sudo apt install openjdk-21-jdk`
- [ ] Verify Java: `java -version`
- [ ] Create application directory: `mkdir -p ~/applytogether`

### Application Deployment
- [ ] Upload JAR file to server (SCP/SFTP)
- [ ] Create systemd service file (see DEPLOYMENT.md)
- [ ] Set environment variables in service file
- [ ] Enable service: `sudo systemctl enable applytogether`
- [ ] Start service: `sudo systemctl start applytogether`
- [ ] Check status: `sudo systemctl status applytogether`
- [ ] Check logs: `sudo journalctl -u applytogether -f`
- [ ] Test health endpoint: `curl http://localhost:8080/actuator/health`

### Nginx Setup (Recommended)
- [ ] Install Nginx: `sudo apt install nginx`
- [ ] Configure reverse proxy (see DEPLOYMENT.md)
- [ ] Install Certbot: `sudo apt install certbot python3-certbot-nginx`
- [ ] Obtain SSL certificate: `sudo certbot --nginx -d api.yourdomain.com`
- [ ] Test Nginx config: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`
- [ ] Test HTTPS: `curl https://api.yourdomain.com/actuator/health`

### Firewall Configuration
- [ ] Allow HTTP: `sudo ufw allow 80/tcp`
- [ ] Allow HTTPS: `sudo ufw allow 443/tcp`
- [ ] Allow SSH: `sudo ufw allow 22/tcp`
- [ ] Enable firewall: `sudo ufw enable`
- [ ] Check status: `sudo ufw status`

## 🌐 Frontend Deployment

### Netlify Deployment
- [ ] Create Netlify account
- [ ] Connect GitHub repository
- [ ] Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Add environment variable: `VITE_API_BASE_URL`
- [ ] Deploy site
- [ ] Test all pages and functionality
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (automatic on Netlify)

### Vercel Deployment (Alternative)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Configure build settings (auto-detected)
- [ ] Add environment variable: `VITE_API_BASE_URL`
- [ ] Deploy
- [ ] Test deployment
- [ ] Configure custom domain (optional)

## 🔒 Security Hardening

### Server Security
- [ ] Disable root SSH login
- [ ] Use SSH keys instead of passwords
- [ ] Install fail2ban: `sudo apt install fail2ban`
- [ ] Configure automatic security updates
- [ ] Set up monitoring (optional)
- [ ] Configure log rotation

### Application Security
- [ ] Verify JWT secret is strong and unique
- [ ] Ensure database passwords are strong
- [ ] Verify CORS settings allow only your frontend domain
- [ ] Check that error messages don't leak sensitive info
- [ ] Ensure HTTPS is enforced
- [ ] Review and update dependencies regularly

## 🧪 Testing

### Backend Testing
- [ ] Test health endpoint
- [ ] Test user registration
- [ ] Test user login
- [ ] Test JWT authentication
- [ ] Test job creation
- [ ] Test follow/unfollow functionality
- [ ] Test admin endpoints (if applicable)
- [ ] Load test with expected traffic

### Frontend Testing
- [ ] Test landing page
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test job browsing
- [ ] Test job posting
- [ ] Test profile pages
- [ ] Test search functionality
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Verify API calls work from production domain

### Integration Testing
- [ ] Test complete user journey
- [ ] Verify CORS is working
- [ ] Test file uploads (if applicable)
- [ ] Test real-time features
- [ ] Verify email notifications (if implemented)

## 📊 Monitoring Setup

### Basic Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, etc.)
- [ ] Configure health check alerts
- [ ] Set up log monitoring
- [ ] Monitor disk space
- [ ] Monitor memory usage
- [ ] Monitor CPU usage

### Advanced Monitoring (Optional)
- [ ] Set up Prometheus + Grafana
- [ ] Configure application metrics
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure performance monitoring
- [ ] Set up database monitoring

## 💾 Backup Strategy

- [ ] Set up automated MySQL backups
- [ ] Test backup restoration
- [ ] Store backups off-server
- [ ] Document backup procedures
- [ ] Set up backup monitoring/alerts

## 📝 Documentation

- [ ] Document server access credentials (securely)
- [ ] Document environment variables
- [ ] Document deployment procedures
- [ ] Create runbook for common issues
- [ ] Document rollback procedures
- [ ] Share access with team members (if applicable)

## 🚀 Go Live!

### Final Checks
- [ ] All tests passing
- [ ] All security measures in place
- [ ] Monitoring configured
- [ ] Backups configured
- [ ] Documentation complete
- [ ] Team notified (if applicable)

### Launch
- [ ] Update DNS records (if using custom domain)
- [ ] Announce to users
- [ ] Monitor closely for first 24-48 hours
- [ ] Be ready to rollback if needed

## 📞 Post-Deployment

### Immediate (First 24 Hours)
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Check user feedback
- [ ] Verify all features working
- [ ] Monitor server resources

### First Week
- [ ] Review logs for errors
- [ ] Optimize based on real usage
- [ ] Address any user-reported issues
- [ ] Fine-tune server resources if needed
- [ ] Review security logs

### Ongoing
- [ ] Regular security updates
- [ ] Regular dependency updates
- [ ] Performance optimization
- [ ] Feature enhancements
- [ ] User feedback incorporation

## 🆘 Emergency Contacts

Document these for quick reference:
- [ ] Server provider support
- [ ] Domain registrar support
- [ ] Database admin contact
- [ ] Team lead contact
- [ ] On-call rotation (if applicable)

## 📊 Success Metrics

Track these to measure deployment success:
- [ ] Uptime percentage (target: 99.9%)
- [ ] Average response time (target: <500ms)
- [ ] Error rate (target: <0.1%)
- [ ] User satisfaction
- [ ] Active users
- [ ] Feature adoption

---

## ✅ Deployment Complete!

Once all items are checked:
1. Celebrate! 🎉
2. Monitor for the first week
3. Gather user feedback
4. Plan next iteration

**Remember**: Deployment is not the end, it's the beginning of your application's journey!

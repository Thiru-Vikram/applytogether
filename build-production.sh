#!/bin/bash

# ApplyTogether - Production Build Script
# This script builds both frontend and backend for production deployment

set -e  # Exit on error

echo "🚀 ApplyTogether Production Build Script"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Build Backend
echo -e "\n${BLUE}📦 Building Backend (Spring Boot)...${NC}"
cd Backend
./mvnw clean package -DskipTests
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build successful!${NC}"
    echo -e "JAR location: Backend/target/applytogether-0.0.1-SNAPSHOT.jar"
else
    echo -e "${RED}❌ Backend build failed!${NC}"
    exit 1
fi
cd ..

# Build Frontend
echo -e "\n${BLUE}📦 Building Frontend (React + Vite)...${NC}"
cd Frontend
npm install
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful!${NC}"
    echo -e "Build location: Frontend/dist/"
else
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi
cd ..

# Summary
echo -e "\n${GREEN}=========================================="
echo "✅ Production Build Complete!"
echo "==========================================${NC}"
echo ""
echo "📁 Artifacts:"
echo "   Backend:  Backend/target/applytogether-0.0.1-SNAPSHOT.jar"
echo "   Frontend: Frontend/dist/"
echo ""
echo "📝 Next Steps:"
echo "   1. Deploy backend JAR to your Oracle Cloud server"
echo "   2. Deploy frontend dist/ folder to Netlify/Vercel"
echo "   3. Configure environment variables"
echo "   4. See DEPLOYMENT.md for detailed instructions"
echo ""

#!/bin/bash

echo "🚀 Deploying Split Expense App..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Ready for deployment to Vercel"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub: git push origin main"
    echo "2. Connect repository to Vercel"
    echo "3. Deploy!"
else
    echo "❌ Build failed!"
    exit 1
fi 
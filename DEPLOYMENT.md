# SSG Deployment Guide for Hostinger VPS

## Step 1: Build SSG Files on VPS

Run this command on your Hostinger VPS to generate static HTML files:

```bash
npm run build:ssg
```

Or for complete production build:

```bash
npm run build:production
```

**Output Location:** `dist/wizbooking/browser/`

## Step 2: Serve Static Files

After building, you have several options to serve the static files:

### Option A: Using Nginx (Recommended for Production)

1. Install nginx (if not already installed):
```bash
sudo apt update
sudo apt install nginx
```

2. Configure nginx to serve your static files:
```bash
sudo nano /etc/nginx/sites-available/your-domain
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /path/to/your/project/dist/wizbooking/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. Enable the site and restart nginx:
```bash
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option B: Using Apache

1. Install Apache (if not already installed):
```bash
sudo apt install apache2
```

2. Configure Apache:
```bash
sudo nano /etc/apache2/sites-available/your-domain.conf
```

Add this configuration:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/your/project/dist/wizbooking/browser

    <Directory /path/to/your/project/dist/wizbooking/browser>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
</VirtualHost>
```

3. Enable the site and restart Apache:
```bash
sudo a2ensite your-domain.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### Option C: Using Node.js Static Server (Simple Option)

1. Install a static file server:
```bash
npm install -g serve
```

2. Serve the files:
```bash
serve -s dist/wizbooking/browser -l 3000
```

Or use http-server:
```bash
npm install -g http-server
http-server dist/wizbooking/browser -p 3000
```

## Step 3: Quick Deployment Script

You can create a deployment script to automate the process:

```bash
#!/bin/bash
# deploy.sh

echo "Generating routes..."
npm run generate-routes

echo "Building SSG files..."
npm run build:ssg

echo "Build complete! Files are in dist/wizbooking/browser/"
echo "Copy these files to your web server directory"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Important Notes:

1. **After building**, all static HTML files will be in `dist/wizbooking/browser/`
2. **Copy these files** to your web server's document root (usually `/var/www/html` or `/home/username/public_html`)
3. **For Angular routing**, make sure your server is configured to serve `index.html` for all routes (see nginx/Apache configs above)
4. **Update routes** before each build: `npm run generate-routes` to get latest dynamic routes


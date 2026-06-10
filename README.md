# saar-biotech-hugo-rj

## A Premium SaaS-Ready Pharma Business Theme for Hugo (MDX-Based)

A modern, feature-rich Hugo theme built for SaaS and B2B pharma companies. It delivers a premium "saas-ready" experience with advanced features like infinite scroll, dynamic data sheets, AI-powered chatbot integration, and a comprehensive admin dashboard.

## 🚀 Live Preview

**[saar-pharma-demo.vercel.app](https://saar-pharma-demo.vercel.app)**

## 🌟 Key Features

### Core Product Features

- **Dynamic Product Cards**: Beautiful, feature-rich product cards with structured data presentation
- **Premium Info Panel**: Advanced data sheet layout with tab-based navigation (Overview, Specs, Market, Quality)
- **Infinite Scroll**: Seamless "Load More" pagination for large product catalogs
- **Bookmark System**: User-specific bookmarking for saving favorite products
- **Advanced Search**: Comprehensive filtering and searching across all products

### SaaS Business Features

- **Admin Dashboard**: Full-featured admin interface for managing products, orders, bookmarks, and clients
- **Client Management**: Add, edit, and track clients with detailed information
- **Order System**: Complete order placement and tracking system
- **Client Portal**: Secure area for clients to view products, orders, and account details
- **Inquiry System**: Track and manage business inquiries
- **Contact Management**: Professional contact handling with categorization

### Design & Tech Features

- **Premium SaaS Design**: Modern, minimalist aesthetic with glassmorphism effects
- **Advanced Typography**: Features multiple font families with premium spacing and layout
- **Smooth Animations**: Advanced micro-interactions and page transition effects
- **MDX Integration**: Full support for MDX content files with live previews
- **Responsive Layout**: Mobile-first, fully responsive design
- **Icon Integration**: Native support for Lucide icons

### Chat & AI Integration

- **AI Chatbot**: Integrated GPT-3.5 powered chatbot for instant product queries
- **Chat Widget**: Persistent chat widget with conversation history
- **Smart Suggestions**: AI-powered product recommendations

## 🔧 Installation

### Method 1: Quick Start (Recommended)

Run this command in your Hugo project's root directory:

```bash
# 1. Add the theme as a Git submodule
git submodule add https://github.com/saar-biotech/saar-pharma-hugo-rj.git themes/saar

# 2. Install dependencies (Node.js required for build scripts)
npm install --prefix themes/saar

# 3. Configure your Hugo site
# Add this line to your config.toml:
# theme = "saar"

# 4. Start the development server
hugo server
```

### Method 2: Manual Installation

```bash
# 1. Download or clone the theme
git clone https://github.com/saar-biotech/saar-pharma-hugo-rj.git themes/saar

# 2. Install dependencies
npm install --prefix themes/saar

# 3. Configure Hugo
# Add this line to your config.toml:
# theme = "saar"

# 4. Generate the site
hugo server
```

## 🛠️ Build System (Node.js Required)

The theme includes a comprehensive build system for managing assets, Tailwind CSS, and MDX pre-processing. You'll need Node.js and npm installed.

### Available Commands

```bash
# Development mode with live reload
npm run dev:theme

# Build for production
npm run build:theme

# Start development server with theme
npm run dev

# Production build for entire site
npm run build

# Preview production build
npm run preview
```

## 📂 Project Structure

```
themes/saar/
├── assets/                # Source assets (Tailwind, JS, MDX)
├── layouts/               # Hugo page templates
├── layouts/partials/      # Reusable components
├── static/                # Static assets
├── archetypes/            # Content templates
├── content/               # Sample content
│   ├── _index.md          # Home page
│   ├── products/          # Product listings
│   ├── clients/           # Client management
│   ├── orders/            # Order management
│   ├── inquiries/         # Inquiry management
│   └── contacts/          # Contact management
└── package.json           # Build scripts
```

## 📝 Configuration

Add your site configuration to `config.toml` (or `config.yaml`):

```toml
baseURL = "https://your-domain.com/"
languageCode = "en-us"
title = "Your Company Name"
theme = "saar"

[pagination]
per_page = 12

[params]
social_github = "your-github"
social_linkedin = "your-linkedin"
social_twitter = "your-twitter"

[navigation]

[[navigation.main]]
name = "Home"
url = "/"

[[navigation.main]]
name = "Products"
url = "/products/"
```

## 🚀 Deploy

### Vercel Deployment (Recommended)

```bash
# 1. Deploy the Hugo site
hugo deploy

# 2. Ensure build settings on Vercel:
#    - Build Command: npm run build
#    - Publish Directory: public
```

### Netlify Deployment

```bash
# 1. Deploy using Netlify CLI
netlify deploy

# 2. Ensure build settings:
#    - Build command: npm run build
#    - Publish directory: public
#    - Node version: 18 or higher
```

### GitHub Pages

```bash
# Build and deploy to GitHub Pages
hugo
git add .
git commit -m "Deploy site"
git subtree push --prefix public origin gh-pages
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Workflow

For theme development, use the built-in dev server:

```bash
# Start development server with theme changes
npm run dev

# To test with your main site
npm run dev:theme  # Start theme dev server
# Then open your site at http://localhost:1313
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## 👥 Support

For issues, feature requests, or support, please open an issue on the GitHub repository.

---

**Built with ❤️ for SaaS and B2B Pharma Businesses**

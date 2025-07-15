# Personal Website - Multilingual Portfolio & Blog

A modern, performance-optimized personal website built with **Nuxt 3** and **Vue 3**, featuring full internationalization support for **English** and **Arabic** languages with comprehensive RTL (Right-to-Left) support.

## 🌟 Features

### 🌍 Multilingual Support
- **Dual Language**: Complete English and Arabic support
- **RTL Layout**: Native right-to-left support for Arabic
- **Smart Font Loading**: Automatic font switching (Inter for English, Tajawal for Arabic)
- **URL Strategy**: Clean URLs with prefix except default (Arabic is default, English uses `/en`)

### 🎨 Modern Design & Performance
- **Tailwind CSS 4**: Latest utility-first CSS framework
- **Nuxt UI & UI Pro**: Premium component library integration
- **Multiple Themes**: Built-in theme system with dark/light modes
- **Responsive Design**: Mobile-first approach with optimized breakpoints

### 📝 Content Management
- **Nuxt Content v3**: Git-based CMS with markdown support
- **MDC Components**: Rich content with Vue components in markdown
- **Content Schema**: Structured content with Zod validation
- **Blog System**: Full-featured blog with categorization and tagging

### 🚀 Performance & SEO
- **Code Splitting**: Optimized bundle splitting for faster loading
- **Image Optimization**: WebP/AVIF support with responsive images
- **SEO Optimized**: Complete meta tags, OpenGraph, and structured data
- **Sitemap & Robots**: Automatic generation for search engines

### 🔧 Developer Experience
- **TypeScript**: Full type safety (configurable strictness)
- **Hot Reload**: Fast development with instant content updates
- **Modern Tooling**: Latest Vite integration with Tailwind CSS
- **Bundle Analysis**: Built-in bundle analysis capabilities

## 📋 Technology Stack

### Core Framework
- **Nuxt 3** (v3.17.6) - Vue.js framework for SSR/SSG
- **Vue 3** (v3.5.17) - Progressive JavaScript framework
- **TypeScript** (v5.8.3) - Type-safe development

### Styling & UI
- **Tailwind CSS** (v4.1.11) - Utility-first CSS framework
- **@nuxt/ui** (v3.2.0) - Component library
- **@tailwindcss/typography** - Enhanced typography for content

### Content & CMS
- **@nuxt/content** (v3.6.3) - Git-based content management
- **@nuxtjs/mdc** (v0.17.0) - Markdown components
- **PrismJS** (v1.30.0) - Syntax highlighting

### Internationalization
- **@nuxtjs/i18n** (v9.5.6) - Vue I18n integration
- **@nuxtjs/google-fonts** (v3.2.0) - Font optimization

### SEO & Performance
- **@nuxtjs/seo** (v3.1.0) - SEO optimization
- **@nuxtjs/sitemap** (v7.4.3) - Sitemap generation
- **@nuxtjs/robots** (v5.4.0) - Robots.txt management
- **@nuxt/image** (v1.10.0) - Image optimization

### Search & Utilities
- **Fuse.js** (v7.1.0) - Fuzzy search functionality
- **Better SQLite3** (v12.2.0) - Database support

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+ recommended)
- **pnpm** (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd personal-website/cube-blog

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The development server will start on `http://localhost:3000`

### Access Languages
- **Arabic** (default): `http://localhost:3000`
- **English**: `http://localhost:3000/en`

## 📜 Available Scripts

```bash
# Development
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm build:analyze      # Build with bundle analysis
pnpm generate           # Generate static site
pnpm preview           # Preview production build
```

## 📁 Project Structure

```
cube-blog/
├── components/         # Vue components
│   ├── blog/          # Blog-specific components
│   └── content/       # Content-specific components
├── composables/       # Vue composables for reusable logic
├── content/           # Markdown content files
│   ├── ar/           # Arabic content
│   └── en/           # English content
├── layouts/          # Nuxt layouts
├── locales/          # Translation files
├── middleware/       # Route middleware
├── pages/            # File-based routing
├── plugins/          # Nuxt plugins
├── public/           # Static assets
├── server/           # Server-side code
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🌐 Content Management

### Content Structure
Content is organized by language in separate directories:

```
content/
├── ar/              # Arabic content (RTL)
│   ├── index.md     # Homepage
│   ├── about.md     # About page
│   ├── contact.md   # Contact page
│   └── blog/        # Blog posts
└── en/              # English content (LTR)
    ├── index.md     # Homepage
    ├── about.md     # About page
    ├── contact.md   # Contact page
    └── blog/        # Blog posts
```

### Content Schema
All content files follow a structured frontmatter schema:

```yaml
---
title: Page Title
description: Page description
slug: page-slug
category: page|blog
tags: 
  - tag1
  - tag2
published: true
created: 2025-07-13
updated: 2025-07-13
meta:
  title: SEO Title
  description: SEO Description
  keywords: keyword1, keyword2
  ogTitle: OpenGraph Title
  ogDescription: OpenGraph Description
  ogImage: /images/og-image.jpg
---
```

### Adding Content
1. Create markdown files in the appropriate language directory
2. Follow the frontmatter schema for metadata
3. Use MDC components for rich content
4. Content is automatically processed and available via the Content API

## 🎨 Theming & Styling

### Tailwind CSS Configuration
The project uses Tailwind CSS 4 with custom configuration:
- **RTL Support**: Built-in RTL utilities for Arabic
- **Custom Colors**: Extended color palette
- **Typography**: Enhanced typography plugin
- **Responsive Design**: Mobile-first breakpoints

### Theme System
- **Color Modes**: Light, dark, and system preference
- **Font Switching**: Automatic font loading based on language
- **Custom Properties**: CSS variables for consistent theming

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the project root:

```env
# Site Configuration
NUXT_PUBLIC_SITE_URL=https://your-domain.com
NUXT_PUBLIC_API_BASE=/api

# Optional: API Secret for server-side operations
NUXT_API_SECRET=your-secret-key
```

### Internationalization
Configure languages in `nuxt.config.ts`:
- **Default Language**: Arabic (no URL prefix)
- **Secondary Language**: English (`/en` prefix)
- **RTL Support**: Automatic layout direction switching

### SEO Configuration
The project includes comprehensive SEO setup:
- **Automatic sitemap generation**
- **OpenGraph meta tags**
- **Structured data support**
- **Multi-language SEO optimization**

## 🚀 Deployment

### Build for Production
```bash
# Static site generation (recommended)
pnpm generate

# Server-side rendering
pnpm build
```

### Deployment Platforms
The project is optimized for deployment on:
- **Vercel** (recommended for SSG)
- **Netlify**
- **GitHub Pages** (static generation)
- **Node.js servers** (SSR)

### Pre-deployment Checklist
1. Update `NUXT_PUBLIC_SITE_URL` in environment variables
2. Configure domain-specific settings in `nuxt.config.ts`
3. Test both language versions
4. Verify sitemap and robots.txt generation

## 🔍 SEO Features

### Automatic Generation
- **Sitemap**: Multi-language sitemap with proper hreflang tags
- **Robots.txt**: Configured for optimal crawling
- **Meta Tags**: Complete OpenGraph and Twitter Card support

### Content SEO
- **Structured Data**: JSON-LD structured data for rich snippets
- **Breadcrumbs**: Automatic breadcrumb generation
- **Reading Progress**: Blog reading progress indicators

## 🧪 Development

### Code Quality
- **TypeScript**: Full type safety with configurable strictness
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

### Performance Optimization
- **Code Splitting**: Manual chunk splitting for optimal loading
- **Image Optimization**: WebP/AVIF with responsive images
- **Font Loading**: Optimized font loading with preconnect
- **Bundle Analysis**: Built-in bundle size analysis

### Testing
- **Type Checking**: TypeScript compilation
- **Build Testing**: Production build validation
- **Cross-browser Testing**: RTL and LTR layout testing

## 📚 Resources

### Documentation
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Vue 3 Documentation](https://vuejs.org/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Nuxt Content Documentation](https://content.nuxt.com/)

### Key Dependencies
- [Nuxt UI Documentation](https://ui.nuxt.com/)
- [Vue I18n Documentation](https://vue-i18n.intlify.dev/)
- [MDC Documentation](https://content.nuxt.com/usage/markdown)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the existing code style
4. Test both language versions
5. Submit a pull request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Built with ❤️ using Nuxt 3, Vue 3, and Tailwind CSS**
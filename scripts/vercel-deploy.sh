#!/bin/bash

# Vercel Deployment Helper Script
# This script helps with common Vercel deployment tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not found. Installing..."
        npm install -g vercel
        log_success "Vercel CLI installed"
    else
        log_info "Vercel CLI found"
    fi
}

# Check dependencies
check_dependencies() {
    log_info "Checking dependencies..."
    
    if [ ! -f "pnpm-lock.yaml" ]; then
        log_error "pnpm-lock.yaml not found. Run 'pnpm install' first."
        exit 1
    fi
    
    if [ ! -f "vercel.json" ]; then
        log_error "vercel.json not found. Please create the configuration file."
        exit 1
    fi
    
    log_success "Dependencies check passed"
}

# Environment setup
setup_environment() {
    local env=$1
    log_info "Setting up environment: $env"
    
    case $env in
        "development")
            if [ -f ".env.development" ]; then
                cp .env.development .env.local
                log_success "Development environment configured"
            else
                log_warning "No .env.development file found"
            fi
            ;;
        "staging")
            if [ -f ".env.staging" ]; then
                log_info "Staging environment file found"
                log_warning "Remember to set environment variables in Vercel dashboard"
            else
                log_warning "No .env.staging file found"
            fi
            ;;
        "production")
            if [ -f ".env.production" ]; then
                log_info "Production environment file found"
                log_warning "Remember to set environment variables in Vercel dashboard"
            else
                log_warning "No .env.production file found"
            fi
            ;;
    esac
}

# Local development with Vercel
dev_local() {
    log_info "Starting local development with Vercel..."
    check_vercel_cli
    setup_environment "development"
    
    log_info "Starting Vercel dev server..."
    vercel dev --listen 3000
}

# Build for production
build_production() {
    log_info "Building for production..."
    
    # Clean previous builds
    if [ -d ".output" ]; then
        rm -rf .output
        log_info "Cleaned previous build"
    fi
    
    # Install dependencies
    log_info "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Build
    log_info "Building application..."
    pnpm build
    
    log_success "Build completed successfully"
}

# Preview deployment
deploy_preview() {
    log_info "Deploying preview..."
    check_vercel_cli
    check_dependencies
    
    log_info "Creating preview deployment..."
    vercel --prebuilt
    
    log_success "Preview deployment completed"
}

# Production deployment
deploy_production() {
    log_info "Deploying to production..."
    check_vercel_cli
    check_dependencies
    
    log_warning "This will deploy to production. Are you sure? (y/N)"
    read -r confirm
    
    if [[ $confirm =~ ^[Yy]$ ]]; then
        log_info "Creating production deployment..."
        vercel --prod --prebuilt
        log_success "Production deployment completed"
    else
        log_info "Production deployment cancelled"
    fi
}

# Test build locally
test_build() {
    log_info "Testing build locally..."
    
    build_production
    
    log_info "Starting preview server..."
    pnpm preview
}

# Environment variables management
manage_env() {
    log_info "Environment variables management"
    echo "Available commands:"
    echo "  list    - List all environment variables"
    echo "  add     - Add environment variable"
    echo "  remove  - Remove environment variable"
    echo ""
    
    read -p "Enter command: " cmd
    
    case $cmd in
        "list")
            vercel env ls
            ;;
        "add")
            read -p "Enter variable name: " name
            read -p "Enter variable value: " value
            read -p "Enter environment (development/preview/production): " env
            vercel env add "$name" "$env" <<< "$value"
            ;;
        "remove")
            read -p "Enter variable name: " name
            read -p "Enter environment (development/preview/production): " env
            vercel env rm "$name" "$env"
            ;;
        *)
            log_error "Invalid command"
            ;;
    esac
}

# Domain management
manage_domains() {
    log_info "Domain management"
    vercel domains ls
    
    echo ""
    echo "To add a domain:"
    echo "  vercel domains add yourdomain.com"
    echo ""
    echo "To remove a domain:"
    echo "  vercel domains rm yourdomain.com"
}

# Check deployment status
check_status() {
    log_info "Checking deployment status..."
    vercel ls
}

# Logs viewing
view_logs() {
    log_info "Recent deployments:"
    vercel ls --limit 5
    
    echo ""
    read -p "Enter deployment URL to view logs: " url
    
    if [ -n "$url" ]; then
        vercel logs "$url"
    else
        log_error "No URL provided"
    fi
}

# Performance analysis
analyze_performance() {
    log_info "Analyzing performance..."
    
    if [ -f "package.json" ]; then
        log_info "Running bundle analyzer..."
        pnpm build:analyze
    else
        log_error "package.json not found"
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "=== Vercel Deployment Helper ==="
    echo "1. Local development (vercel dev)"
    echo "2. Build for production"
    echo "3. Deploy preview"
    echo "4. Deploy production"
    echo "5. Test build locally"
    echo "6. Manage environment variables"
    echo "7. Manage domains"
    echo "8. Check deployment status"
    echo "9. View deployment logs"
    echo "10. Analyze performance"
    echo "11. Exit"
    echo ""
}

# Main execution
main() {
    while true; do
        show_menu
        read -p "Choose an option (1-11): " choice
        
        case $choice in
            1) dev_local ;;
            2) build_production ;;
            3) deploy_preview ;;
            4) deploy_production ;;
            5) test_build ;;
            6) manage_env ;;
            7) manage_domains ;;
            8) check_status ;;
            9) view_logs ;;
            10) analyze_performance ;;
            11) 
                log_info "Goodbye!"
                exit 0
                ;;
            *)
                log_error "Invalid option. Please choose 1-11."
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Check if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    # Check if we're in the right directory
    if [ ! -f "nuxt.config.ts" ]; then
        log_error "This script must be run from the project root directory"
        exit 1
    fi
    
    # Run main function
    main
fi
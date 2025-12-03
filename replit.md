# Katie Mueller's Portfolio

## Overview
This is a static portfolio website showcasing creative development, engineering projects, interactive installations, and architecture work. The site features a playful, feminine aesthetic with interactive elements and creative coding projects using p5.js.

## Project Structure
- **HTML Pages**: Multiple portfolio pages showcasing different project categories
- **Assets**:
  - `assets/css/`: Stylesheets for different pages
  - `assets/js/`: JavaScript files including p5.js sketches and interactive elements
  - `assets/images/`: Project images and graphics
  - `assets/data/`: JSON data for project information
  - `assets/fonts/`: Custom fonts

## Technologies
- **Frontend**: HTML, CSS, JavaScript
- **Creative Coding**: p5.js for interactive visualizations and generative art
- **Libraries**: PageFlip.js for flipbook-style portfolio navigation
- **Build Tools**: PostCSS with PurgeCSS for CSS optimization
- **Dev Server**: http-server for local development

## Development Setup
The project is configured to run on Replit with:
- **Workflow**: Portfolio Server running on port 5000
- **Command**: `npx http-server -p 5000 -a 0.0.0.0 -c-1`
- **Cache Control**: Disabled (`-c-1`) to ensure fresh content during development

## Deployment
Configured as a static site deployment:
- **Type**: Static hosting
- **Public Directory**: Root directory (`.`)
- No build step required

## Project Categories
1. **Creative Development**: Web apps, interactive visualizations, generative art
2. **Engineering**: Kinetic sculptures, LED installations, IoT projects
3. **Interactive Installations**: Responsive environments, sound sculptures
4. **Architecture**: Parametric design, sustainable structures

## Recent Changes
- December 3, 2025: Initial Replit setup with http-server for static file serving
- Configured deployment for static hosting
- Added workflow configuration for development server
- **Performance Optimizations**:
  - Added preconnect hints for Google Fonts and CDNs to reduce connection latency
  - Updated Google Fonts API to use `display=swap` for better font rendering
  - Added `defer` attribute to most script tags (except preloader scripts which run immediately)
- **Preloader**:
  - All portfolio pages have animated "loading..." preloader that waits for ALL images to load
  - Index page has preloader that waits for fonts to load
  - Preloader uses session storage to skip animation on repeat visits
  - Created preload.js (waits for all images) and preload_font.js (waits for fonts only)
- **Mobile Responsiveness**:
  - Updated viewport meta tag with `user-scalable=no, viewport-fit=cover` to prevent zoom issues
  - Added mobile-specific CSS styles for `.pinkcontainer` and `.image-wrapper`
  - Added media queries for mobile (max-width: 768px) and landscape orientation handling
  - Added debounced resize/orientation handling in ref_image.js
- **Bug Fixes**:
  - Fixed filler image z-index stacking (now z-index: 150) so project images display above scrapbook background
  - Fixed menu_all.js error where handleMenu() was called before navbar loaded

## Notes
- All static assets are served from the root directory
- Cache control is disabled in development to see changes immediately
- The site uses custom fonts and creative coding libraries that load at runtime
- Scrapbook layout uses absolute positioning with percentage-based coordinates relative to reference images
- All images load eagerly to ensure proper preloader behavior (waits for complete page load before displaying)

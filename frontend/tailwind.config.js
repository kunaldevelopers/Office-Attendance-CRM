/*
=================================================================================
ADMIN PANEL STYLING ANALYSIS - REFACTORED TO NEW TEAL COLOR SCHEME
=================================================================================

1. CSS Framework: Tailwind CSS
   - Exclusively uses Tailwind utility classes for all styling
   - Custom color palette added for new design system
   - Font family extended to include Poppins from Google Fonts

2. Color Scheme (NEW):
   Primary: Dark Teal (#0D9488) - teal-600
   Secondary: Soft Gray (#6B7280) - gray-500
   Background: Off-White (#F9FAFB) - gray-50 for content areas
   Sidebar/Nav: Dark Gray (#1F2A44) - gray-950 for navigation
   Text: Dark Gray (#111827) - gray-900 for primary text
         Light Gray (#9CA3AF) - gray-400 for secondary text
   Status Colors:
     - Success: #10B981 - Green for positive states
     - Error: #EF4444 - Red for error states  
     - Warning: #F59E0B - Amber for warning states

3. Typography:
   Font Family: Poppins (imported via Google Fonts), system-ui fallback
   Font Sizes: 
     - Base: 16px (text-base)
     - H1: 24px (text-2xl, text-3xl, text-4xl)
     - H2: 20px (text-xl)
     - H3: 18px (text-lg)
   Font Weights: Regular (font-normal), Medium (font-medium), Bold (font-bold)

4. Layout & Spacing:
   Main Layout: CSS Grid for structure (grid, grid-cols-12)
   Component Layout: Flexbox for alignment (flex, items-center, justify-between)
   Spacing: 16px base unit (p-4, m-4), 8px for smaller gaps (p-2, m-2)
   Container: Max-width 1280px (max-w-7xl), centered, responsive padding

5. Component Styles:
   Buttons: 
     - Primary: bg-teal-600, hover:bg-teal-500, text-white, rounded-lg
     - Secondary: bg-gray-300, hover:bg-gray-400, text-gray-700
     - Focus: 2px teal focus ring (focus:ring-2 focus:ring-teal-600)
   
   Form Inputs: 
     - Border: 1px gray border (border-gray-300)
     - Rounded: 4px corners (rounded-lg)
     - Focus: Teal ring and border (focus:ring-teal-600 focus:border-teal-600)
     - Shadow: Subtle shadow (shadow-sm)
   
   Cards: 
     - Background: Off-white (bg-white)
     - Rounded: 12px corners (rounded-xl)
     - Shadow: Light shadow (shadow-md)
     - Hover: Slight scale effect (hover:scale-105)
   
   Navigation: 
     - Sidebar: Dark gray background (bg-gray-950)
     - Text: White text, teal hover background (hover:bg-teal-600)
     - Active state: Full teal background (bg-teal-600)
   
   Tables: 
     - Headers: Teal background (bg-teal-600) with white text
     - Rows: Alternating colors (bg-white, bg-gray-50)
     - Hover: Light gray hover (hover:bg-gray-50)

6. Responsive Design:
   Mobile-first approach with breakpoints:
     - sm: 640px
     - md: 768px  
     - lg: 1024px
   Sidebar: Collapses on mobile (hidden md:block)
   Cards/Grids: Flexible layouts (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

7. Interactive Elements:
   Hover Effects: 
     - Scale transformations (hover:scale-105)
     - Color transitions (transition-colors)
     - Shadow changes (hover:shadow-lg)
   
   Focus States: 
     - 2px teal outline (focus:ring-2 focus:ring-teal-600)
     - Consistent across all interactive elements
   
   Loading States: 
     - Teal spinner (animate-spin, border-teal-600)
     - Smooth animations with duration-300

8. Custom Utilities Added:
   - Extended teal color palette (50-900 shades)
   - Custom gray scale for dark sidebar/nav
   - Poppins font family integration
   - Status color variables for consistent theming

9. Framework Compatibility:
   - React components with Lucide React icons
   - Consistent icon sizing (h-4 w-4, h-5 w-5, h-6 w-6)
   - Responsive image handling
   - Accessible color contrast ratios

10. Key Styling Decisions:
    - Dark sidebar provides visual hierarchy and contrast
    - Teal primary color creates modern, professional appearance
    - Subtle hover effects enhance user interaction feedback
    - Card-based layouts improve content organization
    - Consistent spacing creates visual rhythm
    - Focus rings ensure accessibility compliance
*/

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
        body: ["Poppins", "system-ui", "sans-serif"],
      },
      colors: {
        // New Dark Teal Color Scheme
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488", // Primary Dark Teal
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        // Enhanced Gray Scale for Dark Sidebar/Nav
        gray: {
          50: "#f9fafb", // Off-White Background
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af", // Light Gray for secondary text
          500: "#6b7280", // Soft Gray for secondary
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827", // Dark Gray for primary text
          950: "#1f2a44", // Dark Gray for sidebar/nav
        },
        // Status Colors
        status: {
          success: "#10b981",
          error: "#ef4444",
          warning: "#f59e0b",
        },
        // Legacy support
        primary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // Maps to teal-600
          600: "#0d9488", // Primary Dark Teal
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
        secondary: {
          50: "#f9fafb", // Off-White Background
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af", // Light Gray for secondary text
          500: "#6b7280", // Soft Gray for secondary
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827", // Dark Gray for primary text
          950: "#1f2a44", // Dark Gray for sidebar/nav
        },
        background: "#f9fafb", // Off-White Background
        surface: "#ffffff", // Card Background
        border: "#e5e7eb", // Border color
        text: {
          primary: "#111827", // Dark Gray for primary text
          secondary: "#9ca3af", // Light Gray for secondary text
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        cyan: "0 10px 25px -3px rgba(6, 182, 212, 0.3), 0 4px 6px -2px rgba(6, 182, 212, 0.05)",
      },
    },
  },
  plugins: [],
};

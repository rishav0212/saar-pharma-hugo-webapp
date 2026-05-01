---
trigger: always_on
---

# SAAR Biotech Hugo Site - Project Rules

## 1. Core Architecture & Folder Strictness
* **Single Source of Truth (CSS Variables):** Never hardcode colors, fonts, or design values. Always use the centralized `assets/css/base/variables.css` to define palettes, fonts, and recurring designs.
* **Modular CSS Structure:** Maintain the established CSS architecture. Global styles go in `base/`, reusable UI elements go in `assets/css/components/` (e.g., cards, forms, modals), and page-specific layouts go in `assets/css/sections/`. Do not bloat global stylesheets.
* **Modular JavaScript:** Do not dump all logic into a single file. Actively use `assets/js/modules/` (e.g., `animations.js`, `products.js`, `ui.js`) to keep JavaScript component-driven and maintainable.
* **Reusability (DRY):** Actively identify and utilize reusable HTML/CSS/JS components. Do not repeat code or classes. 

## 2. Design, UI & UX (The "Vibe")
* **Theme Colors:** The primary theme color is **Teal**. Use complementary/contrasting colors that look great around teal, but teal must remain the focal point. Manage all through PostCSS/variables.
* **Unique Aesthetics:** The design must break away from "typical" or boring pharma/marketing websites. It must be highly interactive, modern, visually appealing, and feel premium.
* **Page-to-Page Consistency vs. Uniqueness:** The overall brand theme must be consistent across the site, but **each page must feel unique in its aesthetics**. Do not copy-paste page layouts; sections should look distinctly different while adhering to the global theme.
* **Typography:** Ensure fonts are properly loaded, styled, and consistent across all viewports to solve any font discrepancies.
* **Animations & Transitions:** The site must feel incredibly smooth—never laggy. **Do not implement custom complex animations from scratch.** Actively use established, high-quality JS libraries (e.g., GSAP, AOS) imported properly into `assets/js/modules/animations.js` for smooth scroll, transitions, and component animations. 

## 3. SEO Mastery & Content Engineering (Top Priority)
* **Rank-Driven Hierarchy:** Every page must have a perfect semantic HTML structure: a single `<h1>`, followed by logical `<h2>` and `<h3>` tags to maximize search engine parsing.
* **SEO-Rich Content Formatting:** Break content into scannable formats (bullet points, bolded keywords, detailed tables) to capture "Featured Snippets" and improve B2B readability.
* **Internal Backlinking (Authority):** Every page must include strategic internal links to related therapeutic categories, manufacturing units, or the brief planner to build site authority.
* **Metadata & JSON-LD Excellence:** Every page MUST have unique Meta Titles, Meta Descriptions, and perfect JSON-LD schema (Organization, Product, Service, or FAQ) for maximum SERP ranking.
* **Medical Accuracy & Keywords:** Actively research specific therapeutic categories and DCGI-approved molecules to ensure medical accuracy. Integrate high-intent keywords naturally (e.g., "third-party manufacturing," "contract manufacturing in Baddi," "WHO-GMP facility") to attract B2B partners.
* **Performance Balance:** Ensure JS libraries and CSS are processed efficiently via Hugo pipes and PostCSS to maintain top technical SEO scores.

## 4. Responsive Fidelity & UX Technicals
* **Viewport Stability:** Ensure 100% stability across all breakpoints. Strictly prevent horizontal overflow and Layout Shifts (CLS).
* **Fluid Layouts:** Use fluid spacing and container logic that remains stable during user zoom (up to 200%).
* **Single-Session Logic:** Entrance animations (e.g., logo) play only once per visit via `sessionStorage`.
* **Context-Aware Modals:** Pre-fill enquiry forms with product/category data based on the user's trigger point.

## 5. Content & Maintainability (Hugo Specifics)
* **Data-Driven Content:** Leverage the `data/` folder (like the existing `home.json`) for structured content. This ensures non-tech personnel can easily update arrays, lists, or global variables without touching HTML or Markdown.
* **Products Architecture:** All new products must follow the strict Markdown and Frontmatter structure established in `content/products/` (e.g., matching the schema of `paracetamol-tablets.md`).
* **Content Generation:** Use existing SAAR Biotech context (from old sites) but rewrite it to be unique per page. Avoid duplicate content across different pages.

## 6. Strict Code Output & Preservation
* **Zero Deletion:** When updating a file, absolutely NEVER remove existing code, functionality, or logic unless explicitly instructed.
* **Complete Files:** Always return the COMPLETE file content after making updates. Do not truncate the code or say "rest of the code here."
* **Optimized Features:** Always provide fully optimized code that includes every single feature requested.
* **Commenting Standards:** Never remove older comments. Add medium-level comments explaining the "why" behind complex logic. Do not write trivial comments like "fixed this" or "update." Function documentation should describe the whole function's purpose, not just recent edits.
# SAAR Biotech Hugo Site - Project Rules

## 1. Core Architecture & Code Quality
* **Single Source of Truth:** Never hardcode colors, fonts, or design values directly into components. Always use a centralized theme file (e.g., Tailwind config or CSS variables) to define palettes, fonts, and recurring designs.
* **Reusability (DRY):** Actively identify and utilize reusable HTML/CSS/JS components. Do not repeat code or classes. Maximum functionality should be modularized.
* **Structural Consistency:** Maintain a scalable folder structure. Ensure all new pages (e.g., Products, About) follow the same clean, modular organization established for the Home page.
* **Refactoring:** If structural inconsistencies or code smells are detected, suggest a better architectural approach to keep the codebase clean and maintainable.

## 2. Design, UI & UX (The "Vibe")
* **Theme Colors:** The primary theme color is **Teal**. Use complementary/contrasting colors that look great around teal, but teal must remain the focal point.
* **Unique Aesthetics:** The design must break away from "typical" or boring pharma/marketing websites. It must be highly interactive, modern, visually appealing, and feel premium.
* **Theme Consistency vs. Design Uniqueness:** The overall brand theme (colors, typography, spacing logic) must be 100% consistent across the entire site. However, **each page must feel unique in its layout and aesthetics**. Do not copy-paste section layouts between pages; sections should look distinctly different while adhering to the global theme.
* **Typography:** Ensure fonts are properly loaded, styled, and consistent across all viewports to solve any font discrepancies.
* **Animations & Transitions:** The site must feel incredibly smooth—never laggy. **Do not implement custom complex animations from scratch.** Actively use established, high-quality JS libraries (e.g., GSAP, AOS, etc.) for smooth scroll, transitions, and component animations. 

## 3. SEO Mastery & Content Engineering (Top Priority)
* **Rank-Driven Hierarchy:** Every page must have a perfect semantic structure: a single `<h1>`, followed by logical `<h2>` and `<h3>` tags to maximize search engine parsing.
* **SEO-Rich Content Formatting**: Break content into scannable formats (bullet points, bolded keywords, detailed tables) to capture "Featured Snippets" and improve B2B readability.
* **Internal Backlinking (Authority)**: Every page must include strategic internal links to related therapeutic categories, manufacturing units, or the brief planner to build site authority.
* **Metadata & JSON-LD Excellence**: Every page MUST have unique Meta Titles, Meta Descriptions, and perfect JSON-LD schema (Organization, Product, Service, or FAQ) for maximum SERP ranking.
* **Content Research Sources**: MUST use the following sources for accuracy and context:
  - https://saarbiotech.in
  - https://old.saarbiotech.in
  - https://chipper-custard-705a1e.netlify.app/
* **Medical Accuracy:** Actively research specific therapeutic categories and DCGI-approved molecules (e.g., Aceclofenac, Paracetamol, etc.) to ensure medical accuracy and high relevance for pharmaceutical enquiries.
* **Keyword Optimization:** Integrate high-intent keywords naturally (e.g., "third-party manufacturing," "contract manufacturing in Baddi," "WHO-GMP facility") to attract B2B partners.
* **Performance Balance:** Ensure JS libraries are implemented efficiently to maintain top technical SEO scores.

## 4. Responsive Fidelity & UX Technicals
* **Viewport Stability**: Ensure 100% stability across all breakpoints. Strictly prevent horizontal overflow and Layout Shifts (CLS).
* **Fluid Layouts**: Use fluid spacing and container logic that remains stable during user zoom (up to 200%).
* **Single-Session Logic**: Entrance animations (e.g., logo) play only once per visit via `sessionStorage`.
* **Context-Aware Modals**: Pre-fill enquiry forms with product/category data based on the user's trigger point.

## 5. Content & Maintainability (Hugo Specifics)
* **Non-Tech Friendly:** Structure Hugo content files (Markdown/Frontmatter) so semi-tech or non-tech personnel can easily update content without breaking the design.
* **Content Generation:** Use existing SAAR Biotech context but rewrite it to be unique per page. Avoid duplicate content across different pages.

## 6. Strict Code Output & Preservation
* **Zero Deletion:** When updating a file, absolutely NEVER remove existing code, functionality, or logic unless explicitly instructed.
* **Complete Files:** Always return the COMPLETE file content after making updates. Do not truncate the code or say "rest of the code here."
* **Optimized Features:** Always provide fully optimized code that includes every single feature requested.
* **Commenting Standards:** Never remove older comments. Add medium-level comments explaining the "why" behind complex logic. Do not write trivial comments like "fixed this" or "update." 
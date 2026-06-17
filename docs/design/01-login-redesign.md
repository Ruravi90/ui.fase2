# Frontend Design Implementation Plan

The current application is missing its styles. Since this system is for a **Spa and Clinic**, we will avoid generic, heavy "commercial SaaS" looks. Instead, we will build a distinctive, premium aesthetic that feels calming, organic, trustworthy, and boutique.

## Proposed Design System: "Serene & Organic"

**Vibe:** Calming, clean, elegant, and grounded.

**1. Color Palette (Earthy & Light)**
- **Background:** `#FAF9F6` (Alabaster / Warm off-white) to feel natural, not sterile.
- **Primary Accent:** `#84A59D` (Soft Sage Green) for buttons and active states.
- **Secondary Accent:** `#F28482` (Subtle Blush/Terracotta) for delicate highlights or hover states.
- **Text (Primary):** `#3A4A40` (Deep Forest Green/Charcoal) for a softer, more organic contrast than pure black.
- **Text (Muted):** `#8C9C93` (Muted Sage).
- **Surface:** `#FFFFFF` with a very soft, diffuse shadow (`rgba(58, 74, 64, 0.05)`).

**2. Typography**
- **Display/Headings:** `Cormorant Garamond` (Google Font) - A beautiful, high-contrast serif that feels premium, boutique, and elegant.
- **Body/Inputs:** `Outfit` or `Inter` (Google Font) - A clean, modern, and highly legible sans-serif for functional UI elements.

**3. Layout Concept**
- A **split-screen layout** (or a beautifully centered, airy container). 
- One side will contain the minimalist login form with elegant, understated inputs (e.g., only bottom borders, or very light background fills with no harsh borders).
- The other side will feature a serene, organic abstract visual (a soft gradient mesh combining sage, warm cream, and subtle blush, resembling natural light or water).
- Lots of whitespace and breathing room around elements to convey a sense of calm.

**4. Signature Element**
- The typography pairing (Serif heading + elegant sans-serif body) combined with the custom input styling (floating labels, smooth line transitions) will serve as the signature. 
- A subtle "fade-in and slide-up" micro-animation on page load to make the entrance feel gentle and welcoming.

## Proposed Changes

### `src/index.html`
- Add Google Fonts links for `Cormorant Garamond` and `Outfit`.

### `src/styles.scss`
- Define CSS custom properties (variables) for the "Serene" color palette.
- Add global resets and body styling (background color, default typography).
- Define global button styles (elegant, rounded, soft transitions).

### `src/app/views/login/login.component.html`
- Restructure the HTML to support a split layout or an elegant centered form.
- Remove standard Bootstrap structural classes (`card-group`, `input-group-prepend`) to allow for completely custom, lightweight styling.
- Replace generic icons with cleaner structures, or use elegant inline SVG shapes if necessary.

### `src/app/views/login/login.component.scss` (New)
- Specific layout styles for the login container (split screen / flexbox).
- Custom input styling (e.g., inputs with just a bottom border that animates on focus).
- The organic, soft gradient mesh background for the visual side of the screen.
- Entry animations.

## Verification Plan
1. Apply the CSS and HTML structure changes.
2. Ensure the Angular development server automatically reloads.
3. Visually verify that the aesthetic matches the "Spa and Clinic" vibe (calming, not generic corporate).

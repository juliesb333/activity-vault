---
name: Academic Pulse
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#47464e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#77767f'
  outline-variant: '#c8c5cf'
  surface-tint: '#5a5b84'
  primary: '#020229'
  on-primary: '#ffffff'
  primary-container: '#1a1b41'
  on-primary-container: '#8283af'
  inverse-primary: '#c2c2f2'
  secondary: '#743dc9'
  on-secondary: '#ffffff'
  secondary-container: '#a874ff'
  on-secondary-container: '#39007a'
  tertiary: '#00090a'
  on-tertiary: '#ffffff'
  tertiary-container: '#002426'
  on-tertiary-container: '#00969c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c2c2f2'
  on-primary-fixed: '#16173d'
  on-primary-fixed-variant: '#42436b'
  secondary-fixed: '#ecdcff'
  secondary-fixed-dim: '#d5bbff'
  on-secondary-fixed: '#270057'
  on-secondary-fixed-variant: '#5b1daf'
  tertiary-fixed: '#63f7ff'
  tertiary-fixed-dim: '#00dce5'
  on-tertiary-fixed: '#002021'
  on-tertiary-fixed-variant: '#004f53'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

This design system is engineered for the high-velocity world of modern higher education. It targets university students who demand efficiency, clarity, and a sense of progress. The aesthetic sits at the intersection of **High-Contrast Bold** and **Modern Corporate**, utilizing deep saturation and sharp accents to create an atmosphere of digital fluency.

The visual narrative focuses on "Energetic Professionalism." It avoids the dryness of traditional academia in favor of a cutting-edge EdTech feel—fast, responsive, and motivating. By pairing substantial whitespace with electric highlights, the system directs focus toward action and achievement, ensuring the interface feels like a tool for success rather than just a repository of information.

## Colors

The palette leverages high-value contrast to establish a clear information hierarchy. 

*   **Deep Indigo (#1A1B41):** Used for primary headings, navigation backgrounds, and high-importance structural elements to provide a grounded, professional foundation.
*   **Electric Purple (#7A44CF):** The primary action color. It drives engagement through gradients and active states, representing creativity and ambition.
*   **Neon Cyan (#00F5FF):** Reserved for precision accents—notifications, progress bars, and hover highlights. It provides the "cutting-edge" energy.
*   **Neutral System:** A crisp white background maintains readability, supported by light gray surfaces (#F8F9FA and #F1F3F5) to define content areas without introducing visual clutter.

## Typography

The typographic system utilizes **Space Grotesk** for headlines to inject a technical, forward-thinking character into the interface. Its geometric construction feels modern and authoritative. For body text, **Inter** provides maximum legibility across all screen densities, handling complex data and long-form study materials with ease.

Headlines should utilize tight tracking and generous line-height to maintain a "poster" quality, while body text is optimized for rhythmic flow. Use Indigo for primary text and a 60% opacity variant for secondary metadata.

## Layout & Spacing

This design system employs a **12-column fixed grid** for desktop, centered within the viewport with a maximum width of 1280px. The spacing rhythm is based on an 8px linear scale, ensuring mathematical harmony between components.

Layouts should favor "Spacious Minimalism"—using generous margins (lg/xl) between major sections to prevent cognitive overload. Gutters are set to 24px to provide clear separation for card-based content. Use vertical rhythm to group related information, with smaller gaps (sm/md) between labels and inputs.

## Elevation & Depth

Depth is handled through **Ambient Shadows** and **Tonal Layering**. Unlike traditional flat design, this system uses depth to indicate interactivity and importance:

1.  **Base Layer:** Pure white (#FFFFFF) for the main canvas.
2.  **Surface Layer:** Light gray (#F8F9FA) for background containers or sidebar navigation.
3.  **Raised Cards:** Use a soft, diffused shadow (0px 10px 30px rgba(26, 27, 65, 0.05)). This indigo-tinted shadow keeps the UI feeling cohesive.
4.  **Interactive Hover:** When a card or button is hovered, the shadow should deepen and expand slightly, and the element may translate -2px on the Y-axis to provide tactile feedback.

## Shapes

The shape language is consistently **Rounded**, striking a balance between friendly approachability and professional precision. 

*   **Standard Components:** Buttons and input fields use a 0.5rem (8px) radius.
*   **Large Containers:** Cards and modals utilize 1rem (16px) to emphasize their role as distinct content areas.
*   **Accent Shapes:** Small tags or status indicators may use pill-shapes (full round) to distinguish them from functional inputs.

## Components

### Buttons
Primary buttons feature a subtle linear gradient from **Electric Purple (#7A44CF)** to a slightly darker shade, with a high-contrast white label. Secondary buttons use an Indigo outline with a transparent fill. All buttons require a 0.2s transition on hover.

### Cards
Spacious cards are the primary content vehicle. They feature 24px internal padding, the "Raised Card" shadow, and a 1px border in a very light gray to maintain definition against white backgrounds.

### Navigation Bar
A clean, top-mounted bar. It uses a transparent or white background with Indigo text links. Active states are indicated by a 2px **Neon Cyan** bottom border.

### Input Fields
Inputs use the light gray surface color with a subtle 1px border. On focus, the border transitions to Electric Purple with a soft Neon Cyan outer glow (2px).

### Progress & Accents
Use **Neon Cyan** for progress bars, toggle switches, and success indicators. This color should be used sparingly but consistently to denote "movement" or "completion."

### Chips/Tags
Small, low-profile badges using a 10% opacity Electric Purple fill with 100% opacity Purple text, utilized for categorizing courses or topics.
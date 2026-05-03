---
name: High-Energy Academic Nexus
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c9c5d0'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#928f99'
  outline-variant: '#47464f'
  surface-tint: '#c7c0f9'
  primary: '#c7c0f9'
  on-primary: '#2f2a59'
  primary-container: '#120b3b'
  on-primary-container: '#7e78ad'
  inverse-primary: '#5e588a'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#00171d'
  on-tertiary-container: '#008ba2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c7c0f9'
  on-primary-fixed: '#1a1443'
  on-primary-fixed-variant: '#464171'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-page: 64px
  card-padding: 24px
---

## Brand & Style

The brand personality is authoritative yet hyper-modern, bridging the gap between traditional academic excellence and the fast-paced digital future of the modern university student. It targets a demographic that balances heavy workloads with a desire for seamless, tech-forward experiences.

This design system utilizes a **Modern-High Contrast** style influenced by **Glassmorphism**. It focuses on a "Digital Ivory Tower" aesthetic—clean, structured, and deep, but punctuated by vibrant, electric energy. The UI should feel expansive and premium, using light-refractive elements and bold typography to create a sense of momentum and clarity.

## Colors

The palette is anchored by **Deep Indigo (#120B3B)**, which serves as the primary canvas color for the dark-mode environment. This provides a sophisticated, scholarly depth. 

**Vibrant Purple (#8B5CF6)** acts as the secondary color, used for primary actions and highlights to inject high energy. **Electric Cyan (#06B6D4)** is the tertiary accent, reserved for "live" data, progress indicators, and interactive feedback. Surface colors utilize semi-transparent variations of these hues to maintain a cohesive, atmospheric depth.

## Typography

This design system exclusively employs **Space Grotesk** across all hierarchy levels to achieve a technical and futuristic look. 

Headlines use heavy weights (Bold/700) with tight letter-spacing to create a "blocky," high-impact visual rhythm suitable for titles and important deadlines. Body text remains legible but maintains its geometric character, while labels utilize uppercase styling and increased tracking to differentiate functional UI metadata from content.

## Layout & Spacing

The layout follows a **Fixed Grid** model optimized for desktop environments, centered within a 1440px max-width container. 

A 12-column system is utilized with generous 32px gutters to prevent visual clutter during high-density information displays (like course schedules). The spacing rhythm is based on an 8px base unit, favoring large internal paddings (24px+) to ensure the "spacious" feel requested. Whitespace—or in this case, "Indigo-space"—is treated as a first-class citizen to reduce cognitive load for students.

## Elevation & Depth

Depth is achieved through **Tonal Layers** combined with **Ambient Shadows**. 

Instead of traditional grey shadows, this system uses "Glow-Shadows"—diffused drops with a low-opacity Deep Indigo or Purple tint. Surfaces are tiered using varying degrees of background transparency:
- **Level 1 (Base):** Solid Deep Indigo.
- **Level 2 (Cards):** Semi-opaque Indigo with a subtle 1px inner stroke of Electric Cyan (at 10% opacity) to catch the light.
- **Level 3 (Modals/Popovers):** Frosted glass effect with a 20px backdrop blur and a vibrant outer glow to indicate high-level interaction.

## Shapes

The shape language is **Rounded**, balancing the technical harshness of the typography with approachable, modern containers. 

Standard components utilize a 0.5rem (8px) radius. Larger layout containers and primary cards use a more pronounced 1rem (16px) radius. This specific rounding level prevents the UI from appearing too "bubbly" or "childish" while ensuring it feels contemporary and distinct from legacy university software.

## Components

**Buttons:** 
Primary buttons feature a solid Vibrant Purple fill with a subtle "Electric Cyan" outer glow on hover. Secondary buttons use an ghost style with a 2px stroke and bold typography.

**Cards:** 
Cards are the primary container for student data (GPA, Course Progress, etc.). They feature a subtle glass effect and use the 1rem rounded corner. Headlines within cards are consistently "Headline-MD."

**Chips/Badges:** 
Used for course tags or status (e.g., "Active," "Deadline"). These use high-contrast Electric Cyan backgrounds with dark text for maximum visibility.

**Input Fields:** 
Fields are dark-filled with a vibrant border-bottom that "activates" by expanding into a full border-glow when focused.

**Additional Components:**
- **Energy Progress Bars:** Thick, Electric Cyan progress indicators with a trailing blur effect to visualize academic completion.
- **Glass Navigation Rail:** A vertical navigation bar on the left with blurred backgrounds and high-contrast active states.
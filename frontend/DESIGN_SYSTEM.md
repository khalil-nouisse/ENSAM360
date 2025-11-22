# ENSAM360° Design System

## 1. Brand Identity & Philosophy
**"Academic Innovation meets Digital Immersion"**
The design language of ENSAM360° reflects a balance between the prestige of an engineering school and the cutting-edge nature of virtual reality. It uses a clean, tech-forward aesthetic with glassmorphism effects and smooth motion to create a premium user experience.

---

## 2. Color Palette

### Primary Colors
*Used for main actions, active states, and brand highlights.*
- **ENSAM Blue (Primary)**: `hsl(221 83% 53%)`
  - A bright, confident blue that signifies technology and trust.
  - Used in: Call-to-Action buttons, active navigation items, icons.

### Neutral Colors (Light Mode)
*Used for structure and readability.*
- **Background**: `hsl(210 40% 98%)` (Cool Off-White) creates a modern, airy feel.
- **Foreground (Text)**: `hsl(222 47% 11%)` (Deep Navy) for high contrast and readability.
- **Muted/Secondary**: `hsl(210 40% 96.1%)` for subtle borders and backgrounds.

### Neutral Colors (Dark Mode)
*Used for immersive night viewing.*
- **Background**: `hsl(222 47% 11%)` (Deep Space Blue) reduces eye strain.
- **Foreground (Text)**: `hsl(210 40% 98%)` (Soft White).
- **Surface**: `hsl(217 32% 17%)` for cards and floating elements.

---

## 3. Typography
**Font Family**: `Geist Sans` (Modern, geometric, highly legible)

### Hierarchy
- **Display Headings (`text-4xl` to `text-6xl`)**: Bold, tight tracking (`tracking-tighter`). Used for Hero sections.
- **Section Titles (`text-3xl`)**: Semi-bold. Used for feature block headers.
- **Body Text (`text-lg` / `text-base`)**: Regular weight, relaxed line height (`leading-relaxed`) for comfortable reading.
- **UI Labels (`text-sm`)**: Medium weight. Used in buttons and navigation.

---

## 4. UI Components & Effects

### Glassmorphism
A signature style of the app to imply depth and transparency.
- **Class**: `bg-background/80 backdrop-blur-md border-b`
- **Usage**: Sticky navigation bars, floating cards, and overlays.

### Cards & Surfaces
- **Shape**: `rounded-xl` or `rounded-2xl` (Large border radius) for a friendly, approachable look.
- **Border**: Thin, subtle borders (`border-border`) to define edges without harsh lines.
- **Shadow**: `shadow-lg` on hover to create elevation.

### Buttons
- **Primary**: Solid Blue background, White text, rounded corners.
  - `bg-primary text-primary-foreground hover:bg-primary/90`
- **Secondary/Outline**: Transparent background with border.
  - `border border-input bg-background hover:bg-accent`

---

## 5. Animation & Interaction
*Motion is used to convey state and quality.*

### Micro-interactions
- **Hover States**: Elements lift and glow slightly on interaction.
  - `hover:scale-105 transition-transform duration-300`
- **Buttons**: Slight opacity change on hover (`hover:bg-primary/90`).

### Entrance Animations
- **Fade In**: Elements gently appear when loading.
  - `animate-in fade-in slide-in-from-bottom-4 duration-1000`
- **Stagger**: Content loads sequentially (Heading → Text → Buttons).

---

## 6. Consistency Checklist
*Follow these rules when adding new pages:*

1.  **Layout**: Always wrap main content in a `container` with `mx-auto` and `px-4`.
2.  **Spacing**: Use consistent spacing tokens (`py-12`, `gap-8`, `my-6`).
3.  **Dark Mode**: Always verify designs in dark mode. Use `bg-background` and `text-foreground` instead of hardcoded colors.
4.  **Images**: Use rounded corners (`rounded-lg`) and `overflow-hidden` on image containers.

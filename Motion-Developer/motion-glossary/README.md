# Motion Glossary

A comprehensive React animation library with Storybook. Browse, preview, and copy animations for your projects.

## Quick Start

```bash
# Install dependencies
npm install

# Start Storybook
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) to browse the animation library.

## Tech Stack

- **React 18+** - Functional components with hooks
- **Storybook 8** - Component explorer and documentation
- **Framer Motion** - Physics-based animations
- **TypeScript** - Full type safety
- **CSS Modules** - Scoped styling

## Categories

### 1. Entrances & Exits
Bringing elements into view and removing them gracefully.
- FadeIn, FadeInUp, FadeInDown, FadeInLeft, FadeInRight
- FadeInScale, ScaleIn, PopIn
- SlideIn (all directions)
- StaggeredChildren

### 2. Attention & Emphasis
Drawing the user's eye to important elements.
- Pulse, Shake, Bounce, Float

### 3. Feedback & State
Communicating system status and response to user actions.
- ButtonPress, ButtonRipple
- Spinner, LoadingDots, SkeletonPulse
- SuccessCheck, ToggleSwitch

### 4. Text & Typography
Bringing text to life.
- Typewriter, TextReveal, CountUp

### 5. Scroll-Driven
Animations tied to scroll position and viewport entry.
- ScrollFadeIn, ScrollProgressBar

### 6. Ambient Backgrounds
Subtle motion that gives pages life.
- GradientBackground

## Usage

Each animation can be imported and used in your React projects:

```tsx
import { FadeInUp, PopIn, ButtonPress } from 'motion-glossary';

function MyComponent() {
  return (
    <FadeInUp duration={0.5} delay={0.1}>
      <h1>Welcome!</h1>
    </FadeInUp>
  );
}
```

## Features

- **Accessible** - All animations respect `prefers-reduced-motion`
- **Copy-Paste Ready** - View and copy the code for any animation
- **Customizable** - Adjust duration, easing, and other parameters
- **Both Approaches** - Shows Framer Motion and pure CSS versions

## Project Structure

```
src/
├── animations/
│   ├── entrances-exits/
│   ├── attention-emphasis/
│   ├── feedback-state/
│   ├── text-typography/
│   ├── scroll-driven/
│   └── ambient-backgrounds/
├── components/
│   ├── DemoContainer/
│   ├── CodeBlock/
│   └── UsageNotes/
├── hooks/
│   ├── useReducedMotion.ts
│   ├── useInView.ts
│   ├── useScrollProgress.ts
│   └── useMousePosition.ts
└── utils/
    ├── easings.ts
    └── springs.ts
```

## Adding New Animations

Each animation follows this structure:

1. Create a folder under the appropriate category
2. Add the component file with the animation logic
3. Add a stories file with demos and documentation
4. Export from the category's index file

## License

MIT

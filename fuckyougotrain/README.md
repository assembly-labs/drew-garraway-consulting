# Can't Stop Won't Stop 💪

A no-nonsense, time-based workout app for men who don't quit. Features non-stoppable timers, motivational personas, and automatic PR tracking.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

Creates optimized files in `dist/`

## 📱 Features

- ✅ **Non-Stoppable Timer** - Countdown that NEVER pauses (with easter egg)
- ✅ **Day-Based Workouts** - Monday/Friday/Weekend specific training
- ✅ **30 Exercises** - Curated library for men 40+
- ✅ **9 Persona System** - Motivational messages from Goggins, Jocko, Arnold, and more
- ✅ **PR Detection** - Automatic personal record tracking
- ✅ **Mobile-First** - Designed for phone screens
- ✅ **Local-First** - All data stored in browser

## 🎯 Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **React Router 6** - Navigation
- **Tailwind CSS** - Styling
- **LocalStorage** - Data persistence

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Button, Input, Timer, Modal
│   └── workout/     # ExerciseModule, SetInput, PersonaMessage
├── pages/           # Full-page components
├── hooks/           # Custom React hooks (useTimer, usePersona, etc.)
├── context/         # Global state (WorkoutContext, UserContext)
├── services/        # API wrapper (LocalStorage)
├── utils/           # Validation, PR detection, helpers
└── data/            # Exercises, personas, templates
```

## 🔥 Key Features

### The Pause Button Easter Egg
Try to pause during a workout. You'll see why you can't. 😈

### Persona System
9 motivational personas with weighted distribution:
- David Goggins (25%) - Confrontational accountability
- Jocko Willink (20%) - Disciplined leadership
- Arnold Schwarzenegger (12%) - High energy champion
- Sylvester Stallone (12%) - Underdog fighter
- John Danaher (10%) - Analytical precision
- Bruce Lee (10%) - Philosophical warrior
- Renzo Gracie (10%) - Fighter mentality
- Rickson Gracie (8%) - Zen master
- Chuck Norris (3%) - Rare easter eggs

### Workout Templates
- **Monday** - Power day (heavy compounds)
- **Friday** - Strength day (balanced)
- **Weekend** - Warrior mode (functional fitness)

## 🚀 Deployment

### Netlify (Recommended)
1. Push code to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

Already configured with:
- `netlify.toml` - Build settings
- `public/_redirects` - SPA routing

### Other Platforms
The app is a standard Vite SPA and works on:
- Vercel
- GitHub Pages
- Any static host

## 🎮 Usage Flow

1. **Landing** → Choose Start Workout or View History
2. **Day Selection** → Pick Monday/Friday/Weekend
3. **Time Selection** → Choose 60/45/30 minutes
4. **Preview** → Review exercise plan
5. **Active Workout** → Timer starts, no stopping
6. **Post-Workout Edit** → Review & save
7. **History** → View past workouts

## ⚙️ Configuration

All exercises from `exercise_library_40s.md`
All personas from `product_voice_messaging_tone_matrix.md`

### Data Files
- `src/data/exercises.json` - 30 exercises
- `src/data/voiceMatrix.json` - 9 personas with messages
- `src/data/workoutTemplates.json` - Day-specific plans

## 🐛 Troubleshooting

**Timer not starting?**
- Check console for errors
- Ensure `useTimer` hook is called in ActiveWorkout

**Exercises not loading?**
- Verify `exercises.json` format
- Check `dayType` matches template

**LocalStorage full?**
- Clear data from History page
- Or: `localStorage.clear()` in console

## 📝 License

Built with 💪 by Drew Garraway

---

**Remember:** You can't stop. You won't stop.

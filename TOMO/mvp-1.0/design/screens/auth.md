# Auth Screen

Sign in or sign up with email and password.

**Code:** `tomo/src/screens/AuthScreen.tsx`
**When:** App launch (not signed in)

## Elements

### App Logo
- "TOMO" (Unbounded ExtraBold, 48px, white, 8px letter spacing)
- "友" kanji below (32px, gold)
- "BJJ TRAINING JOURNAL" subtitle (monospace, 12px, gray, uppercase)

### Mode Toggle
- Switches between Sign In and Sign Up modes
- Bottom text: "Don't have an account? Sign Up" / "Already have an account? Sign In"
- Gold-colored link text

### Email Field
- Label: "EMAIL" (uppercase, monospace, gray)
- Text input with dark background
- Placeholder: "you@email.com"
- Gold border when focused
- Email keyboard type, no auto-capitalize

### Password Field
- Label: "PASSWORD" (uppercase, monospace, gray)
- Text input with dark background, masked
- **Eye Toggle:** 44x44 button on right side to show/hide password
- Eye icon changes between open/closed states

### Forgot Password Link (sign-in mode only)
- Text: "Forgot password?" (gray, underlined)
- Sends password reset email via Supabase
- Shows "Sending..." with spinner while processing

### Submit Button
- Full-width gold button
- Text: "Sign In" or "Create Account" (black text on gold)
- Shows spinner while loading
- Disabled during submission (slightly transparent)

### Error Display
- Red error text appears below form if sign-in/sign-up fails
- Shows Supabase error message

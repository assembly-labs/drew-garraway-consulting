# About You Screen

Collects identity info: name, belt, stripes, age, gender.

**Code:** `tomo/src/screens/onboarding/AboutYouScreen.tsx`
**Phase:** Onboarding (screen 2 of 4)

## Elements

### Back Button
- Top-left, gray arrow icon (44x44 touch target)
- Goes back to Welcome Screen

### Progress Bar
- Shows 2/4 progress

### Screen Title
- "About You" (Unbounded ExtraBold, 28px, white)

### Screen Subtitle
- "Tell us a little about yourself so we can personalize your experience."
- Gray text below title

### Name Field
- Label: "FIRST NAME" (uppercase, monospace, gray)
- Text input with dark background
- Placeholder: "Your first name"
- Required

### Belt Picker
- Label: "BELT"
- 5 colored circles in a row: White, Blue, Purple, Brown, Black
- Each circle is the actual belt color
- Selected belt gets a gold border and gold background highlight
- Belt name label below each circle
- Tap triggers light haptic
- Required

### Stripes Picker
- Label: "STRIPES"
- Hint text: "0 if you don't have any yet"
- 5 square buttons: 0, 1, 2, 3, 4
- Selected stripe count gets gold background
- Only appears after belt is selected
- Defaults to 0

### Birthday Picker
- Label: "BIRTHDAY"
- Hint text: explains why age is collected (insights/projections)
- Tap opens a date spinner picker (dark theme)
- Once set, shows the date and "X years old" in gold on the right
- Must be 18+. If under 18, shows red error: "You must be 18 or older to use TOMO."
- Required

### Gender Picker
- Label: "GENDER"
- Hint text: explains personalization use (competition class, insights)
- Two pill buttons: "Male" and "Female"
- Selected gets gold background and gold text
- Required

### Continue Button
- Full-width at bottom
- Text: "Continue"
- Gold when all required fields are filled
- Gray and disabled when fields are missing
- Navigates to Your Training Screen with all entered data

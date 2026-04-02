# FEAT-008: User Profile Expansion - Test Plan

**Date:** March 30, 2026
**Tester:** Drew
**Testing Path:** Local device build (not TestFlight)
**Build Command:** `SENTRY_DISABLE_AUTO_UPLOAD=true npx expo run:ios --device`

**Pre-requisites:**
- Supabase migration applied (done by Claude)
- Test accounts removed from Supabase (done by Claude)
- Fresh install or cleared app data

---

## Test 1: Birthday Field (About You Screen)

**What you're looking for:** A new date picker below the stripes section.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1.1 | Open the app, tap Get Started, enter name + belt + stripes | Continue button should still be **disabled** (birthday is required now) |
| 1.2 | Tap the birthday field ("Select your birthday") | iOS scroll wheel date picker appears inline |
| 1.3 | Scroll to select your real birthday | The field updates with the date. Below it you see "X years old" in gold text |
| 1.4 | Try selecting a date that would make you 17 or younger | Red error text appears: "You must be 18 or older to use TOMO." Continue stays disabled |
| 1.5 | Scroll back to a valid 18+ date | Error disappears. Continue becomes enabled (if name + belt + stripes are set) |
| 1.6 | Read the microcopy above the picker | Should say: "Your age helps us adjust insights and projections to your training." |

**Pass criteria:** Cannot proceed without a valid 18+ birthday. Age shown correctly.

---

## Test 2: Gender Field (About You Screen)

**What you're looking for:** Two chips (Male / Female) below the birthday. Required.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 2.1 | Look at the gender section | Label says "GENDER" with microcopy below |
| 2.2 | Read the microcopy | Should say: "Helps personalize competition class and training insights." |
| 2.3 | Without selecting gender, check Continue | Continue should be **disabled** (gender is required) |
| 2.4 | Tap "Male" | Chip highlights gold. Continue becomes enabled (if other fields are set) |
| 2.5 | Tap "Female" | Switches to Female (can't deselect, can only switch) |
| 2.6 | With gender selected, tap Continue | Proceeds to Your Training screen |

**Pass criteria:** Gender is required. Must select one to continue. Can switch between Male/Female but can't deselect both.

---

## Test 3: Expanded Training Goals (Your Training Screen)

**What you're looking for:** 6 goal chips instead of the old 5.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 3.1 | Scroll to the "TRAINING GOALS" section | See 6 chips: Competition, Fitness, **Self-Defense**, Mental Health, **Community**, Hobby |
| 3.2 | Tap Self-Defense | Highlights gold |
| 3.3 | Tap Community | Also highlights gold (multi-select works) |
| 3.4 | Tap Self-Defense again | Deselects |
| 3.5 | Leave all goals unselected, proceed | Should work fine (goals are optional) |

**Pass criteria:** All 6 options are visible and selectable. "Other" is gone.

---

## Test 4: Body Weight Field (Your Training Screen)

**What you're looking for:** A weight input below Experience Level, with lb/kg toggle.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 4.1 | Scroll to "BODY WEIGHT (OPTIONAL)" section | See a number input, "lb" chip (selected), "kg" chip |
| 4.2 | Read the microcopy | Should say: "Helps suggest your competition weight class. Only visible to you." |
| 4.3 | Type "165" in the weight field | Below the input, gold text appears showing your IBJJF weight class (e.g., "Feather (Pena)" for men, or both men's/women's if no gender was set) |
| 4.4 | Tap "kg" toggle | The number converts automatically (165 lb becomes ~75 kg). Weight class hint updates |
| 4.5 | Tap "lb" toggle | Converts back |
| 4.6 | Clear the weight field, tap Continue | Should proceed fine (weight is optional) |
| 4.7 | Enter a weight, select gender on previous screen, come back | Weight class hint should show only your gender's class (not both) |

**Pass criteria:** Weight input works, unit conversion works, IBJJF class appears, field is skippable.

---

## Test 5: Full Onboarding Completion

**What you're looking for:** All new fields save to your profile correctly.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 5.1 | Complete full onboarding with: birthday, gender (Male), weight (165 lb), Self-Defense + Fitness goals | Chat payoff screen appears. "Start Training" works |
| 5.2 | After onboarding, navigate to Profile tab | You should see the new "Personal Info" card |

**Pass criteria:** Onboarding completes without errors. Profile loads.

---

## Test 6: Profile Screen - New Fields

**What you're looking for:** A new card below the existing info card showing Birthday, Gender, Body Weight. All three are tappable/editable.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 6.1 | Look at the Personal Info card | See three rows: Birthday, Gender, Body Weight. All have chevrons (tappable) |
| 6.2 | Tap Birthday | Edit sheet opens with a scroll wheel date picker and your current age displayed |
| 6.3 | Tap Gender | Edit sheet opens with Male/Female chips, your current selection highlighted |
| 6.4 | Tap Body Weight | Edit sheet opens with number input and lb/kg toggle |
| 6.5 | Change weight to 180, tap Save | Profile updates, shows "180 lb" |

**Pass criteria:** All three fields are tappable and editable from the profile.

---

## Test 7: Birthday Edit - Age Bracket Warning

**What you're looking for:** When changing your birthday crosses an IBJJF Masters age bracket (30, 36, 41, 46, 51, 56), you get a warning.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 7.1 | Tap Birthday on Profile | Sheet opens with scroll wheel |
| 7.2 | Change to a date that keeps you in the same age bracket | Shows a change preview (e.g., "32 years old (Adult) >>> 33 years old (Adult)"). No warning. Save works immediately |
| 7.3 | Change to a date that crosses a bracket (e.g., from 29 to 31) | Preview shows bracket change in gold text. A warning appears below: "This changes your competition age bracket..." |
| 7.4 | Tap Save with a bracket change | An alert dialog pops up: "Age Bracket Change. Changing your birthday moves you from Adult to Masters 1 (30+)..." with Cancel and "Change Birthday" buttons |
| 7.5 | Tap Cancel | Nothing changes, sheet stays open |
| 7.6 | Tap "Change Birthday" | Birthday saves, profile updates |

**Pass criteria:** No-bracket-change edits save silently. Bracket-crossing edits show a warning alert requiring confirmation.

---

## Test 8: Gender Edit - Impact Warning

**What you're looking for:** When switching from Male to Female (or vice versa), you get a warning about the impact.

| Step | Action | Expected Result |
|------|--------|-----------------|
| 8.1 | Tap Gender on Profile | Sheet opens with Male/Female chips |
| 8.2 | Your current gender is highlighted. Tap the other one | A gold warning appears below: "Switching from Male to Female will change your competition weight class and recalculate all peer comparisons." |
| 8.3 | Tap Save | Alert dialog: "Change Gender? Changing your gender will update your competition weight class, peer comparisons..." with Cancel and "Change Gender" buttons |
| 8.4 | Tap Cancel | Nothing changes |
| 8.5 | Tap "Change Gender" | Gender saves, profile updates |

**Pass criteria:** Same-gender save is silent. Gender switch triggers warning and requires confirmation.

---

## Test 9: Edge Cases

| Step | Action | Expected Result |
|------|--------|-----------------|
| 8.1 | Enter letters in weight field | Only numbers and decimals accepted |
| 8.2 | Enter very large weight (e.g., 500 lb) | Input accepts it (we constrain in PRD to 400 but don't hard-block in UI) |
| 8.3 | Navigate back and forth between About You and Your Training | All fields should persist (birthday, gender, goals, weight) |
| 8.4 | Kill and reopen app after onboarding | Profile should load correctly with all new fields |

---

## Known Limitations (Not Bugs)

- Weight class hint on the Profile screen doesn't show the IBJJF class name yet (just the weight value)
- No birthday celebration feature yet (data is stored for future use)
- Injuries/disabilities tracking is future work (FEAT-006)

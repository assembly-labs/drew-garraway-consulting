# TOMO Workflows

How screens connect to each other and what triggers transitions.

## Workflow 1: First Launch (Onboarding)

```
App opens (no account)
  |
  v
Auth Screen -- sign up --> Welcome Screen
  |                            |
  | (sign in, already          v
  |  onboarded)           About You Screen
  |                            |
  v                            v
Tab Bar (Journal)         Your Training Screen
                               |
                               v
                          Get Started Screen
                               |
                               v
                          Tab Bar (Journal)
```

**Triggers:**
- Auth Screen -> Welcome: Successful sign-up (new user, no profile)
- Auth Screen -> Tab Bar: Successful sign-in (existing user with profile)
- Welcome -> About You: Tap "Get Started"
- About You -> Your Training: Tap "Continue" (all required fields filled)
- Your Training -> Get Started: Tap "Continue" (gym selected)
- Get Started -> Tab Bar: Tap "Start Training" (after chat payoff completes)

## Workflow 2: Log a Session (Voice Path)

```
Tap Log Button (gold + in tab bar)
  |
  v
Entry Phase -- tap "Record Session" --> Recording Phase
  |                                         |
  | (tap "Just type it")                    | (tap "Stop Recording")
  |                                         v
  |                                    Processing Phase
  |                                         |
  |                    (transcribe + extract, or timeout/skip)
  |                                         |
  +<----------------------------------------+
  |
  v
Review Phase -- tap "Save Session" --> Success Phase (Quote, 4 sec)
  |                                         |
  | (tap "Cancel")                          | (auto-dismiss or double-tap)
  v                                         v
Journal List                           Journal List
```

**Voice-preference shortcut:** If the user chose "Voice First" during onboarding, the Entry Phase is skipped entirely. Recording starts automatically when they tap the Log button.

**Triggers:**
- Tab Bar Log Button -> Entry Phase: Always (unless voice preference)
- Tab Bar Log Button -> Recording Phase: Voice preference users skip entry
- Entry Phase -> Recording Phase: Tap "Record Session" button
- Entry Phase -> Review Phase: Tap "Just type it" (skips recording, empty transcript)
- Recording Phase -> Processing Phase: Tap "Stop Recording"
- Recording Phase -> Entry Phase: Tap "Cancel" (with confirmation if > threshold)
- Processing Phase -> Review Phase: Pipeline completes (or timeout/skip)
- Review Phase -> Success Phase: Tap "Save Session" (save succeeds)
- Review Phase -> Journal List: Tap "Cancel" (discards everything)
- Success Phase -> Journal List: Auto-dismiss after 4 seconds (or double-tap)

## Workflow 3: Browse Journal

```
Journal List -- tap a session card --> Session Detail
  |                                        |
  | (pull down)                            | (tap back arrow)
  v                                        v
Refresh sessions                      Journal List
```

**Triggers:**
- Journal List -> Session Detail: Tap any session card
- Session Detail -> Journal List: Tap back button (top-left)
- Journal List refresh: Pull-to-refresh gesture

## Workflow 4: Edit a Saved Session

```
Session Detail -- tap any editable section --> Edit Sheet (bottom modal)
                                                   |
                                              (tap "Save" or "Cancel")
                                                   |
                                                   v
                                              Session Detail (updated)
```

**Editable sections on Session Detail:**
- Date/time
- Training mode + kind + duration
- Notes
- Lesson topic
- Techniques
- Sparring details (rounds, submissions given, submissions received)
- Injuries
- Instructor
- Warm-up

**Triggers:**
- Tap any section -> Edit Sheet opens for that section
- Save in Edit Sheet -> Updates database, refreshes Session Detail
- Cancel in Edit Sheet -> Closes sheet, no changes

## Workflow 5: Delete a Session

```
Session Detail -- scroll to bottom, tap "Delete this session" --> Confirmation Alert
                                                                      |
                                                          (tap "Delete" or "Cancel")
                                                                      |
                                                        Delete: Journal List (session removed)
                                                        Cancel: Session Detail (no change)
```

## Workflow 6: Switch Gym (Temporary)

```
Entry Phase or Review Phase -- tap Gym Chip --> Gym Picker Sheet (modal)
                                                     |
                                                (search + select gym)
                                                     |
                                                     v
                                                Gym Chip updates (gold border = override)
                                                     |
                                                (tap X on chip to reset to home gym)
```

This only affects the current session. Your home gym stays the same on your Profile.

## Workflow 7: Profile Updates

```
Profile Screen -- tap any row --> Edit Sheet or Picker
                                       |
                                  (save changes)
                                       |
                                       v
                                  Profile Screen (updated)
```

**Editable fields:** Name, belt + stripes, training target, logging preference, birthday, gender, body weight, home gym.

## Workflow 8: Sign Out

```
Profile Screen -- tap "Sign Out" --> Confirmation Alert
                                          |
                                     (tap "Sign Out")
                                          |
                                          v
                                     Auth Screen
```

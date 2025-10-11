{
  "appName": "Can't Stop Won't Stop",
  "version": "1.0.0",
  "designSystem": {
    "colors": {
      "primary": {
        "red": "#DC2626",
        "redDark": "#991B1B",
        "redLight": "#EF4444",
        "black": "#0A0A0A",
        "blackSecondary": "#1A1A1A",
        "white": "#FFFFFF",
        "whiteMuted": "#F5F5F5"
      },
      "semantic": {
        "success": "#16A34A",
        "warning": "#F59E0B",
        "error": "#DC2626",
        "disabled": "#525252"
      },
      "grays": {
        "gray100": "#F5F5F5",
        "gray300": "#D4D4D4",
        "gray400": "#A3A3A3",
        "gray500": "#737373",
        "gray600": "#525252",
        "gray700": "#404040",
        "gray800": "#262626",
        "gray900": "#171717"
      }
    },
    "typography": {
      "fontFamily": {
        "ios": "SF Pro Display",
        "android": "Roboto",
        "fallback": "System Default"
      },
      "scale": {
        "display": {
          "size": 72,
          "weight": 700,
          "lineHeight": 1.0,
          "letterSpacing": -0.02,
          "usage": "Timer, large numbers"
        },
        "h1": {
          "size": 48,
          "weight": 700,
          "lineHeight": 1.1,
          "letterSpacing": -0.01,
          "usage": "Screen titles, major CTAs"
        },
        "h2": {
          "size": 36,
          "weight": 800,
          "lineHeight": 1.2,
          "letterSpacing": 0,
          "usage": "Exercise names"
        },
        "h3": {
          "size": 24,
          "weight": 700,
          "lineHeight": 1.3,
          "letterSpacing": 0,
          "usage": "Set counters, reps/weight"
        },
        "bodyLarge": {
          "size": 18,
          "weight": 400,
          "lineHeight": 1.5,
          "usage": "Instructions, form tips"
        },
        "body": {
          "size": 16,
          "weight": 400,
          "lineHeight": 1.6,
          "usage": "Standard UI text"
        },
        "caption": {
          "size": 14,
          "weight": 400,
          "lineHeight": 1.4,
          "usage": "Timestamps, metadata"
        },
        "small": {
          "size": 12,
          "weight": 400,
          "lineHeight": 1.4,
          "usage": "Tab labels, tiny text"
        }
      }
    },
    "spacing": {
      "baseUnit": 4,
      "scale": {
        "xxs": 4,
        "xs": 8,
        "s": 16,
        "m": 24,
        "l": 32,
        "xl": 48,
        "xxl": 64,
        "xxxl": 96
      }
    },
    "borderRadius": {
      "none": 0,
      "small": 4,
      "medium": 8,
      "large": 16,
      "round": 9999
    },
    "shadows": {
      "level1": "0px 2px 8px rgba(0, 0, 0, 0.4)",
      "level2": "0px 8px 24px rgba(0, 0, 0, 0.6)",
      "level3": "0px 16px 48px rgba(0, 0, 0, 0.8)",
      "redGlow": "0px 0px 20px rgba(220, 38, 38, 0.6)",
      "redGlowPulse": "0px 0px 40px rgba(220, 38, 38, 0.6)"
    }
  },
  "components": {
    "buttons": {
      "primary": {
        "width": "100% - 48pt margin",
        "height": 56,
        "backgroundColor": "#DC2626",
        "textSize": 18,
        "textWeight": 700,
        "textColor": "#FFFFFF",
        "borderRadius": 0,
        "shadow": "level1",
        "states": {
          "default": {
            "backgroundColor": "#DC2626",
            "scale": 1.0,
            "opacity": 1.0
          },
          "pressed": {
            "scale": 0.98,
            "opacity": 0.9,
            "duration": 100
          },
          "disabled": {
            "backgroundColor": "#525252",
            "opacity": 0.5
          }
        }
      },
      "secondary": {
        "width": "100% - 48pt margin",
        "height": 56,
        "backgroundColor": "transparent",
        "border": "2px solid #FFFFFF",
        "textSize": 18,
        "textWeight": 700,
        "textColor": "#FFFFFF",
        "borderRadius": 0,
        "states": {
          "pressed": {
            "backgroundColor": "#FFFFFF",
            "textColor": "#0A0A0A"
          }
        }
      },
      "icon": {
        "size": 44,
        "backgroundColor": "transparent",
        "iconSize": 24,
        "iconColor": "#FFFFFF",
        "minTapTarget": 44,
        "states": {
          "pressed": {
            "iconColor": "#DC2626",
            "scale": 0.95
          }
        }
      }
    },
    "inputs": {
      "text": {
        "height": 56,
        "backgroundColor": "#1A1A1A",
        "border": "1px solid #404040",
        "borderFocus": "2px solid #DC2626",
        "textSize": 18,
        "textColor": "#FFFFFF",
        "placeholderColor": "#737373",
        "borderRadius": 4,
        "padding": 16
      },
      "number": {
        "height": 56,
        "backgroundColor": "#1A1A1A",
        "border": "1px solid #404040",
        "textSize": 36,
        "textWeight": 700,
        "textColor": "#FFFFFF",
        "textAlign": "center",
        "borderRadius": 4
      },
      "slider": {
        "trackHeight": 4,
        "trackColor": "#404040",
        "activeTrackColor": "#DC2626",
        "thumbSize": 32,
        "thumbColor": "#DC2626",
        "thumbBorder": "2px solid #FFFFFF",
        "labelSize": 14,
        "labelColor": "#737373",
        "valueSize": 24,
        "valueColor": "#DC2626"
      }
    },
    "cards": {
      "plan": {
        "width": "100% - 48pt margin",
        "minHeight": 96,
        "backgroundColor": "#1A1A1A",
        "padding": 20,
        "border": "1px solid #262626",
        "borderRadius": 0,
        "shadow": "level1",
        "titleSize": 20,
        "titleWeight": 700,
        "titleColor": "#FFFFFF",
        "metadataSize": 14,
        "metadataColor": "#737373"
      },
      "exercise": {
        "width": "100% - 32pt margin",
        "height": 72,
        "backgroundColor": "#1A1A1A",
        "padding": 16,
        "border": "1px solid #262626",
        "borderRadius": 0,
        "iconSize": 32,
        "nameSize": 18,
        "nameWeight": 700,
        "nameColor": "#FFFFFF",
        "detailsSize": 14,
        "detailsColor": "#737373",
        "addButtonSize": 28,
        "addButtonColor": "#DC2626"
      },
      "stat": {
        "height": 80,
        "backgroundColor": "#1A1A1A",
        "borderLeft": "4px solid #DC2626",
        "padding": 16,
        "labelSize": 14,
        "labelColor": "#737373",
        "valueSize": 28,
        "valueWeight": 700,
        "valueColor": "#FFFFFF",
        "subvalueSize": 16,
        "subvalueColor": "#737373"
      }
    },
    "modals": {
      "bottomSheet": {
        "backgroundColor": "#0A0A0A",
        "borderRadius": "16px (top corners only)",
        "shadow": "level3",
        "handleWidth": 40,
        "handleHeight": 4,
        "handleColor": "#737373",
        "maxHeight": "80%"
      },
      "fullScreen": {
        "backgroundColor": "#0A0A0A",
        "overlayColor": "rgba(0, 0, 0, 0.9)",
        "padding": 32,
        "closeIconSize": 24,
        "closeIconColor": "#FFFFFF"
      },
      "alert": {
        "width": "90% max 320pt",
        "backgroundColor": "#0A0A0A",
        "borderDefault": "2px solid #FFFFFF",
        "borderDanger": "2px solid #DC2626",
        "titleSize": 20,
        "titleWeight": 700,
        "messageSize": 16,
        "messageColor": "#FFFFFF",
        "padding": 24
      }
    },
    "feedback": {
      "toast": {
        "width": "90%",
        "backgroundColor": "#1A1A1A",
        "borderLeftSuccess": "4px solid #16A34A",
        "borderLeftError": "4px solid #DC2626",
        "position": "top",
        "duration": 3000,
        "textSize": 16,
        "textColor": "#FFFFFF",
        "iconSize": 24,
        "padding": 16
      },
      "spinner": {
        "small": 24,
        "medium": 48,
        "large": 72,
        "color": "#DC2626",
        "animationDuration": "1s"
      },
      "progressBar": {
        "height": 8,
        "backgroundColor": "#262626",
        "fillColor": "#DC2626",
        "borderRadius": 4,
        "textSize": 14,
        "textWeight": 700,
        "textColor": "#DC2626"
      }
    }
  },
  "screens": {
    "splash": {
      "duration": 2000,
      "background": "#0A0A0A",
      "logoSize": 120,
      "titleSize": 48,
      "titleWeight": 700,
      "titleColor": "#FFFFFF",
      "spinnerSize": 24,
      "spinnerColor": "#DC2626",
      "transition": {
        "fadeIn": 300,
        "autoAdvance": 2000,
        "fadeOut": 400
      }
    },
    "welcome": {
      "background": "#0A0A0A",
      "logoSize": 96,
      "titleSize": 48,
      "titleWeight": 700,
      "titleColor": "#FFFFFF",
      "taglineSize": 18,
      "taglineColor": "#F5F5F5",
      "taglineMaxWidth": 280,
      "buttonWidth": 280,
      "buttonHeight": 56,
      "marginTop": 48
    },
    "modeSelection": {
      "background": "#0A0A0A",
      "headerSize": 36,
      "headerWeight": 700,
      "headerColor": "#FFFFFF",
      "headerMarginTop": 48,
      "headerMarginBottom": 24,
      "cards": {
        "width": "100% - 48pt margin",
        "height": 180,
        "backgroundColor": "#1A1A1A",
        "border": "2px solid transparent",
        "borderSelected": "2px solid #DC2626",
        "padding": 24,
        "marginBottom": 24,
        "borderRadius": 0,
        "titleSize": 24,
        "titleWeight": 800,
        "titleColor": "#FFFFFF",
        "descriptionSize": 16,
        "descriptionColor": "#F5F5F5",
        "buttonHeight": 48
      }
    },
    "dashboard": {
      "background": "#0A0A0A",
      "topBar": {
        "height": 64,
        "backgroundColor": "#0A0A0A",
        "iconSize": 24,
        "iconColor": "#FFFFFF",
        "tapTargetSize": 44
      },
      "statsWidget": {
        "backgroundColor": "#1A1A1A",
        "padding": 16,
        "borderRadius": 0,
        "marginHorizontal": 24,
        "marginTop": 16,
        "titleSize": 16,
        "titleWeight": 700,
        "titleColor": "#FFFFFF",
        "metadataSize": 14,
        "metadataColor": "#737373",
        "statsSize": 16,
        "statsWeight": 700,
        "statsColor": "#DC2626"
      },
      "heroCTA": {
        "width": "100% - 48pt margin",
        "height": 120,
        "backgroundColor": "#DC2626",
        "textSize": 36,
        "textWeight": 800,
        "textColor": "#FFFFFF",
        "borderRadius": 0,
        "shadow": "level2 + redGlow",
        "animation": "pulse"
      },
      "quickStart": {
        "padding": 24,
        "marginTop": 24,
        "titleSize": 18,
        "titleWeight": 700,
        "titleColor": "#FFFFFF",
        "subtitleSize": 14,
        "subtitleColor": "#737373",
        "previewSize": 14,
        "previewColor": "#F5F5F5"
      },
      "tabBar": {
        "height": 56,
        "backgroundColor": "#1A1A1A",
        "iconSize": 24,
        "labelSize": 12,
        "activeColor": "#DC2626",
        "inactiveColor": "#F5F5F5"
      }
    },
    "plansList": {
      "background": "#0A0A0A",
      "headerSize": 36,
      "headerWeight": 700,
      "headerColor": "#FFFFFF",
      "headerPadding": 24,
      "addIconSize": 32,
      "addIconColor": "#DC2626",
      "cardMargin": 16,
      "emptyStateIconSize": 64,
      "emptyStateTitleSize": 24,
      "emptyStateBodySize": 16
    },
    "createPlan": {
      "background": "#0A0A0A",
      "steps": 3,
      "step1": {
        "nameInput": {
          "labelSize": 16,
          "labelWeight": 700,
          "labelColor": "#FFFFFF",
          "height": 56,
          "backgroundColor": "#1A1A1A",
          "border": "1px solid #404040",
          "borderFocus": "2px solid #DC2626",
          "textSize": 18,
          "textColor": "#FFFFFF",
          "borderRadius": 4,
          "padding": 16,
          "minLength": 3,
          "maxLength": 50
        },
        "timeSlider": {
          "labelSize": 16,
          "labelWeight": 700,
          "labelColor": "#FFFFFF",
          "valueSize": 36,
          "valueWeight": 700,
          "valueColor": "#DC2626",
          "min": 30,
          "max": 120,
          "step": 5
        }
      },
      "step2": {
        "searchBar": {
          "height": 48,
          "backgroundColor": "#1A1A1A",
          "iconSize": 20,
          "iconColor": "#737373",
          "textSize": 16,
          "textColor": "#FFFFFF",
          "padding": 12,
          "margin": 16,
          "borderRadius": 4,
          "border": "1px solid #404040"
        },
        "categoryTabs": {
          "padding": "12pt horizontal, 8pt vertical",
          "textSize": 14,
          "textWeight": 700,
          "activeBackground": "#DC2626",
          "activeTextColor": "#FFFFFF",
          "inactiveBackground": "transparent",
          "inactiveTextColor": "#737373",
          "borderRadius": 4
        },
        "customExerciseButton": {
          "width": "100%",
          "height": 48,
          "backgroundColor": "transparent",
          "border": "1px dashed #FFFFFF",
          "textSize": 16,
          "textWeight": 700,
          "textColor": "#FFFFFF",
          "iconSize": 20
        }
      },
      "step3": {
        "exerciseList": {
          "itemHeight": 72,
          "backgroundColor": "#1A1A1A",
          "padding": 16,
          "borderBottom": "1px solid #262626",
          "dragIndicatorSize": 20,
          "dragIndicatorColor": "#737373",
          "nameSize": 18,
          "nameWeight": 700,
          "nameColor": "#FFFFFF",
          "detailsSize": 14,
          "detailsColor": "#737373",
          "menuIconSize": 20
        }
      }
    },
    "exerciseConfig": {
      "modalWidth": "90% max 400pt",
      "modalMaxHeight": "80%",
      "backgroundColor": "#0A0A0A",
      "border": "2px solid #DC2626",
      "borderRadius": 8,
      "shadow": "level3",
      "padding": 20,
      "headerSize": 24,
      "headerWeight": 700,
      "headerColor": "#FFFFFF",
      "closeIconSize": 24,
      "setsPills": {
        "size": 44,
        "backgroundColor": "#1A1A1A",
        "backgroundColorSelected": "#DC2626",
        "border": "1px solid #737373",
        "borderSelected": "1px solid #DC2626",
        "textSize": 18,
        "textWeight": 700,
        "textColor": "#FFFFFF",
        "borderRadius": 9999,
        "margin": 4,
        "max": 10
      },
      "restButtons": {
        "width": "22%",
        "height": 44,
        "backgroundColor": "transparent",
        "backgroundColorSelected": "#DC2626",
        "border": "1px solid #FFFFFF",
        "textSize": 14,
        "textWeight": 700,
        "textColor": "#FFFFFF",
        "borderRadius": 0,
        "options": [0, 30, 60, 90, 120]
      }
    },
    "preFlight": {
      "background": "#0A0A0A",
      "planNameSize": 36,
      "planNameWeight": 700,
      "planNameColor": "#FFFFFF",
      "planNameMarginTop": 48,
      "countSize": 18,
      "countColor": "#737373",
      "timeDial": {
        "size": 280,
        "backgroundColor": "#1A1A1A",
        "border": "4px solid #DC2626",
        "borderRadius": 0,
        "shadow": "redGlow",
        "numberSize": 72,
        "numberWeight": 700,
        "numberColor": "#DC2626",
        "labelSize": 18,
        "labelColor": "#FFFFFF"
      },
      "modeIndicator": {
        "size": 18,
        "weight": 700,
        "color": "#FFFFFF",
        "subtextSize": 14,
        "subtextColor": "#737373",
        "marginTop": 32
      },
      "warning": {
        "iconSize": 24,
        "iconColor": "#DC2626",
        "textSize": 16,
        "textWeight": 700,
        "textColor": "#FFFFFF",
        "marginTop": 32,
        "maxWidth": 280
      },
      "startButton": {
        "width": "100% - 48pt margin",
        "height": 64,
        "backgroundColor": "#DC2626",
        "textSize": 24,
        "textWeight": 800,
        "textColor": "#FFFFFF",
        "borderRadius": 0,
        "shadow": "level2 + redGlow",
        "animation": "pulse",
        "marginBottom": 32
      }
    },
    "activeWorkout": {
      "background": "#0A0A0A",
      "topBar": {
        "height": 64,
        "backgroundColor": "#0A0A0A",
        "timerSize": 48,
        "timerWeight": 700,
        "timerColor": "#FFFFFF",
        "timerColorUrgent": "#DC2626",
        "timerThreshold": 300,
        "pauseIconSize": 24,
        "pauseIconColor": "#FFFFFF",
        "pauseBadgeSize": 12,
        "pauseBadgeBackground": "#DC2626",
        "progressSize": 18,
        "progressWeight": 700,
        "progressColor": "#FFFFFF"
      },
      "exerciseName": {
        "size": 48,
        "weight": 800,
        "color": "#FFFFFF",
        "textTransform": "uppercase",
        "letterSpacing": 2,
        "marginTop": 80,
        "shadow": "text shadow"
      },
      "setIndicator": {
        "size": 24,
        "weight": 700,
        "color": "#DC2626",
        "marginTop": 16
      },
      "details": {
        "size": 36,
        "weight": 700,
        "color": "#FFFFFF",
        "marginTop": 12
      },
      "doneButton": {
        "width": "100% - 48pt margin",
        "height": 72,
        "backgroundColor": "#DC2626",
        "textSize": 28,
        "textWeight": 800,
        "textColor": "#FFFFFF",
        "borderRadius": 0,
        "marginBottom": 96,
        "shadow": "level2 + redGlow"
      },
      "skipButton": {
        "textSize": 16,
        "textColor": "#FFFFFF",
        "underline": true,
        "marginBottom": 24
      },
      "restTimer": {
        "overlayBackground": "rgba(10, 10, 10, 0.9)",
        "countdownSize": 72,
        "countdownWeight": 700,
        "countdownColor": "#DC2626",
        "labelSize": 24,
        "labelWeight": 700,
        "labelText": "REST",
        "progressCircle": true
      }
    },
    "pauseOverlay": {
      "background": "rgba(0, 0, 0, 0.95)",
      "blur": true,
      "iconSize": 96,
      "iconColor": "#DC2626",
      "iconMarginTop": 120,
      "titleSize": 36,
      "titleWeight": 800,
      "titleColor": "#FFFFFF",
      "titleMarginTop": 24,
      "warningSize": 18,
      "warningWeight": 700,
      "warningColor": "#DC2626",
      "warningMarginTop": 16,
      "timerSize": 48,
      "timerWeight": 700,
      "timerColor": "#FFFFFF",
      "timerMarginTop": 32,
      "resumeButton": {
        "width": "100% - 64pt margin",
        "height": 96,
        "backgroundColor": "#DC2626",
        "textSize": 32,
        "textWeight": 800,
        "textColor": "#FFFFFF",
        "borderRadius": 0,
        "shadow": "level3 + redGlow",
        "animation": "pulse"
      },
      "endButton": {
        "textSize": 16,
        "textColor": "#FFFFFF",
        "underline": true,
        "marginTop": 32
      }
    },
    "pushMessage": {
      "width": "90%",
      "backgroundColor": "rgba(10, 10, 10, 0.85)",
      "border": "4px solid #DC2626",
      "borderRadius": 0,
      "shadow": "redGlow",
      "padding": 40,
      "textSize": 32,
      "textWeight": 700,
      "textColor": "#FFFFFF",
      "textMaxWidth": 280,
      "lineHeight": 1.3,
      "textShadow": "2px 2px 8px rgba(0, 0, 0, 0.8)",
      "duration": 3000,
      "animation": {
        "slideIn": 400,
        "fadeOut": 400,
        "borderPulse": "4px to 6px",
        "glowPulse": "20px to 40px",
        "pulseDuration": 1000
      }
    },
    "summary": {
      "background": "#0A0A0A",
      "headerIcon": 32,
      "headerIconColor": "#16A34A",
      "headerSize": 24,
      "headerWeight": 700,
      "headerColor": "#FFFFFF",
      "headerPadding": 20,
      "badges": {
        "crushedIt": {
          "text": "CRUSHED IT",
          "textSize": 36,
          "textWeight": 800,
          "textColor": "#DC2626",
          "border": "3px solid #DC2626",
          "background": "rgba(220, 38, 38, 0.1)",
          "threshold": 100
        },
        "goodEffort": {
          "text": "GOOD EFFORT",
          "textSize": 36,
          "textWeight": 800,
          "textColor": "#F59E0B",
          "border": "3px solid #F59E0B",
          "background": "rgba(245, 158, 11, 0.1)",
          "threshold": 75
        },
        "weak": {
          "text": "WEAK",
          "textSize": 36,
          "textWeight": 800,
          "textColor": "#737373",
          "border": "3px solid #737373",
          "background": "rgba(115, 115, 115, 0.1)",
          "threshold": 0
        }
      },
      "statCards": {
        "width": "100% - 48pt margin",
        "height": 80,
        "backgroundColor": "#1A1A1A",
        "padding": 16,
        "marginBottom": 12,
        "borderLeft": "4px solid #DC2626",
        "borderRadius": 0,
        "labelSize": 14,
        "labelColor": "#737373",
        "valueSize": 28,
        "valueWeight": 700,
        "valueColor": "#FFFFFF"
      },
      "exerciseList": {
        "titleSize": 18,
        "titleWeight": 700,
        "titleColor": "#FFFFFF",
        "marginTop": 24,
        "marginBottom": 16,
        "checkmarkSize": 20,
        "checkmarkColorComplete": "#16A34A",
        "checkmarkColorSkipped": "#737373",
        "nameSize": 16,
        "nameColor": "#FFFFFF",
        "nameColorSkipped": "#737373",
        "detailsSize": 14,
        "detailsColor": "#737373"
      }
    },
    "levelUp": {
      "overlayBackground": "rgba(0, 0, 0, 0.95)",
      "modalWidth": "90% max 360pt",
      "backgroundColor": "#0A0A0A",
      "border": "4px solid #DC2626",
      "borderRadius": 8,
      "padding": 32,
      "warningIconSize": 64,
      "warningIconColor": "#DC2626",
      "titleSize": 32,
      "titleWeight": 800,
      "titleColor": "#DC2626",
      "titleMarginBottom": 32,
      "cardBackground": "#1A1A1A",
      "cardPadding": 24,
      "cardBorder": "1px solid #404040",
      "exerciseNameSize": 24,
      "exerciseNameWeight": 700,
      "exerciseNameColor": "#FFFFFF",
      "currentInfoSize": 18,
      "currentInfoColor": "#737373",
      "arrowSize": 32,
      "arrowColor": "#DC2626",
      "suggestionSize": 28,
      "suggestionWeight": 700,
      "suggestionColor": "#DC2626",
      "motivationSize": 18,
      "motivationWeight": 700,
      "motivationColor": "#FFFFFF",
      "acceptButton": {
        "width": "100%",
        "height": 64,
        "backgroundColor": "#DC2626",
        "textSize": 20,
        "textWeight": 800,
        "textColor": "#FFFFFF",
        "borderRadius": 0,
        "shadow": "level2 + redGlow",
        "marginBottom": 16
      },
      "declineButton": {
        "textSize": 16,
        "textColor": "#FFFFFF",
        "underline": true
      }
    },
    "history": {
      "background": "#0A0A0A",
      "headerSize": 36,
      "headerWeight": 700,
      "headerColor": "#FFFFFF",
      "headerPadding": 24,
      "workoutCards": {
        "width": "100% - 48pt margin",
        "minHeight": 96,
        "backgroundColor": "#1A1A1A",
        "padding": 20,
        "marginBottom": 16,
        "borderLeftWidth": 4,
        "borderLeft100": "#16A34A",
        "borderLeft75": "#F59E0B",
        "borderLeft0": "#737373",
        "borderRadius": 0,
        "dateSize": 18,
        "dateWeight": 700,
        "dateColor": "#FFFFFF",
        "planNameSize": 16,
        "planNameColor": "#FFFFFF",
        "metadataSize": 14,
        "metadataColor": "#737373"
      },
      "emptyState": {
        "iconSize": 64,
        "titleSize": 24,
        "bodySize": 16
      }
    },
    "settings": {
      "background": "#0A0A0A",
      "headerSize": 36,
      "headerWeight": 700,
      "headerColor": "#FFFFFF",
      "headerPadding": 24,
      "sectionHeaderSize": 14,
      "sectionHeaderWeight": 700,
      "sectionHeaderColor": "#737373",
      "sectionHeaderTransform": "uppercase",
      "sectionHeaderLetterSpacing": 1,
      "sectionHeaderMarginTop": 32,
      "sectionHeaderMarginBottom": 16,
      "rows": {
        "height": 64,
        "backgroundColor": "#1A1A1A",
        "padding": 16,
        "marginBottom": 1,
        "borderRadius": 0,
        "labelSize": 16,
        "labelColor": "#FFFFFF",
        "valueSize": 16,
        "valueColor": "#DC2626",
        "subtitleSize": 14,
        "subtitleColor": "#737373",
        "arrowSize": 20,
        "arrowColor": "#737373"
      },
      "toggle": {
        "width": 51,
        "height": 31,
        "activeColor": "#DC2626",
        "inactiveColor": "#737373"
      },
      "dangerRow": {
        "textColor": "#DC2626"
      }
    }
  },
  "interactions": {
    "gestures": {
      "tap": {
        "minimumSize": 44,
        "feedback": "scale 0.95-0.98",
        "haptic": "medium",
        "duration": 100
      },
      "longPress": {
        "duration": 500,
        "triggers": ["drag", "contextMenu"],
        "haptic": "heavy"
      },
      "swipe": {
        "threshold": 60,
        "velocity": 0.5,
        "actions": ["delete", "reveal"]
      },
      "pullToRefresh": {
        "threshold": 80,
        "haptic": "medium"
      }
    },
    "transitions": {
      "screenNavigation": {
        "duration": 300,
        "easing": "ease-in-out"
      },
      "modalPresentation": {
        "bottomSheet": 400,
        "fullScreen": 300,
        "easing": "ease-out"
      },
      "stateChanges": {
        "immediate": 0,
        "loading": 300,
        "success": 1000
      }
    },
    "haptic": {
      "light": ["toggle", "tabSelect"],
      "medium": ["buttonPress", "selection"],
      "heavy": ["startWorkout", "completeSet"],
      "error": ["delete", "cancel"]
    }
  },
  "animations": {
    "pulse": {
      "property": "scale",
      "keyframes": [1.0, 1.02, 1.0],
      "duration": 2000,
      "easing": "ease-in-out",
      "loop": "infinite"
    },
    "timerUrgency": {
      "trigger": "time < 300s",
      "colorTransition": {
        "from": "#FFFFFF",
        "to": "#DC2626",
        "duration": 1000
      },
      "pulseFrequency": "increases as time decreases"
    },
    "slideIn": {
      "start": {
        "y": "-100%",
        "opacity": 0
      },
      "end": {
        "y": "0%",
        "opacity": 1
      },
      "duration": 400,
      "easing": "ease-out"
    },
    "fadeOut": {
      "start": {
        "opacity": 1
      },
      "end": {
        "opacity": 0
      },
      "duration": 400,
      "easing": "ease-in"
    },
    "buttonPress": {
      "onPressDown": {
        "scale": 0.98,
        "opacity": 0.9,
        "duration": 100
      },
      "onRelease": {
        "scale": 1.0,
        "opacity": 1.0,
        "duration": 200,
        "easing": "spring"
      }
    },
    "restTimerCountdown": {
      "type": "circularProgress",
      "start": "100%",
      "end": "0%",
      "colorGradient": ["#DC2626", "#F59E0B", "#16A34A"],
      "textSize": 72,
      "smooth": true,
      "fps": 60
    },
    "exerciseTransition": {
      "currentSlideOut": {
        "x": "-100%",
        "opacity": 0,
        "duration": 500
      },
      "preview": {
        "text": "Next: [Exercise]",
        "duration": 1000
      },
      "newSlideIn": {
        "x": "0%",
        "opacity": 1,
        "duration": 500
      },
      "totalDuration": 2000
    }
  },
  "accessibility": {
    "contrast": {
      "minimum": "7:1",
      "standard": "WCAG AAA",
      "largeText": "4.5:1"
    },
    "touchTargets": {
      "minimum": 44,
      "spacing": 8,
      "frequentActions": 16
    },
    "fontScaling": {
      "support": "Dynamic Type",
      "maximum": "200%",
      "timerCap": 96,
      "headerCap": 64
    },
    "screenReader": {
      "labels": "all interactive elements",
      "descriptions": "meaningful context",
      "announcements": "state changes"
    },
    "focusIndicators": {
      "outline": "2px solid #DC2626",
      "offset": 4,
      "visible": "always"
    }
  },
  "responsive": {
    "screenSizes": {
      "small": {
        "width": 375,
        "height": 667,
        "device": "iPhone SE"
      },
      "medium": {
        "widthMin": 375,
        "widthMax": 428,
        "device": "Standard phones"
      },
      "large": {
        "width": 428,
        "height": 926,
        "device": "iPhone Pro Max"
      }
    },
    "safeAreas": {
      "topIOS": "44-59pt",
      "topAndroid": "24pt",
      "bottomIOS": "34pt",
      "horizontalMin": "24pt",
      "maxContentWidth": 600
    },
    "orientation": {
      "primary": "portrait",
      "locked": ["workout"],
      "landscape": "tablet only"
    }
  },
  "userJourneys": {
    "newUser": {
      "persona": "Alex, 28, works out 3x/week",
      "touchpoints": [
        "Download",
        "Onboarding",
        "Create first plan",
        "First workout",
        "See summary",
        "Return visit"
      ],
      "emotionalArc": [
        "Curiosity",
        "Intrigue",
        "Slight anxiety",
        "Determination",
        "Struggle",
        "Push through",
        "Accomplishment",
        "Pride"
      ],
      "criticalMoments": [
        {
          "moment": "Mode selection",
          "feeling": "Ready but cautious",
          "action": "Choose Challenge Mode"
        },
        {
          "moment": "Pre-flight warning",
          "feeling": "Adrenaline spike",
          "thought": "Oh shit, here we go"
        },
        {
          "moment": "First push message at 15min",
          "feeling": "Motivated, smiling",
          "message": "Stay hard! No time for weakness!"
        },
        {
          "moment": "Fatigue at 25min",
          "feeling": "Struggling, considers pausing",
          "intervention": "Push message saves commitment"
        },
        {
          "moment": "Timer hits 0:00",
          "feeling": "Disappointment but proud",
          "completion": "87.5%"
        }
      ]
    },
    "experiencedUser": {
      "persona": "Maria, 35, powerlifter, 5+ years",
      "goal": "Track progressive overload",
      "emotionalArc": [
        "Routine",
        "Confidence",
        "Flow state",
        "Surprise at level-up alert",
        "Challenged",
        "Determined",
        "Analytical",
        "Motivated"
      ],
      "criticalMoments": [
        {
          "moment": "Flow state during workout",
          "experience": "Timer fades to background"
        },
        {
          "moment": "Level-up alert",
          "reaction": "Oh shit, it noticed I've been stuck",
          "acceptance": "Yeah, time to level up. Let's do 195."
        }
      ]
    },
    "strugglingUser": {
      "persona": "Jordan, 24, inconsistent gym-goer",
      "goal": "Build consistency",
      "emotionalArc": [
        "Guilt",
        "Reluctance",
        "Commitment via Beast Mode",
        "Pain at 20min",
        "Anger at push",
        "Determination",
        "Relief",
        "Pride",
        "Social validation"
      ],
      "criticalMoments": [
        {
          "moment": "Sees last workout 65%",
          "feeling": "Guilt but motivated"
        },
        {
          "moment": "Selects Beast Mode",
          "commitment": "No escape"
        },
        {
          "moment": "Push at weakness point",
          "message": "Quit whining, push!",
          "reaction": "Gets angry, doubles down"
        },
        {
          "moment": "Finishes at 95%",
          "feeling": "Accomplished, shares with friends"
        }
      ]
    }
  },
  "pushMessages": {
    "categories": {
      "supportive": [
        "You've got this!",
        "Stay strong!",
        "You're doing great!",
        "Keep pushing!",
        "Almost there!"
      ],
      "aggressive": [
        "Stay hard! No time for weakness!",
        "Quit whining, push!",
        "Pain is temporary. Quit is forever.",
        "Greatness doesn't care how you feel!",
        "Weak minds quit. Strong minds push."
      ],
      "motivational": [
        "Your future self is watching!",
        "You didn't come this far to quit now!",
        "This is where champions are made!",
        "Earn your rest!",
        "Who's gonna carry the boats?"
      ]
    },
    "timing": {
      "frequency": {
        "off": 0,
        "low": "5-8 minutes",
        "medium": "3-5 minutes",
        "high": "2-3 minutes"
      },
      "contextual": {
        "early": "Encouraging (0-20 min)",
        "mid": "Motivational (20-40 min)",
        "late": "Aggressive (40+ min)"
      }
    }
  }
}
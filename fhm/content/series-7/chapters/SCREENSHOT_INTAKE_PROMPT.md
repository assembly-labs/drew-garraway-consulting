# Screenshot Intake Prompt

Copy and paste this prompt to Claude when you have new Series 7 screenshots to process.

---

## The Prompt

```
TASK: Process Series 7 course screenshots

SOURCE: /Users/drewgarraway/Downloads/_S7
(or specify different folder)

DESTINATION: /Users/drewgarraway/Documents/GitHub/drew-garraway-consulting/fhm/content/series-7/chapters/

STEPS:
1. List all images in the source folder
2. Resize images to max 1800px on longest side (prevents API errors)
3. Read key images to identify chapter boundaries
4. Categorize each image by chapter:
   - Intro content → chapters/intro/screenshots/
   - Chapter 1: Equities → chapters/ch-01-equities/screenshots/
   - Chapter 2: Debt Fundamentals → chapters/ch-02-debt-fundamentals/screenshots/
   - Chapter 3: Additional Bond Features → chapters/ch-03-additional-bond-features-and-risks/screenshots/
   - (etc. for chapters 4-19)
5. Copy resized images to appropriate chapter folders
6. Delete source images from Downloads folder after successful copy
7. Report summary of what was organized

CHAPTER REFERENCE:
ch-01-equities
ch-02-debt-fundamentals
ch-03-additional-bond-features-and-risks
ch-04-corporate-us-government-agency-debt
ch-05-municipal-debt-money-market-instruments
ch-06-packaged-products
ch-07-trading-markets
ch-08-trade-processing-settlement
ch-09-fundamentals-of-options
ch-10-index-options-advanced-strategies
ch-11-individual-customer-accounts-suitability
ch-12-other-account-types
ch-13-retirement-education-savings-plans
ch-14-primary-market
ch-15-securities-exchange-act-1934-regulations
ch-16-sro-rules
ch-17-investment-analysis
ch-18-taxation
ch-19-suitability
```

---

## Resize Command Reference

Claude will use this command to resize images before reading:

```bash
# Resize single image to max 1800px (macOS sips)
sips --resampleHeightWidthMax 1800 "image.png"

# Resize all PNGs in folder
for f in /path/to/folder/*.png; do sips --resampleHeightWidthMax 1800 "$f"; done
```

---

## Quick Version (Copy This)

```
Process screenshots from /Users/drewgarraway/Downloads/_S7

1. Resize all images to max 1800px (sips --resampleHeightWidthMax 1800)
2. Read images to identify which chapter each belongs to
3. Copy to appropriate folder in fhm/content/series-7/chapters/ch-XX-*/screenshots/
4. Delete source images from Downloads folder
5. Give me a summary when done
```

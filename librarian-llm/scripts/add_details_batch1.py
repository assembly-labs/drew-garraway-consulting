#!/usr/bin/env python3
"""
Add rich details to the first 10 catalog items (Batch 1).

This adds 5 books and 5 Library of Things items with comprehensive details.
"""

import json
from pathlib import Path

def add_details_batch_1():
    """Add details to first 10 items."""

    catalog_path = Path(__file__).parent.parent / 'data' / 'catalog.json'

    with open(catalog_path, 'r') as f:
        catalog = json.load(f)

    # Define details for first 10 items
    details_data = {
        # BOOK 1: The Thursday Murder Club
        "book_001": {
            "extendedDescription": "Four septuagenarians with a combined age of nearly three hundred gather weekly to solve cold cases. Elizabeth, Joyce, Ibrahim, and Ron might seem like typical retirement home residents, but their backgrounds in espionage, nursing, psychiatry, and union organizing make them formidable amateur detectives. When a local property developer is found dead, the group finds themselves investigating a live case for the first time.",
            "authorBio": "Richard Osman is a British television presenter, producer, and novelist. Before becoming a bestselling author, he co-created the quiz show Pointless and served as creative director of Endemol UK. The Thursday Murder Club was his debut novel and became an instant sensation, spending months on bestseller lists worldwide.",
            "awards": [
                "British Book Awards Crime & Thriller Book of the Year (2021)",
                "Goodreads Choice Awards Best Mystery & Thriller Nominee (2020)",
                "IndieB bound National Bestseller"
            ],
            "reviews": [
                {
                    "reviewer": "The New York Times",
                    "quote": "A thing of joy... I'm already anticipating the next book.",
                    "rating": 5
                },
                {
                    "reviewer": "The Guardian",
                    "quote": "Warm, wise and witty... a celebration of the human spirit",
                    "rating": 4
                },
                {
                    "reviewer": "Stephen King",
                    "quote": "Pure escapism... I will read THE THURSDAY MURDER CLUB again. Highly recommended.",
                    "rating": 5
                }
            ],
            "funFacts": [
                "The book sold over a million copies in the UK alone within its first year",
                "Richard Osman wrote most of it during his daily train commute",
                "It's the first in a series - there are now four Thursday Murder Club books",
                "The character of Elizabeth was partly inspired by Osman's own mother"
            ],
            "targetAudience": "Perfect for fans of cozy mysteries, readers who enjoy witty British humor, and anyone who appreciates clever protagonists over 70. Great for book clubs!",
            "similarTitles": ["The Maid", "A Man Called Ove", "Eleanor Oliphant Is Completely Fine"]
        },

        # BOOK 2: The Silent Patient
        "book_002": {
            "extendedDescription": "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house overlooking Hampstead Heath. One evening, she shoots her husband five times in the face and then never speaks another word. Her refusal to speak transforms her into a source of endless fascination, and her artwork skyrockets in value. Theo Faber, a criminal psychotherapist, has always been obsessed with Alicia's case. When he finally secures a job at The Grove, the psychiatric hospital where she's confined, he's determined to unravel the mystery of why she killed her husband. But his quest will consume him and lead him down a path more twisting and dangerous than he ever imagined.",
            "authorBio": "Alex Michaelides was born in Cyprus to a Greek-Cypriot father and an English mother. He studied English Literature at Cambridge University and Screenwriting at the American Film Institute. The Silent Patient was his debut novel and became an instant global phenomenon, spending over a year on the New York Times bestseller list.",
            "awards": [
                "Goodreads Choice Awards Best Mystery & Thriller (2019)",
                "Best Hardcover Debut of the Year (Independent Bookstore Week)",
                "New York Times Bestseller for over 70 weeks"
            ],
            "reviews": [
                {
                    "reviewer": "A.J. Finn, author of The Woman in the Window",
                    "quote": "The perfect thriller. This is a shocking psychological thriller that will keep you guessing to the very end.",
                    "rating": 5
                },
                {
                    "reviewer": "The Times (UK)",
                    "quote": "Smart, sophisticated suspense... you won't see the ending coming."
                }
            ],
            "funFacts": [
                "Sold over 6.5 million copies worldwide",
                "Translated into over 50 languages",
                "Brad Pitt's production company Plan B acquired film rights",
                "The twist ending was conceived before any other part of the plot"
            ],
            "targetAudience": "Thriller enthusiasts, fans of psychological suspense, and readers who love unreliable narrators and shocking plot twists.",
            "contentWarnings": ["Violence", "Mental health themes", "Suicide references"]
        },

        # BOOK 3: Gone Girl
        "book_003": {
            "extendedDescription": "Marriage can be a real killer. One of the most critically acclaimed suspense novels of all time, Gone Girl is a masterclass in unreliable narration. Nick Dunne insists he's innocent of his wife Amy's disappearance, but her diary tells a different story. As the police investigation unfolds and media pressure mounts, the question shifts from 'What happened to Amy?' to 'Who is telling the truth?' Gillian Flynn's razor-sharp prose dissects marriage, media, and the masks people wear.",
            "authorBio": "Gillian Flynn is an American novelist, screenwriter, and former television critic. She worked as the chief television critic for Entertainment Weekly before turning to fiction full-time. Gone Girl, her third novel, became a cultural phenomenon and was adapted into a critically acclaimed film directed by David Fincher.",
            "awards": [
                "Goodreads Choice Awards Best Fiction (2012)",
                "Book of the Year - Amazon, Entertainment Weekly, and more",
                "Over 15 million copies sold worldwide"
            ],
            "reviews": [
                {
                    "reviewer": "The New York Times",
                    "quote": "A superbly paced, beautifully written thriller... Flynn is a first-rate prose stylist."
                },
                {
                    "reviewer": "Entertainment Weekly",
                    "quote": "A whodunit unlike any you've ever read."
                }
            ],
            "funFacts": [
                "Stayed on the New York Times bestseller list for over 100 weeks",
                "The 2014 film adaptation grossed over $369 million worldwide",
                "Flynn wrote the screenplay for the film adaptation herself",
                "Rosamund Pike received an Oscar nomination for playing Amy"
            ],
            "targetAudience": "Perfect for readers who love dark, twisty thrillers with complex characters and moral ambiguity. Not for the faint of heart!",
            "contentWarnings": ["Violence", "Psychological abuse", "Sexual content", "Strong language"]
        },

        # BOOK 4: The Girl on the Train
        "book_004": {
            "extendedDescription": "Rachel takes the same commuter train every morning and night. Every day she rattles down the track, flashes past a stretch of cozy suburban homes, and stops at the signal that allows her to daily watch the same couple breakfasting on their deck. Jess and Jason, she calls them. Their life—as she sees it—is perfect. Not unlike the life she recently lost. And then she sees something shocking. It's only a minute until the train moves on, but it's enough. Now everything's changed. Unable to keep it to herself, Rachel offers what she knows to the police and becomes inextricably entwined in what happens next.",
            "authorBio": "Paula Hawkins worked as a journalist for fifteen years before turning to fiction. Born and raised in Zimbabwe, she moved to London in 1989 and worked for The Times. The Girl on the Train was her breakthrough novel, staying on bestseller lists for years and selling millions of copies worldwide.",
            "awards": [
                "Goodreads Choice Awards Best Mystery & Thriller Nominee (2015)",
                "New York Times Bestseller for over 100 weeks",
                "Over 20 million copies sold worldwide"
            ],
            "reviews": [
                {
                    "reviewer": "USA Today",
                    "quote": "Gripping, unsettling, and a compulsive read."
                }
            ],
            "funFacts": [
                "Published in over 50 countries and translated into more than 40 languages",
                "The 2016 film adaptation starred Emily Blunt",
                "Set on the actual London-to-suburban commuter train route",
                "Hawkins got the idea while commuting herself"
            ],
            "targetAudience": "Fans of psychological thrillers, unreliable narrators, and domestic suspense. Great for readers who enjoyed Gone Girl."
        },

        # BOOK 5: Big Little Lies
        "book_005": {
            "extendedDescription": "Big Little Lies follows three women—Madeline, Celeste, and Jane—whose seemingly perfect lives unravel to the point of murder. From the moment they meet at orientation for their children's first day of kindergarten, it's clear that someone is going to die. The only questions are who and why. Set against the backdrop of a picturesque Australian beachside town, this darkly comic novel explores the dangerous little lies we tell ourselves just to survive.",
            "authorBio": "Liane Moriarty is an Australian author who has written nine novels. Her books have sold over 20 million copies and been translated into 40 languages. Big Little Lies was adapted into an Emmy-winning HBO series starring Reese Witherspoon, Nicole Kidman, and Shailene Woodley.",
            "awards": [
                "Emmy Award for Outstanding Limited Series (TV adaptation)",
                "Goodreads Choice Awards Best Fiction Nominee",
                "Australian Book Industry Awards Book of the Year longlist"
            ],
            "reviews": [
                {
                    "reviewer": "Entertainment Weekly",
                    "quote": "The ultimate page-turner."
                },
                {
                    "reviewer": "The Washington Post",
                    "quote": "Brilliant... addictive... darkly comic"
                }
            ],
            "funFacts": [
                "The HBO series won 8 Emmy Awards",
                "Reese Witherspoon chose it for her book club",
                "Filmed on location in Monterey, California (not Australia!)",
                "Moriarty wrote it while her youngest daughter started kindergarten"
            ],
            "targetAudience": "Perfect for fans of domestic drama, dark comedy, and ensemble casts. Ideal for book clubs and discussion groups."
        },

        # LOT 1: WiFi Hotspot
        "lot_001": {
            "whatsIncluded": [
                "T-Mobile 4G LTE Hotspot device",
                "USB charging cable",
                "Protective carrying case",
                "Quick start guide",
                "Library checkout card with password"
            ],
            "howToUse": "Turn on the device using the power button on the side. Wait for the indicator light to turn solid green (about 30-60 seconds). On your laptop or tablet, go to WiFi settings and select the network name printed on the back of the device. Enter the password (also on the back). You're connected! The device supports up to 10 simultaneous connections.",
            "careInstructions": "Keep device charged (charge overnight before use). Avoid exposure to extreme temperatures. Return device in the protective case. Do not remove the library barcode sticker.",
            "safetyInfo": "This device contains a lithium-ion battery. Do not expose to water or extreme heat. If device becomes hot to the touch, turn it off immediately and contact library staff.",
            "recommendedUses": [
                "Working from home when your internet is down",
                "Job searching and online applications",
                "Homework and online classes",
                "Telehealth appointments",
                "Video calls with family"
            ],
            "phillyTips": [
                "Great for remote work in Rittenhouse Square or Fairmount Park",
                "Use it at coffee shops without buying WiFi",
                "Perfect for grad students studying in University City",
                "Take it to the Please Touch Museum to keep kids entertained during downtime"
            ],
            "bestSeasons": ["Year-round"],
            "ageRecommendation": "Adults 18+ (library card required)",
            "depositAmount": 0,
            "replacementCost": 150.00
        },

        # LOT 2: Power Drill
        "lot_002": {
            "whatsIncluded": [
                "20V cordless drill/driver",
                "Two rechargeable lithium-ion batteries",
                "Battery charger",
                "Drill bit set (15 pieces)",
                "Screwdriver bit set (10 pieces)",
                "Protective safety glasses",
                "Instruction manual",
                "Hard carrying case"
            ],
            "howToUse": "Insert a fully charged battery into the base until it clicks. Select your desired speed (1 or 2) using the switch on top. For drilling, set the collar to the drill bit symbol. For driving screws, select a number 1-24 based on screw size. Squeeze the trigger gently to start - more pressure = more speed. Remember: the reverse button is above the trigger.",
            "careInstructions": "Charge batteries fully before first use and after each checkout. Clean drill with a dry cloth after use. Do not use water or solvents. Store in provided case. Return with all bits organized in the case compartments.",
            "safetyInfo": "ALWAYS wear the provided safety glasses when operating. Keep fingers away from the drill bit. Ensure workpiece is secured before drilling. Do not use damaged bits. Not for use with masonry or concrete. Adult supervision required for users under 18.",
            "recommendedUses": [
                "Hanging pictures and shelves",
                "Assembling furniture",
                "Small home repairs",
                "Installing curtain rods",
                "DIY craft projects"
            ],
            "phillyTips": [
                "Perfect for fixing up rowhome interiors",
                "Great for First Friday Philly maker projects",
                "Use to install window AC units before summer heat hits",
                "Ideal for hanging art in Fishtown studios"
            ],
            "bestSeasons": ["Spring", "Fall", "Year-round"],
            "ageRecommendation": "Ages 18+ (16-17 with adult supervision)",
            "depositAmount": 25.00,
            "replacementCost": 120.00
        },

        # LOT 3: Board Game - Catan
        "lot_003": {
            "whatsIncluded": [
                "Game board (6 frame pieces + 19 terrain hexes)",
                "4 sets of playing pieces (settlements, cities, roads)",
                "Resource cards (wood, brick, wheat, sheep, ore)",
                "Development cards",
                "2 special cards (Longest Road, Largest Army)",
                "2 dice",
                "Robber piece",
                "Rulebook",
                "Building Costs card (quick reference)"
            ],
            "howToUse": "Setup: Assemble the frame, arrange terrain hexes randomly, place number tokens, each player chooses a color. Gameplay: Players take turns rolling dice, collecting resources, and building settlements/roads/cities. First to 10 victory points wins! Game typically lasts 60-90 minutes. Suitable for 3-4 players (5-6 with expansion not included).",
            "careInstructions": "Keep all pieces in the provided box compartments. Do not bend cards. Check that all pieces are included before returning (use the inventory checklist inside the box lid). Report any missing pieces immediately to avoid fines.",
            "recommendedUses": [
                "Family game nights",
                "Social gatherings with friends",
                "Learning strategy and negotiation skills",
                "Rainy day activities",
                "Teaching resource management concepts"
            ],
            "phillyTips": [
                "Popular at Yards Brewing Company game nights",
                "Great icebreaker for new neighbors in Graduate Hospital",
                "Perfect for Fishtown house parties",
                "Borrow for cozy winter nights in Manayunk apartments"
            ],
            "bestSeasons": ["Fall", "Winter", "Year-round"],
            "ageRecommendation": "Ages 10+ (can be enjoyed by adults too!)",
            "depositAmount": 0,
            "replacementCost": 50.00
        },

        # LOT 4: Outdoor Explorer Backpack
        "lot_004": {
            "whatsIncluded": [
                "Durable hiking backpack (20L capacity)",
                "Binoculars (8x21 magnification)",
                "Field guide to Mid-Atlantic birds",
                "Field guide to Pennsylvania trees and plants",
                "Magnifying glass",
                "Compass",
                "Notebook and pencil",
                "Laminated trail maps (Wissahickon, Fairmount Park, Pennypack)",
                "Reusable water bottle",
                "First aid kit (basic)"
            ],
            "howToUse": "Pack the backpack with snacks, water, and weather-appropriate clothing. Bring the field guides to identify birds and plants you encounter. Use binoculars for bird watching - adjust the focus wheel for clear viewing. The compass helps with basic navigation (North is marked with an 'N'). Record your findings in the nature journal!",
            "careInstructions": "Empty and air out backpack after each use. Wipe down binoculars with a soft cloth only (included). Return field guides in good condition - they're expensive to replace. Check that all items are present using the checklist sewn into the backpack's inner pocket.",
            "recommendedUses": [
                "Hiking Philadelphia's extensive trail system",
                "Bird watching in Wissahickon Valley",
                "Nature education for children",
                "Photography expeditions",
                "Geocaching adventures"
            ],
            "phillyTips": [
                "Best bird watching in Wissahickon during spring/fall migration (April-May, September-October)",
                "Visit John Heinz National Wildlife Refuge in Southwest Philly",
                "Explore the Schuylkill River Trail for urban nature",
                "Check out Forbidden Drive for easy family-friendly hiking",
                "Download the Merlin Bird ID app for real-time bird identification"
            ],
            "bestSeasons": ["Spring", "Summer", "Fall"],
            "ageRecommendation": "All ages (adult supervision recommended for children under 12)",
            "depositAmount": 0,
            "replacementCost": 85.00
        },

        # LOT 5: Raspberry Pi Kit
        "lot_005": {
            "whatsIncluded": [
                "Raspberry Pi 4 Model B (4GB RAM)",
                "Official Raspberry Pi power supply",
                "32GB microSD card (pre-loaded with Raspberry Pi OS)",
                "HDMI cable",
                "USB keyboard and mouse",
                "Beginner's guide book",
                "10 starter projects guide",
                "Protective case",
                "Heatsinks (pre-installed)",
                "Breadboard and jumper wires for electronics projects"
            ],
            "howToUse": "Connect the Pi to a monitor using the HDMI cable. Plug in the keyboard and mouse. Insert the microSD card. Finally, connect the power supply - the Pi will boot automatically! The desktop interface is similar to Windows/Mac. Start with the pre-loaded tutorial projects. NO prior programming experience required - the guides walk you through everything step-by-step.",
            "careInstructions": "Always shut down properly using the menu (don't just unplug!). Keep away from liquids and static electricity. Do not remove the heatsinks. Return all components in the protective case. The microSD card contains the operating system - handle carefully.",
            "safetyInfo": "The device may get warm during use - this is normal. Do not cover ventilation holes. Use only the provided power supply (using others may damage the device). Adult supervision required for users under 16 when working with electronics components.",
            "recommendedUses": [
                "Learning Python programming",
                "Building retro gaming console",
                "Home automation projects",
                "Teaching kids to code",
                "Creating a media center",
                "Robotics and electronics experiments"
            ],
            "phillyTips": [
                "Join Philly Code for kids (phillycode4kids.org) for free workshops",
                "Check out NextFab for maker space resources",
                "Visit the Free Library's Digital Literacy Centers for help",
                "Connect with Philly Tech Sistas for women in tech mentorship",
                "Drexel University offers free community coding workshops"
            ],
            "bestSeasons": ["Year-round"],
            "ageRecommendation": "Ages 12+ (adult supervision for under 16)",
            "depositAmount": 35.00,
            "replacementCost": 125.00
        }
    }

    # Add details to catalog items
    added_count = 0
    for item in catalog:
        if item['id'] in details_data:
            item['details'] = details_data[item['id']]
            added_count += 1
            print(f"✓ Added details to: {item['id']} - {item['title']}")

    # Save updated catalog
    with open(catalog_path, 'w') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 60)
    print("✅ BATCH 1 COMPLETE")
    print("=" * 60)
    print(f"Added details to {added_count} items")
    print(f"\nItems with details:")
    print("  📚 Books: 5 (book_001 to book_005)")
    print("  📦 Library of Things: 5 (lot_001 to lot_005)")
    print(f"\nRemaining batches: 10 more (106 items still need details)")
    print("=" * 60)

if __name__ == '__main__':
    add_details_batch_1()

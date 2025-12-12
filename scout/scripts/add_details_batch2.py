#!/usr/bin/env python3
"""
Add rich details to the next 15 catalog items (Batch 2).

This adds 10 books and 5 Library of Things items with comprehensive details.
Batch 2: book_006 to book_015, lot_006 to lot_010
"""

import json
from pathlib import Path

def add_details_batch_2():
    """Add details to next 15 items."""

    catalog_path = Path(__file__).parent.parent / 'data' / 'catalog.json'

    with open(catalog_path, 'r') as f:
        catalog = json.load(f)

    # Define details for next 15 items
    details_data = {
        # BOOK 6: The Guest List
        "book_006": {
            "extendedDescription": "On an island off the coast of Ireland, guests gather to celebrate two people joining their lives together as one. The celebrants: a rising television star and a magazine publisher. The guests include the bride's best friend, the plus ones, and the groom's best man. As the champagne is popped and the festivities begin, resentments and petty jealousies begin to mingle with the reminiscences and well wishes. The groomsmen begin the drinking game from their school days. The bridesmaid not-so-accidentally ruins her dress. The bride's oldest (male) friend gives an uncomfortably caring toast. When a body is discovered the next morning, everyone is a suspect.",
            "authorBio": "Lucy Foley studied English Literature at Durham and UCL universities. She then worked for several years as a fiction editor in the publishing industry before leaving to write full-time. The Guest List is her third novel and became an instant international bestseller. She lives in London.",
            "awards": [
                "Goodreads Choice Awards Best Mystery & Thriller Finalist (2020)",
                "Reese's Book Club Pick",
                "New York Times Bestseller for over 50 weeks"
            ],
            "reviews": [
                {
                    "reviewer": "The New York Times",
                    "quote": "Agatha Christie meets Big Little Lies... an utterly engrossing whodunit."
                },
                {
                    "reviewer": "Ruth Ware, author of The Woman in Cabin 10",
                    "quote": "Brilliant, edgy, and compulsive. I inhaled it."
                }
            ],
            "funFacts": [
                "Inspired by a real wedding on a remote Irish island",
                "Each chapter alternates between different characters' perspectives",
                "The isolated setting creates a locked-room mystery atmosphere",
                "Foley's previous novel 'The Hunting Party' has a similar structure"
            ],
            "targetAudience": "Perfect for fans of Agatha Christie-style mysteries, readers who enjoyed Big Little Lies, and anyone who loves atmospheric thrillers with multiple suspects.",
            "similarTitles": ["Big Little Lies", "The Hunting Party", "One by One"]
        },

        # BOOK 7: Verity
        "book_007": {
            "extendedDescription": "Lowen Ashleigh is a struggling writer on the brink of financial ruin when she accepts the job offer of a lifetime. Jeremy Crawford, husband of bestselling author Verity Crawford, has hired Lowen to complete the remaining books in a successful series his injured wife is unable to finish. Lowen arrives at the Crawford home to sort through years of Verity's notes and outlines, hoping to find enough material to get her started. What Lowen doesn't expect to uncover in the chaotic office is an unfinished autobiography Verity never intended for anyone to read. Page after page of bone-chilling admissions, including Verity's recollection of what really happened the day her daughter died. Lowen decides to keep the manuscript hidden from Jeremy, knowing its contents would devastate the already-grieving father. But as Lowen's feelings for Jeremy begin to intensify, she recognizes all the ways she could benefit if he were to read his wife's words. After all, no matter how devoted Jeremy is to his injured wife, a truth this horrifying would make it impossible for him to continue loving her.",
            "authorBio": "Colleen Hoover is the #1 New York Times bestselling author of more than twenty novels. She has won the Goodreads Choice Award for Best Romance three years in a row and her books have sold over 20 million copies worldwide. Verity represents her foray into psychological thriller territory, showcasing her versatility as a writer.",
            "awards": [
                "Goodreads Choice Awards Best Romance Nominee (2018)",
                "Over 2 million copies sold",
                "Amazon Charts Bestseller for over 100 weeks",
                "BookTok viral sensation with over 1 billion views"
            ],
            "reviews": [
                {
                    "reviewer": "Tarryn Fisher, author of The Wives",
                    "quote": "Verity is a Gothic, psychological thriller that will leave you reeling.",
                    "rating": 5
                },
                {
                    "reviewer": "Goodreads reviewer",
                    "quote": "This book had me gasping, theorizing, and losing sleep. Absolutely unputdownable."
                }
            ],
            "funFacts": [
                "Originally self-published before being picked up by a major publisher",
                "Became a massive hit on BookTok years after its original release",
                "The ending has sparked countless online debates and theories",
                "Amazon is developing a film adaptation",
                "Hoover wrote it as a palate cleanser between romance novels"
            ],
            "targetAudience": "Romance readers looking for something darker, fans of psychological thrillers, and anyone who loves unreliable narrators and shocking twists.",
            "contentWarnings": ["Violence", "Death of children (discussed)", "Disturbing content", "Sexual content"],
            "similarTitles": ["The Silent Patient", "Behind Closed Doors", "The Wife Between Us"]
        },

        # BOOK 8: The Seven Husbands of Evelyn Hugo
        "book_008": {
            "extendedDescription": "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself. Why her? Why now? Monique is not exactly on top of the world. Her husband has left her, and her professional life is going nowhere. Regardless of why Evelyn has selected her to write her biography, Monique is determined to use this opportunity to jumpstart her career. Summoned to Evelyn's luxurious apartment, Monique listens in fascination as the actress tells her story. From making her way to Los Angeles in the 1950s to her decision to leave show business in the '80s, and, of course, the seven husbands along the way, Evelyn unspools a tale of ruthless ambition, unexpected friendship, and a great forbidden love.",
            "authorBio": "Taylor Jenkins Reid is the New York Times bestselling author of eight novels, including Malibu Rising, Daisy Jones & The Six, and The Seven Husbands of Evelyn Hugo. Her books have been translated into 30+ languages and are international bestsellers. She lives in Los Angeles with her family.",
            "awards": [
                "Goodreads Choice Awards Best Historical Fiction (2017)",
                "Amazon's Best Book of the Year",
                "Over 2 million copies sold worldwide",
                "One of Buzzfeed's Best Books of the Decade"
            ],
            "reviews": [
                {
                    "reviewer": "Kirkus Reviews (Starred)",
                    "quote": "Riveting, heart-wrenching, and full of Old Hollywood glamour... A gorgeously written novel.",
                    "rating": 5
                },
                {
                    "reviewer": "Entertainment Weekly",
                    "quote": "Prepare to be captivated by Evelyn, a heroine you'll never forget."
                },
                {
                    "reviewer": "Bustle",
                    "quote": "If you're looking for a book to read in one sitting, this is it."
                }
            ],
            "funFacts": [
                "Netflix is producing a film adaptation",
                "Evelyn Hugo is a fictional character but draws inspiration from real Old Hollywood icons",
                "The book explores bisexuality and queer love in a historically homophobic industry",
                "It's been on bestseller lists for over 200 weeks",
                "Reid researched extensively about Golden Age Hollywood for authenticity"
            ],
            "targetAudience": "Perfect for fans of historical fiction, Old Hollywood glamour, LGBTQ+ love stories, and character-driven narratives. Ideal for book clubs.",
            "similarTitles": ["Daisy Jones & The Six", "Malibu Rising", "The Plot"]
        },

        # BOOK 9: Beach Read
        "book_009": {
            "extendedDescription": "Augustus Everett is an acclaimed author of literary fiction. January Andrews writes bestselling romance. When she pens a happily ever after, he kills off his entire cast. They're polar opposites. In fact, the only thing they have in common is that for the next three months, they're living in neighboring beach houses, broke, and bogged down with writer's block. Until, one hazy evening, one thing leads to another and they strike a deal designed to force them out of their creative ruts: Augustus will spend the summer writing something happy, and January will pen the next Great American Novel. She'll take him on field trips worthy of any rom-com montage, and he'll take her to interview surviving members of a backwoods death cult. Everyone will finish a book and no one will fall in love. Really.",
            "authorBio": "Emily Henry is the #1 New York Times bestselling author of adult fiction including Book Lovers, People We Meet on Vacation, and Beach Read. Her books have been translated into 40+ languages and have sold millions of copies worldwide. Before writing romance, she studied creative writing at Hope College.",
            "awards": [
                "Goodreads Choice Awards Best Romance Finalist (2020)",
                "LibraryReads Hall of Fame",
                "Over 1 million copies sold",
                "New York Times Bestseller for over 100 weeks"
            ],
            "reviews": [
                {
                    "reviewer": "The New York Times",
                    "quote": "Witty, romantic, and deeply felt... A standout in the romance genre."
                },
                {
                    "reviewer": "Entertainment Weekly",
                    "quote": "A smart, funny, and emotional love story that will have you swooning."
                }
            ],
            "funFacts": [
                "The beach town setting is based on South Haven, Michigan",
                "Emily Henry used to write young adult fiction before switching to romance",
                "The book explores grief alongside romance in a unique way",
                "Features two writers as protagonists, making it meta and clever",
                "Inspired a whole new wave of 'smart romance' novels"
            ],
            "targetAudience": "Romance readers who appreciate witty banter, fans of opposites-attract tropes, and anyone who enjoys stories about writers. Perfect summer read!",
            "similarTitles": ["People We Meet on Vacation", "The Hating Game", "Red, White & Royal Blue"]
        },

        # BOOK 10: People We Meet on Vacation
        "book_010": {
            "extendedDescription": "Poppy and Alex. Alex and Poppy. They have nothing in common. She's a wild child; he wears khakis. She has insatiable wanderlust; he prefers to stay home with a book. And somehow, ever since a fateful car share home from college many years ago, they are the very best of friends. For most of the year they live far apart—she's in New York City, and he's in their small hometown—but every summer, for a decade, they have taken one glorious week of vacation together. Until two years ago, when they ruined everything. They haven't spoken since. Poppy has everything she should want, but she's stuck in a rut. When someone asks when she was last truly happy, she knows, without a doubt, it was on that ill-fated, final trip with Alex. And so, she decides to convince her best friend to take one more vacation together—lay everything on the table, make it right. Miraculously, he agrees.",
            "authorBio": "Emily Henry is the #1 New York Times bestselling author known for her smart, swoony contemporary romances. People We Meet on Vacation solidified her status as a must-read romance author. She lives in Cincinnati with her husband and their two very literary cats.",
            "awards": [
                "Goodreads Choice Awards Best Romance (2021)",
                "New York Times Bestseller for over 80 weeks",
                "LibraryReads Pick",
                "Over 1.5 million copies sold"
            ],
            "reviews": [
                {
                    "reviewer": "The Washington Post",
                    "quote": "A love letter to love itself... Enormously romantic and profoundly relatable."
                },
                {
                    "reviewer": "Jodi Picoult",
                    "quote": "Pure joy. The perfect summer escape."
                }
            ],
            "funFacts": [
                "Features 10 vacations over 10 years, each in a different location",
                "The New York City vs. small town dynamic mirrors Henry's own life",
                "Explores the friends-to-lovers trope with fresh perspective",
                "A film adaptation is in development with Netflix",
                "The book is told in alternating timelines (past trips vs. present)"
            ],
            "targetAudience": "Fans of friends-to-lovers romance, travel enthusiasts, and readers who love will-they-won't-they tension. Great for beach reading!",
            "similarTitles": ["Beach Read", "One Day", "The Friend Zone"]
        },

        # BOOK 11: The Spanish Love Deception
        "book_011": {
            "extendedDescription": "Catalina Martín desperately needs a date to her sister's wedding in Spain. Especially since her little white lie about her American boyfriend has spiraled out of control. Now everyone she knows—including her ex and his fiancée—will be there. But finding someone willing to cross the Atlantic on short notice is proving impossible. Until Aaron Blackford, her infuriating colleague, offers to step in. The catch? Aaron has his own reasons for wanting to go to Spain—reasons he's not sharing with Catalina. As they jet off to Europe, embarking on this ridiculous charade, Catalina realizes that she's made a terrible mistake. Aaron isn't the uptight, boring man she thought he was. He's witty, charming, and makes her heart race. And spending a week pretending to be in love with him might be more dangerous than Catalina ever imagined.",
            "authorBio": "Elena Armas is a Spanish writer, a self-confessed hopeless romantic, and proud book hoarder. After years of devouring HEAs and talking—okay, fine, forcing—her friends and family into reading romance, she decided to give writing her own romances a shot. The Spanish Love Deception was her debut novel and became a viral BookTok sensation.",
            "awards": [
                "Goodreads Choice Awards Best Romance Finalist (2021)",
                "BookTok Viral Hit",
                "New York Times Bestseller",
                "Indie Next Pick"
            ],
            "reviews": [
                {
                    "reviewer": "Helen Hoang, author of The Kiss Quotient",
                    "quote": "Delicious slow-burn romance... I could not put it down!"
                },
                {
                    "reviewer": "Buzzfeed",
                    "quote": "If you love fake dating and enemies-to-lovers, this is your next obsession."
                }
            ],
            "funFacts": [
                "Originally self-published before being picked up by Atria Books",
                "Became a BookTok sensation with millions of views",
                "Features both American and Spanish settings",
                "At 450+ pages, it's a slow-burn romance fans love to savor",
                "The author is actually Spanish, adding authentic cultural details"
            ],
            "targetAudience": "Fans of workplace romance, fake dating, and enemies-to-lovers tropes. Perfect for readers who love long, slow-burn romances.",
            "similarTitles": ["The Hating Game", "The Kiss Quotient", "Beach Read"]
        },

        # BOOK 12: It Ends with Us
        "book_012": {
            "extendedDescription": "Lily hasn't always had it easy, but that's never stopped her from working hard for the life she wants. She's come a long way from the small town in Maine where she grew up—she graduated from college, moved to Boston, and started her own business. When she feels a spark with a gorgeous neurosurgeon named Ryle Kincaid, everything in Lily's life suddenly seems almost too good to be true. Ryle is assertive, stubborn, maybe even a little arrogant. He's also sensitive, brilliant, and has a total soft spot for Lily. The two fall fast and hard. But as questions about her new relationship overwhelm her, so do thoughts of Atlas Corrigan—her first love who suddenly reappears in unexpected ways. Lily must make an impossible choice that will leave readers wondering: can you ever really leave the past behind?",
            "authorBio": "Colleen Hoover is the #1 New York Times bestselling author of more than twenty novels. It Ends with Us is her most personal work, inspired by the relationship between her mother and father. The novel sparked important conversations about domestic violence and has become one of the bestselling books of the past decade.",
            "awards": [
                "Goodreads Choice Awards Best Romance (2016)",
                "Over 5 million copies sold worldwide",
                "Amazon Charts #1 for over 100 weeks",
                "Translated into 40+ languages",
                "Major motion picture in development (starring Blake Lively)"
            ],
            "reviews": [
                {
                    "reviewer": "The Washington Post",
                    "quote": "A bold and unflinching look at domestic abuse that will leave you breathless."
                },
                {
                    "reviewer": "Kirkus Reviews",
                    "quote": "Hoover's writing is raw, powerful, and heartbreakingly honest."
                }
            ],
            "funFacts": [
                "The book's title refers to breaking the cycle of abuse",
                "Has a sequel called 'It Starts with Us' published in 2022",
                "Became a viral sensation on BookTok years after publication",
                "Hoover's most emotionally difficult book to write",
                "The protagonist owns a flower shop (Lily Bloom - get it?)"
            ],
            "targetAudience": "Mature readers interested in contemporary romance with serious themes. Important reading for discussions about domestic violence and toxic relationships.",
            "contentWarnings": ["Domestic violence", "Emotional abuse", "Sexual assault (past trauma)", "Difficult relationship dynamics"],
            "similarTitles": ["Verity", "November 9", "Ugly Love"]
        },

        # BOOK 13: The Hating Game
        "book_013": {
            "extendedDescription": "Lucy Hutton and Joshua Templeman hate each other. Not dislike. Not begrudgingly tolerate. Hate. And they have no problem displaying their feelings through a series of passive-aggressive maneuvers as they sit across from each other, executive assistants to co-CEOs of a publishing company. Lucy can't understand Joshua's joyless, uptight, meticulous approach to his job. Joshua is clearly baffled by Lucy's overly bright clothes, quirkiness, and Pollyanna attitude. Now up for the same promotion, their battle of wills has come to a head and Lucy refuses to back down when their latest game could cost her her dream job. But the tension between Lucy and Joshua has also reached its boiling point, and Lucy is discovering that maybe she doesn't hate Joshua. And maybe, he doesn't hate her either. Or maybe this is just another game.",
            "authorBio": "Sally Thorne is the USA Today bestselling author of The Hating Game and Second First Impressions. She lives in Canberra, Australia, and spends her days writing quirky, swoony contemporary romances. The Hating Game was her debut novel and became a global phenomenon, later adapted into a film starring Lucy Hale.",
            "awards": [
                "Goodreads Choice Awards Best Romance Finalist (2016)",
                "New York Times and USA Today Bestseller",
                "Over 1 million copies sold",
                "Adapted into a major motion picture (2021)"
            ],
            "reviews": [
                {
                    "reviewer": "Entertainment Weekly",
                    "quote": "A sexy, charming rom-com... The Hating Game is bursting with sexual tension."
                },
                {
                    "reviewer": "NPR",
                    "quote": "A smart, funny workplace romance that will have you swooning."
                }
            ],
            "funFacts": [
                "The movie stars Lucy Hale and Austin Stowell",
                "Features the popular 'Smurfette' nickname dynamic",
                "The office setting makes it perfect for fans of The Office",
                "Thorne originally self-published it before traditional publication",
                "Spawned countless 'enemies-to-lovers' workplace romances"
            ],
            "targetAudience": "Fans of workplace romance, enemies-to-lovers tropes, and witty banter. Perfect for readers who love sexual tension and slow burns.",
            "similarTitles": ["The Spanish Love Deception", "Beach Read", "The Kiss Quotient"]
        },

        # BOOK 14: Project Hail Mary
        "book_014": {
            "extendedDescription": "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it. All he knows is that he's been asleep for a very, very long time. And he's just been awakened to find himself millions of miles from home, with nothing but two corpses for company. His crewmates dead, his memories fuzzily returning, Ryland realizes that an impossible task now confronts him. Hurtling through space on this tiny ship, it's up to him to puzzle out an impossible scientific mystery—and conquer an extinction-level threat to our species. And with the clock ticking down and the nearest human being light-years away, he's got to do it all alone. Or does he? An irresistible interstellar adventure as only Andy Weir could imagine it, Project Hail Mary is a tale of discovery, speculation, and survival to rival The Martian—while taking us to places it never dreamed of going.",
            "authorBio": "Andy Weir is the bestselling author of The Martian and Artemis. He was first hired as a programmer for a national laboratory at age fifteen and has been working as a software engineer ever since. He is also a lifelong space nerd and a devoted hobbyist of subjects like relativistic physics, orbital mechanics, and the history of manned spaceflight. Project Hail Mary is his third novel.",
            "awards": [
                "Goodreads Choice Awards Best Science Fiction (2021)",
                "Audie Award for Audiobook of the Year (2022)",
                "Hugo Award Nominee",
                "Over 3 million copies sold worldwide",
                "Ryan Gosling-starring film in development"
            ],
            "reviews": [
                {
                    "reviewer": "The New York Times",
                    "quote": "If you loved The Martian, you'll love this... Weir has done it again.",
                    "rating": 5
                },
                {
                    "reviewer": "Barack Obama",
                    "quote": "A gripping sci-fi adventure with heart. Couldn't put it down."
                },
                {
                    "reviewer": "NPR",
                    "quote": "Weir's finest work yet. Funny, thrilling, and scientifically fascinating."
                }
            ],
            "funFacts": [
                "The audiobook narrated by Ray Porter is considered one of the best ever",
                "Weir researched actual astrophysics to make the science accurate",
                "Features one of the most beloved alien characters in recent sci-fi",
                "The book's twist about halfway through shocked readers worldwide",
                "Ryan Gosling will star in and produce the film adaptation"
            ],
            "targetAudience": "Fans of The Martian, hard science fiction, space exploration, and anyone who loves clever problem-solving and humor in their sci-fi.",
            "similarTitles": ["The Martian", "Artemis", "The Long Way to a Small, Angry Planet"]
        },

        # BOOK 15: The Midnight Library
        "book_015": {
            "extendedDescription": "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets? Nora Seed finds herself in the Midnight Library after deciding she doesn't want to live anymore. In this library, she's given the chance to undo her regrets and try out different versions of her life. What would have happened if she'd pursued her Olympic swimming dreams? If she'd married her ex-fiancé? If she'd become a glaciologist? But things aren't always what Nora imagined they'd be, and soon her choices face her with the ultimate question: what is the best way to live?",
            "authorBio": "Matt Haig is the author of the internationally bestselling novels The Midnight Library, The Humans, and How to Stop Time, along with several highly acclaimed memoirs including Reasons to Stay Alive. His work has been translated into more than 40 languages. He has written for The New York Times, The Guardian, and The Observer.",
            "awards": [
                "Goodreads Choice Awards Best Fiction (2020)",
                "British Book Awards Fiction Book of the Year Nominee",
                "Over 5 million copies sold worldwide",
                "Translated into 45+ languages"
            ],
            "reviews": [
                {
                    "reviewer": "The New York Times",
                    "quote": "A dazzling novel about all the choices that go into a life well lived."
                },
                {
                    "reviewer": "Jodi Picoult",
                    "quote": "A beautiful fable... It's a celebration of the ordinary."
                },
                {
                    "reviewer": "Real Simple",
                    "quote": "The perfect book for anyone who's ever wondered 'what if?'"
                }
            ],
            "funFacts": [
                "Haig has spoken openly about how his own depression inspired the book",
                "The library concept was inspired by Jorge Luis Borges' 'The Library of Babel'",
                "Each alternate life Nora tries is fully realized and different",
                "A film adaptation is in development",
                "The book has helped many readers dealing with mental health challenges"
            ],
            "targetAudience": "Anyone who's ever wondered about the road not taken. Perfect for fans of philosophical fiction, magical realism, and stories about mental health.",
            "similarTitles": ["The Invisible Life of Addie LaRue", "Klara and the Sun", "Life After Life"]
        },

        # LOT 6: Sewing Machine
        "lot_006": {
            "whatsIncluded": [
                "Brother CS6000i sewing machine",
                "25 built-in stitches",
                "60 sewing machine accessories",
                "Wide table for quilting",
                "6 quick-change sewing feet",
                "DVD instruction guide",
                "Printed instruction manual",
                "Protective dust cover",
                "Power cord and foot pedal",
                "Thread guide card",
                "Bobbins (6 included)",
                "Seam ripper and cleaning brush"
            ],
            "howToUse": "Thread the machine using the numbered guide on the machine (start at 1, end at 6). Wind a bobbin by placing thread on the top pin, wrapping around the bobbin winder, and pressing the foot pedal while holding the thread end. Insert bobbin in the compartment below the needle. Select your stitch using the dial. Place fabric under the presser foot, lower the foot, and gently press the pedal. The machine will do the rest! Start with straight stitches on scrap fabric to practice. The DVD guide includes video tutorials for beginners.",
            "careInstructions": "Clean the machine after each use with the included brush - remove lint from bobbin area and under feed dogs. Oil the machine every 8-10 hours of use (oil not included, but available at any craft store). Always unplug when not in use. Store in the dust cover. Return with all accessories in their compartments.",
            "safetyInfo": "Keep fingers away from the needle at all times. ALWAYS turn off power before threading needle or changing feet. Unplug when making adjustments. Do not sew over pins. Children under 12 require adult supervision. Do not force fabric through - let the machine feed it naturally. Never leave running unattended.",
            "recommendedUses": [
                "Hemming pants and curtains",
                "Making simple clothing (skirts, pillow cases)",
                "Quilting projects",
                "Mending torn clothes",
                "Creating Halloween costumes",
                "Sewing masks and other fabric items",
                "Upcycling old clothes",
                "Learning to sew as a new hobby"
            ],
            "phillyTips": [
                "Join Philly Stitches (phillysewing.com) for free classes at the Free Library",
                "Visit Fabric Row (4th Street) to buy materials - it's a Philly treasure!",
                "Great for making Eagles gear or Philly pride items",
                "Perfect for South Philly neighbors doing alterations",
                "Use it for Renaissance Faire costumes (PA Renaissance Faire is nearby!)",
                "Check out NextFab's sewing workshops for advanced techniques"
            ],
            "bestSeasons": ["Year-round", "Fall (costume making)", "Winter (indoor crafts)"],
            "ageRecommendation": "Ages 12+ (with supervision), 16+ (independent use)",
            "depositAmount": 50.00,
            "replacementCost": 175.00
        },

        # LOT 7: Pickleball Set
        "lot_007": {
            "whatsIncluded": [
                "Portable pickleball net with frame",
                "4 pickleball paddles (2 blue, 2 red)",
                "6 indoor pickleballs (yellow)",
                "6 outdoor pickleballs (green)",
                "Carrying bag for net",
                "Paddle bag",
                "Boundary line tape (for outdoor courts)",
                "Rule book and court diagram",
                "Score keeper"
            ],
            "howToUse": "Set up the net on any flat surface - it takes about 2 minutes and requires no tools. The net is regulation height (34 inches at center). Use indoor balls for gym floors, outdoor balls for asphalt/concrete. The game is played doubles (2v2) or singles. Serve diagonally, let ball bounce once on each side before volleying. First to 11 points (must win by 2) wins! The rule book includes beginner tips and scoring guidelines. Court size is 20x44 feet - use the included tape to mark boundaries outdoors.",
            "careInstructions": "Wipe paddles with damp cloth after use. Do not leave pickleballs in direct sunlight (they can warp). Store net in carrying bag when not in use - make sure it's dry before storing. Check all pieces before returning using the checklist inside the bag. Report any damage immediately.",
            "safetyInfo": "Wear proper athletic shoes to prevent slipping. Stay hydrated, especially in Philadelphia's humid summers. Warm up before playing to prevent muscle strains. Be aware of court boundaries to avoid collisions. Not recommended for children under 8 due to paddle weight and ball speed.",
            "recommendedUses": [
                "Backyard family games",
                "Park recreation",
                "Neighborhood tournaments",
                "Low-impact exercise for seniors",
                "Social gatherings",
                "Teaching kids racquet sports",
                "Alternative to tennis for smaller spaces"
            ],
            "phillyTips": [
                "Play at FDR Park's dedicated pickleball courts (free!)",
                "Pretzel Park in Manayunk has pickleball lines painted",
                "Join Philadelphia Pickleball Club for group play",
                "Great for neighborhood block parties in South Philly",
                "Set up at Penn Treaty Park along the Delaware waterfront",
                "Perfect for Fairmount Park family reunions",
                "Avoid midday play in July/August - too hot! Early morning or evening is best"
            ],
            "bestSeasons": ["Spring", "Summer", "Fall"],
            "ageRecommendation": "Ages 8+ (all ages can enjoy with proper supervision)",
            "depositAmount": 0,
            "replacementCost": 150.00
        },

        # LOT 8: Food Dehydrator
        "lot_008": {
            "whatsIncluded": [
                "5-tray electric food dehydrator",
                "Adjustable temperature control (95-160°F)",
                "48-hour timer",
                "Recipe book with 50+ recipes",
                "Quick start guide",
                "2 mesh screens for small items (herbs, berries)",
                "2 fruit roll-up sheets",
                "Instruction manual"
            ],
            "howToUse": "Wash and slice food evenly (1/4 inch thick works best). Arrange on trays without overlapping. For fruits, you can pre-treat with lemon juice to prevent browning. Set temperature based on food type: 95°F for herbs, 135°F for vegetables/fruits, 145°F for meat jerky. Set timer (most items take 6-12 hours). The dehydrator will auto-shutoff when done. Food is ready when it's leathery or crispy with no moisture pockets. Store dehydrated food in airtight containers.",
            "careInstructions": "ALWAYS unplug and let cool completely before cleaning. Trays are dishwasher safe (top rack only) or hand wash with warm soapy water. Wipe base unit with damp cloth - NEVER submerge in water. Clean after each use to prevent odor buildup. Ensure completely dry before storing.",
            "safetyInfo": "Place on heat-resistant surface away from walls (needs ventilation). Never leave running unattended overnight. Keep away from children and pets during operation - gets very hot! Do not dehydrate meat at temperatures below 145°F (food safety risk). Always follow USDA guidelines for meat dehydration. Unplug when not in use.",
            "recommendedUses": [
                "Making healthy fruit snacks for kids",
                "Preserving garden harvest",
                "Creating beef/turkey jerky",
                "Drying herbs from your garden",
                "Making fruit leather",
                "Preparing camping/hiking snacks",
                "Reducing food waste",
                "Creating potpourri from flowers"
            ],
            "phillyTips": [
                "Perfect for preserving produce from Philly farmers markets (summer/fall)",
                "Dry tomatoes from your South Philly row home garden",
                "Make apple chips with Pennsylvania apples in fall",
                "Great for using veggies from community gardens",
                "Prep healthy snacks before hiking in Wissahickon",
                "Consider borrowing during peak harvest season (August-October)"
            ],
            "bestSeasons": ["Summer", "Fall", "Year-round for meal prep"],
            "ageRecommendation": "Adults 18+ (supervision required for teens)",
            "depositAmount": 25.00,
            "replacementCost": 80.00
        },

        # LOT 9: Ukulele Kit
        "lot_009": {
            "whatsIncluded": [
                "Kala KA-15S soprano ukulele",
                "Padded gig bag with strap",
                "Clip-on digital tuner",
                "Extra set of strings (Aquila Nylgut)",
                "3 felt picks",
                "Beginner's chord chart (laminated)",
                "Online lesson access code (3 months)",
                "Ukulele for Beginners book",
                "Polishing cloth"
            ],
            "howToUse": "Tune the ukulele using the included tuner - strings should be G-C-E-A from top to bottom (clip tuner on headstock and pluck each string). Start with basic chords: C, G, F, and Am. Use the chord chart to see finger placement. Strum with your thumb or use a felt pick. The included book teaches songs progressively from easy to moderate. Practice 15-20 minutes daily for best results. Online lessons include video tutorials. Retuning before each practice session is normal - nylon strings stretch!",
            "careInstructions": "Store in the gig bag when not in use. Keep away from direct heat/sunlight (can warp wood). Wipe strings with cloth after playing to extend string life. Do not over-tighten strings - can damage neck. If traveling with it, loosen strings slightly. Report any cracks or damage immediately. Return with all accessories in the gig bag.",
            "safetyInfo": "No significant safety concerns. Keep away from extreme temperatures and humidity. Check that strings are properly installed before playing (loose strings can snap). Not a toy - children under 6 should be supervised.",
            "recommendedUses": [
                "Learning music as a beginner",
                "Practicing before buying your own",
                "Adding to a music collection temporarily",
                "Entertaining at small gatherings",
                "Developing finger dexterity",
                "Songwriting and composition",
                "Meditation and relaxation through music",
                "Testing interest before committing to lessons"
            ],
            "phillyTips": [
                "Join Philly Uke Jam at World Cafe Live (first Monday each month)",
                "Take it to Rittenhouse Square for impromptu jam sessions",
                "Great for serenading on South Street",
                "Perfect for Philly Folk Festival performers (August)",
                "Borrow before Music in the Parks summer series",
                "Check out Settlement Music School for free ukulele workshops",
                "Bring to PORCH (Philly folks' front porch concerts)"
            ],
            "bestSeasons": ["Year-round", "Spring/Summer for outdoor playing"],
            "ageRecommendation": "Ages 6+ (perfect beginner instrument for all ages!)",
            "depositAmount": 0,
            "replacementCost": 65.00
        },

        # LOT 10: Museum Pass
        "lot_010": {
            "whatsIncluded": [
                "Digital museum pass (printed confirmation)",
                "Access for up to 4 people",
                "Valid for one visit per museum",
                "List of participating museums",
                "Museum hours and directions",
                "Special exhibition information"
            ],
            "howToUse": "Reserve the pass online up to 7 days in advance. Choose your museum and date. You'll receive a confirmation email with a pass number. Present the pass (printed or on phone) at the museum entrance. The pass grants free general admission for up to 4 people. Some special exhibitions may require additional fees - check the museum's website. Pass is valid for ONE DAY at ONE museum. You must return the pass card to the library within 3 days after your visit.",
            "careInstructions": "Keep pass card in good condition. Do not write on or damage the card. Return promptly after your visit date so others can use it. If lost, contact library immediately - there is a replacement fee.",
            "safetyInfo": "Follow all museum rules and guidelines. Supervise children at all times. Many museums have bag check policies - plan accordingly. Photography policies vary by museum.",
            "recommendedUses": [
                "Family outings and education",
                "Visiting museums before you commit to membership",
                "Entertaining out-of-town guests",
                "School projects and research",
                "Date days",
                "Learning about history and culture",
                "Free entertainment for families",
                "Exploring Philadelphia's rich museum scene"
            ],
            "phillyTips": [
                "MUST-SEE: Philadelphia Museum of Art (Rocky Steps!)",
                "Barnes Foundation - incredible impressionist collection",
                "Franklin Institute - perfect for kids and science lovers",
                "African American Museum - powerful local history",
                "Museum of the American Revolution - Philly's founding story",
                "National Constitution Center - interactive civics lessons",
                "Mütter Museum - oddities and medical history (not for squeamish!)",
                "Eastern State Penitentiary - former prison, now museum",
                "TIP: Book early - passes go fast for popular museums!",
                "TIP: Visit on weekday mornings for smaller crowds",
                "TIP: Combine with Reading Terminal Market for lunch (walking distance from many museums)"
            ],
            "bestSeasons": ["Year-round", "Winter (indoor activity)", "Rainy days"],
            "ageRecommendation": "All ages (museum-dependent)",
            "depositAmount": 0,
            "replacementCost": 30.00
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
    print("✅ BATCH 2 COMPLETE")
    print("=" * 60)
    print(f"Added details to {added_count} items")
    print(f"\nItems with details:")
    print("  📚 Books: 10 (book_006 to book_015)")
    print("  📦 Library of Things: 5 (lot_006 to lot_010)")
    print(f"\nTotal Progress: 25 / 116 items (21.6%)")
    print(f"Remaining: 91 items")
    print("=" * 60)

if __name__ == '__main__':
    add_details_batch_2()

#!/usr/bin/env python3
"""
Add detailed information to catalog items - Batch 5
This script adds rich details to 10 items: book_051 to book_060
"""

import json
import sys
from pathlib import Path

# Define the catalog path
CATALOG_PATH = Path(__file__).parent.parent / "data" / "catalog.json"

# Details for each item in batch 5
BATCH_5_DETAILS = {
    "book_051": {
        "extendedDescription": "As a botanist and member of the Citizen Potawatomi Nation, Robin Wall Kimmerer has spent decades living between two cultures and two ways of understanding the natural world. Weaving together her knowledge of science with Indigenous wisdom, Kimmerer shows how plants and animals teach us how to live. From the Cherokee creation story about Skywoman to the gift economy of strawberries, from the lessons of asters to the power of gratitude, Braiding Sweetgrass is a hymn of praise to the natural world and a call to recognize all that the earth gives us. This is a book about the need to recognize and reciprocate the gifts of the earth, to consider the nonhuman as our oldest teachers, and to heal our relationship with the living world.",
        "authorBio": "Robin Wall Kimmerer is a mother, scientist, decorated professor, and enrolled member of the Citizen Potawatomi Nation. She is the founding director of the Center for Native Peoples and the Environment. Her work has appeared in Orion, Whole Terrain, and numerous scientific journals.",
        "awards": [
            "New York Times Bestseller for over 150 weeks",
            "Long-listed for the National Book Award",
            "Over 1.5 million copies sold",
            "Named to Barack Obama's reading list",
            "Winner of the Sigurd F. Olson Nature Writing Award"
        ],
        "reviews": [
            {
                "reviewer": "Elizabeth Gilbert",
                "quote": "This book is a hymn of love to the world... I'm rooted in the wordplay of Kimmerer's glorious language.",
                "rating": 5
            },
            {
                "reviewer": "The Washington Post",
                "quote": "A powerful antidote to the manufactured darkness of our times."
            }
        ],
        "funFacts": [
            "The book took Kimmerer over a decade to write",
            "It became a bestseller 7 years after publication through word of mouth",
            "Sweetgrass is considered a sacred plant in many Indigenous cultures",
            "The three-strand braid metaphor represents Indigenous knowledge, scientific knowledge, and story",
            "Kimmerer is the first Native American woman to hold a tenure-track position in SUNY-ESF's history"
        ],
        "targetAudience": "Nature lovers, environmentalists, readers interested in Indigenous wisdom, scientists seeking alternative perspectives, and anyone looking to deepen their relationship with the natural world.",
        "similarTitles": ["The Overstory", "Sand County Almanac", "The Hidden Life of Trees"]
    },
    "book_052": {
        "extendedDescription": "In Salt, Fat, Acid, Heat, chef and writer Samin Nosrat distills the essential elements of good cooking into four simple principles. Salt enhances flavor; fat delivers flavor and creates texture; acid balances flavor; and heat determines the texture of food. By mastering these four variables, Nosrat argues, you'll be able to cook anything—and cook it deliciously. With charming narrative, illustrated guides, and over 100 recipes, this book is both a cookbook and a manifesto. It's about understanding food at a fundamental level so you can improvise confidently in the kitchen. Whether you're a novice or experienced cook, this book will transform how you think about food.",
        "authorBio": "Samin Nosrat is a cook, teacher, and writer. She has worked in the kitchens of Chez Panisse and Eccolo in Berkeley. She is the host and executive producer of the Netflix documentary series based on her book. She lives, cooks, and gardens in Berkeley, California.",
        "awards": [
            "James Beard Award for General Cooking (2018)",
            "#1 New York Times Bestseller",
            "Netflix documentary series (2018)",
            "Over 1 million copies sold",
            "Named Best Cookbook by multiple publications"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "A go-to manual for both novice and veteran... A game changer.",
                "rating": 5
            },
            {
                "reviewer": "Michael Pollan",
                "quote": "Now I finally understand how to cook!"
            }
        ],
        "funFacts": [
            "Nosrat studied English literature before becoming a chef",
            "She apprenticed at Chez Panisse, one of America's most influential restaurants",
            "The book's illustrations were done by Wendy MacNaughton",
            "Each section of the book is printed in a different color",
            "The Netflix series took viewers to Italy, Japan, Mexico, and Berkeley"
        ],
        "targetAudience": "Home cooks at any level, culinary students, food enthusiasts, and anyone who wants to truly understand the fundamentals of cooking rather than just follow recipes.",
        "similarTitles": ["The Food Lab", "On Food and Cooking", "How to Cook Everything"]
    },
    "book_053": {
        "extendedDescription": "Anthony Bourdain, chef, writer, and television host, blew the lid off the restaurant world with Kitchen Confidential. In this sharp, funny, and brutally honest memoir, Bourdain takes readers behind the swinging kitchen door to reveal what really happens in restaurants. From his first oyster as a child to the professional kitchen's intense, drug-fueled, ego-driven culture, Bourdain pulls no punches. He dishes on bad behavior, exposes unsavory practices (don't order fish on Mondays!), and introduces unforgettable characters who populate the underbelly of the culinary world. This is a book that changed how America thinks about chefs and restaurants, making Bourdain a household name.",
        "authorBio": "Anthony Bourdain (1956-2018) was a chef, author, and television personality. He hosted the acclaimed travel and food shows No Reservations and Parts Unknown. Kitchen Confidential was his breakthrough book that launched his media career. He was known for his fearless exploration of global cuisines and cultures.",
        "awards": [
            "New York Times Bestseller",
            "Over 1 million copies sold",
            "Food Book of the Year",
            "Launched Bourdain's TV career",
            "Considered a classic of food writing"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Funny, shocking, and compulsively readable... A guilty pleasure.",
                "rating": 4
            },
            {
                "reviewer": "Entertainment Weekly",
                "quote": "Wickedly funny and shockingly honest."
            }
        ],
        "funFacts": [
            "Bourdain wrote it in two months between shifts at a restaurant",
            "The book started as an article in The New Yorker",
            "It warns against ordering fish on Mondays (it's the oldest)",
            "Bourdain worked at Les Halles in Manhattan when he wrote it",
            "The book's success allowed him to leave professional kitchens"
        ],
        "targetAudience": "Foodies, restaurant industry workers, memoir readers, fans of Bourdain's TV shows, and anyone curious about what really happens in restaurant kitchens.",
        "contentWarnings": ["Drug use", "Explicit language", "Substance abuse"],
        "similarTitles": ["Heat by Bill Buford", "Blood, Bones & Butter", "Medium Raw"]
    },
    "book_054": {
        "extendedDescription": "In April 1992, Christopher McCandless walked into the Alaskan wilderness with little food and equipment, hoping to live off the land. Four months later, his decomposed body was found by moose hunters in an abandoned bus. McCandless had starved to death. Into the Wild is Jon Krakauer's haunting investigation into what drove this idealistic young man to abandon everything—family, money, future—to pursue his dream of living in the wild. Drawing on McCandless's journals and interviews with those who knew him, Krakauer creates a portrait of a searcher torn between the comfort of society and the call of the wild. This is a story about the allure and danger of the untamed, and about a young man's tragic quest for transcendence.",
        "authorBio": "Jon Krakauer is an American writer and mountaineer. He is the author of Into Thin Air, Under the Banner of Heaven, and Where Men Win Glory. His work has appeared in Outside magazine, where he is a contributing editor. He lives in Colorado.",
        "awards": [
            "National Book Critics Circle Award Finalist",
            "New York Times Bestseller",
            "Over 4 million copies sold",
            "Sean Penn film adaptation (2007)",
            "Modern classic of adventure writing"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Compelling and tragic... Krakauer is a superb storyteller.",
                "rating": 5
            },
            {
                "reviewer": "The Washington Post",
                "quote": "A narrative of arresting force."
            }
        ],
        "funFacts": [
            "McCandless burned his money and gave away his savings before his journey",
            "He adopted the name 'Alexander Supertramp'",
            "The story sparked debate about whether McCandless was brave or foolish",
            "Eddie Vedder composed the film's soundtrack",
            "The bus where McCandless died became a pilgrimage site (removed in 2020)"
        ],
        "targetAudience": "Adventure seekers, nature enthusiasts, philosophy readers, young adults questioning conventional life, and anyone drawn to stories of wilderness and self-discovery.",
        "contentWarnings": ["Death by starvation", "Family estrangement"],
        "similarTitles": ["Wild", "A Walk in the Woods", "Into Thin Air"]
    },
    "book_055": {
        "extendedDescription": "The Appalachian Trail stretches 2,100 miles from Georgia to Maine, through some of the most beautiful wilderness in America. Bill Bryson, a humor writer who hadn't hiked in years, decides to walk it. Accompanied by his old friend Stephen Katz—an overweight, out-of-shape recovering alcoholic—Bryson sets off on an adventure filled with mishaps, encounters with eccentric characters, and hilarious observations. Along the way, he delves into the trail's history, the ecology of the forests, and the questionable judgment of people who think it's a good idea to carry everything they own on their backs for months. A Walk in the Woods is part travelogue, part environmental meditation, and entirely funny.",
        "authorBio": "Bill Bryson is the bestselling author of books on travel, the English language, and science, including A Short History of Nearly Everything and At Home. Born in Iowa, he lived in England for many years before returning to the U.S. He is known for his wit and accessible writing style.",
        "awards": [
            "New York Times Bestseller",
            "Over 4 million copies sold",
            "Robert Redford film adaptation (2015)",
            "Aventis Prize for Science Books",
            "Modern classic of travel writing"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Hilarious, erudite, and fundamentally serious... Bryson at his best.",
                "rating": 5
            },
            {
                "reviewer": "Los Angeles Times",
                "quote": "A grand adventure... Informative and laugh-out-loud funny."
            }
        ],
        "funFacts": [
            "Bryson and Katz hiked about 800 miles before giving up",
            "The book renewed interest in the Appalachian Trail",
            "Bryson is terrified of bears, which features prominently",
            "Stephen Katz is a real person and remains friends with Bryson",
            "The book balances humor with serious environmental concerns"
        ],
        "targetAudience": "Humor readers, hikers and outdoor enthusiasts, armchair travelers, nature lovers, and fans of Bryson's witty observations.",
        "similarTitles": ["Into the Wild", "Wild", "The Lost City of Z"]
    },
    "book_056": {
        "extendedDescription": "Sixteen-year-old Starr Carter lives in two worlds: the poor, mostly Black neighborhood where she lives, and the wealthy, mostly white prep school she attends. This uneasy balance is shattered when she witnesses the fatal shooting of her childhood best friend, Khalil, at the hands of a police officer. Khalil was unarmed. Starr is the only witness to what really happened. What she says could destroy her community. What she doesn't say could get her killed. As protests erupt and the media descends, Starr must find her voice and stand up for what's right. The Hate U Give is a searing, urgent, and powerful story about racism, police violence, and speaking truth to power.",
        "authorBio": "Angie Thomas is a former teen rapper whose debut novel The Hate U Give was inspired by the Black Lives Matter movement. She holds a BFA in Creative Writing from Belhaven University. She is also the author of On the Come Up and Concrete Rose. She lives in Mississippi.",
        "awards": [
            "#1 New York Times Bestseller for over 100 weeks",
            "William C. Morris Award",
            "Coretta Scott King Author Honor",
            "Boston Globe-Horn Book Award",
            "Major motion picture (2018)"
        ],
        "reviews": [
            {
                "reviewer": "John Green",
                "quote": "A brilliant, luminous story about identity, injustice, and finding your voice.",
                "rating": 5
            },
            {
                "reviewer": "The New York Times",
                "quote": "Stunning, brilliant, and now necessary."
            }
        ],
        "funFacts": [
            "The title refers to Tupac's THUG LIFE acronym: 'The Hate U Give Little Infants F***s Everybody'",
            "Thomas wrote it as her senior project in college",
            "It spent over 100 weeks on the NYT bestseller list",
            "The film starred Amandla Stenberg",
            "It's been both banned and celebrated in schools across America"
        ],
        "targetAudience": "Young adults and adults, readers interested in social justice, educators, book clubs, and anyone seeking to understand police violence and systemic racism.",
        "contentWarnings": ["Police violence", "Death", "Racism", "Gang violence"],
        "similarTitles": ["Dear Martin", "All American Boys", "The Poet X"]
    },
    "book_057": {
        "extendedDescription": "Percy Jackson is about to be kicked out of boarding school... again. But that's the least of his troubles. Lately, mythological monsters are slipping out of Greek myths to attack him. Then Percy discovers the truth: he's the son of Poseidon, god of the sea. He's sent to Camp Half-Blood, a summer camp for demigods, where he trains with other children of the gods. But the camp is in an uproar: Zeus's master lightning bolt has been stolen, and Percy is the prime suspect. To clear his name and prevent a war among the gods, Percy must retrieve the bolt. Alongside his friends Annabeth (daughter of Athena) and Grover (a satyr), Percy embarks on a cross-country quest filled with monsters, magic, and the power of friendship.",
        "authorBio": "Rick Riordan is the #1 New York Times bestselling author of the Percy Jackson series, the Kane Chronicles, and the Heroes of Olympus series. A former middle school teacher, he began writing the Percy Jackson books for his son. He lives in Boston with his family.",
        "awards": [
            "New York Times Bestseller",
            "Mark Twain Award",
            "Over 180 million copies sold worldwide (entire series)",
            "Disney+ series (2023)",
            "One of the most popular YA fantasy series"
        ],
        "reviews": [
            {
                "reviewer": "School Library Journal",
                "quote": "Perfectly paced, with electrifying moments chasing each other.",
                "rating": 5
            },
            {
                "reviewer": "The New York Times",
                "quote": "Funny and fast-paced... Kids will love it."
            }
        ],
        "funFacts": [
            "Riordan created Percy Jackson for his son Haley, who has ADHD and dyslexia",
            "Percy also has ADHD and dyslexia, reframed as demigod traits",
            "The series has 5 books plus multiple spin-offs",
            "Camp Half-Blood is based on summer camps Riordan attended",
            "The books make Greek mythology accessible and exciting for modern kids"
        ],
        "targetAudience": "Middle grade and young adult readers, mythology enthusiasts, reluctant readers (especially with ADHD/dyslexia), and fans of fantasy adventure.",
        "similarTitles": ["Harry Potter", "Magnus Chase", "The Kane Chronicles"]
    },
    "book_058": {
        "extendedDescription": "Hazel Grace Lancaster is sixteen and has terminal thyroid cancer that has spread to her lungs. She's resigned to her fate until she meets Augustus Waters at a cancer support group. Augustus is charming, confident, and in remission from osteosarcoma. He's also determined to leave his mark on the world. The two fall in love, bonding over books, especially a novel called An Imperial Affliction. When Augustus arranges a trip to Amsterdam to meet the reclusive author, their love story takes flight. But cancer is ever-present, and both teens must confront mortality, meaning, and what it means to live a good life. The Fault in Our Stars is funny, heartbreaking, and unforgettable—a story about love in the face of death.",
        "authorBio": "John Green is the #1 New York Times bestselling author of Looking for Alaska, Paper Towns, and Turtles All the Way Down. He is also one half of the Vlogbrothers and the co-creator of Crash Course. He lives in Indianapolis with his family.",
        "awards": [
            "#1 New York Times Bestseller",
            "TIME Magazine's 100 Most Influential People",
            "Over 25 million copies sold worldwide",
            "Major motion picture (2014)",
            "Michael L. Printz Award Honor"
        ],
        "reviews": [
            {
                "reviewer": "The Wall Street Journal",
                "quote": "A smarter, edgier Love Story... Funny, sweet, and tragic.",
                "rating": 5
            },
            {
                "reviewer": "Entertainment Weekly",
                "quote": "Green writes with empathy and grace about illness and love."
            }
        ],
        "funFacts": [
            "The title comes from Shakespeare's Julius Caesar",
            "Green was inspired by his work as a hospital chaplain",
            "Shailene Woodley and Ansel Elgort starred in the film",
            "The fictional book An Imperial Affliction doesn't exist (though fans wanted it to)",
            "The phrase 'Okay? Okay.' became iconic among fans"
        ],
        "targetAudience": "Young adults and adults, romance readers, anyone touched by cancer, fans of John Green's other work, and readers seeking beautiful, emotional storytelling.",
        "contentWarnings": ["Terminal illness", "Death", "Cancer"],
        "similarTitles": ["Me and Earl and the Dying Girl", "Before I Fall", "Five Feet Apart"]
    },
    "book_059": {
        "extendedDescription": "Ketterdam is a bustling hub of international trade—where anything can be had for the right price. And no one knows that better than criminal prodigy Kaz Brekker. Kaz is offered a chance at a heist that could make him rich beyond his wildest dreams: break into the most secure prison in the world and rescue a scientist whose invention could change the fate of the world. To pull it off, Kaz assembles a crew of six outcasts, each with a unique skill: a sharpshooter, a spy, a convict, a demolitions expert, a runaway, and a thief. Together, they must navigate deadly terrain, outwit brutal enemies, and—maybe the hardest part—trust each other. Set in the Grishaverse, Six of Crows is a twisty heist story with unforgettable characters and non-stop action.",
        "authorBio": "Leigh Bardugo is the #1 New York Times bestselling author of the Grishaverse novels (the Shadow and Bone trilogy and Six of Crows duology) and the Alex Stern series. She lives in Los Angeles and is a founding member of the YA author collective called the YA Authors Do Epic Readings.",
        "awards": [
            "#1 New York Times Bestseller",
            "Goodreads Choice Awards Best YA Fantasy (2015)",
            "YALSA Best Fiction for Young Adults",
            "Over 3 million copies sold (duology)",
            "Netflix's Shadow and Bone series features these characters"
        ],
        "reviews": [
            {
                "reviewer": "Rick Riordan",
                "quote": "A glorious, vivid, and action-packed fantasy... I loved it.",
                "rating": 5
            },
            {
                "reviewer": "The New York Times",
                "quote": "Cracking page-turner with a multiethnic band of misfits."
            }
        ],
        "funFacts": [
            "The book is set in the same universe as the Shadow and Bone trilogy",
            "Kaz Brekker uses a cane and has severe touch aversion (trauma representation)",
            "The Dregs crew includes disabled, queer, and POC characters",
            "It's been called 'Ocean's Eleven meets fantasy'",
            "The sequel, Crooked Kingdom, concludes the story"
        ],
        "targetAudience": "Young adult fantasy readers, heist story fans, readers seeking diverse characters, fans of morally gray protagonists, and anyone who loves found family dynamics.",
        "similarTitles": ["The Lies of Locke Lamora", "Throne of Glass", "Shadow and Bone"]
    },
    "book_060": {
        "extendedDescription": "On September 5, a little after midnight, Death-Cast calls Mateo Torrez and Rufus Emeterio to give them some bad news: they're going to die today. Mateo and Rufus are total strangers, but they both want to make the most of their last day. Through an app called Last Friend, they meet up and embark on one final adventure. Over the course of a single day, they experience the joy of friendship, the thrill of breaking rules, the pain of regret, and the beauty of truly living. As the clock ticks down, Mateo and Rufus must confront what it means to live a meaningful life and how to say goodbye. They Both Die at the End is a heartbreaking, life-affirming story about making every moment count.",
        "authorBio": "Adam Silvera is the #1 New York Times bestselling author of They Both Die at the End, More Happy Than Not, and the Infinity Cycle series. He writes YA fiction that often explores LGBTQ+ themes, grief, and identity. He lives in Los Angeles and works in publishing.",
        "awards": [
            "#1 New York Times Bestseller",
            "BookTok phenomenon (revived sales in 2021)",
            "Over 1 million copies sold",
            "YALSA Best Fiction for Young Adults",
            "Audible Audiobook of the Year"
        ],
        "reviews": [
            {
                "reviewer": "Entertainment Weekly",
                "quote": "A love story that will leave you weeping and believing in love.",
                "rating": 5
            },
            {
                "reviewer": "Booklist (Starred Review)",
                "quote": "A tender, profound, and heart-wrenching story."
            }
        ],
        "funFacts": [
            "The title tells you the ending, but it's still devastating",
            "The book became a massive hit on BookTok 4 years after publication",
            "Silvera explores how we'd live if we knew our death date",
            "Both main characters are queer Latinx teens",
            "A prequel, The First to Die at the End, was published in 2022"
        ],
        "targetAudience": "Young adults and adults, LGBTQ+ readers, fans of emotional contemporary fiction, readers who love character-driven stories, and anyone who's pondered mortality.",
        "contentWarnings": ["Death", "Violence", "Grief"],
        "similarTitles": ["The Fault in Our Stars", "If I Stay", "More Happy Than Not"]
    }
}

def main():
    """Add details to batch 5 items"""
    print("Starting Batch 5: Adding details to 10 books...")
    print()

    # Load catalog
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # Add details to each item
    items_updated = 0
    for item in catalog:
        if item['id'] in BATCH_5_DETAILS:
            item['details'] = BATCH_5_DETAILS[item['id']]
            items_updated += 1
            print(f"✓ Added details to: {item['id']} - {item['title']}")

    # Save updated catalog
    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    # Summary
    print()
    print("=" * 60)
    print("✅ BATCH 5 COMPLETE")
    print("=" * 60)
    print(f"Added details to {items_updated} items")
    print()
    print("Items with details:")
    print("  📚 Books: 10 (book_051 to book_060)")
    print()

    # Count total items with details
    total_with_details = sum(1 for item in catalog if 'details' in item and item['details'])
    total_items = len(catalog)
    percentage = (total_with_details / total_items) * 100

    print(f"Total Progress: {total_with_details} / {total_items} items ({percentage:.1f}%)")
    print(f"Remaining: {total_items - total_with_details} items")
    print("=" * 60)

if __name__ == "__main__":
    main()

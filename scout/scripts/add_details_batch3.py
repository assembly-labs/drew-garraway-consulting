#!/usr/bin/env python3
"""
Add detailed information to catalog items - Batch 3
This script adds rich details to 20 items: book_016 to book_030 and lot_011 to lot_015
"""

import json
import sys
from pathlib import Path

# Define the catalog path
CATALOG_PATH = Path(__file__).parent.parent / "data" / "catalog.json"

# Details for each item in batch 3
BATCH_3_DETAILS = {
    "book_016": {
        "extendedDescription": "Klara is an Artificial Friend, a solar-powered robot designed to prevent loneliness in children. From her place in the store window, she watches the outside world carefully, learning about human behavior and hoping to be chosen by a child. When 14-year-old Josie finally picks her, Klara is thrilled. But Josie is often ill, and as Klara begins to understand more about this household and its secrets, she wonders if there might be a way to save Josie—even if it means making a dangerous bargain with the Sun, whom she believes to be a god. This is a profound meditation on what it means to love, to observe, and to be conscious.",
        "authorBio": "Kazuo Ishiguro is a Nobel Prize-winning British novelist of Japanese origin. He is the author of eight novels, including The Remains of the Day (Booker Prize winner) and Never Let Me Go. His work explores themes of memory, time, and self-delusion with haunting precision. In 2017, he was awarded the Nobel Prize in Literature.",
        "awards": [
            "Longlisted for the Booker Prize (2021)",
            "Sunday Times Bestseller",
            "New York Times Notable Book of the Year",
            "TIME Magazine's Must-Read Books of 2021"
        ],
        "reviews": [
            {
                "reviewer": "The Guardian",
                "quote": "A masterpiece... Ishiguro has created something beautiful and disturbing.",
                "rating": 5
            },
            {
                "reviewer": "The New York Times",
                "quote": "A story that will haunt you long after you've turned the last page."
            }
        ],
        "funFacts": [
            "Ishiguro spent over 5 years writing this novel",
            "The AI character Klara has become a touchstone for discussions about consciousness",
            "Written before ChatGPT but eerily prescient about AI relationships",
            "Ishiguro researched solar energy and AI ethics extensively",
            "The book explores what it means to be human from a non-human perspective"
        ],
        "targetAudience": "Literary fiction fans, readers interested in AI ethics, fans of Never Let Me Go, and anyone who enjoys philosophical explorations of consciousness and love.",
        "similarTitles": ["Never Let Me Go", "The Remains of the Day", "Do Androids Dream of Electric Sheep?"]
    },
    "book_017": {
        "extendedDescription": "France, 1714: in a moment of desperation, a young woman named Addie LaRue makes a Faustian bargain to live forever—but there's a cruel twist. She will live eternally, but she will be forgotten by everyone she meets. No one will remember her name, her face, or anything about her. For 300 years, Addie survives by leaving her mark in small, invisible ways: inspiring art, whispering ideas into the ears of musicians and writers, living in the shadows of history. Then, in a bookshop in New York City in 2014, she meets a boy who remembers her. His name is Henry, and with him, everything changes. This is a sweeping tale of art, love, and the struggle to leave a mark on the world.",
        "authorBio": "V.E. Schwab is the #1 New York Times bestselling author of more than 20 books, including the Shades of Magic series and This Savage Song. Her work has been translated into over 20 languages and optioned for film and TV. She splits her time between Nashville and Edinburgh.",
        "awards": [
            "Goodreads Choice Awards Best Fantasy (2020)",
            "Indie Next Pick",
            "LibraryReads Hall of Fame",
            "Over 1 million copies sold worldwide",
            "Locus Awards Finalist"
        ],
        "reviews": [
            {
                "reviewer": "Entertainment Weekly",
                "quote": "A lyrical, haunting exploration of immortality, memory, and what it means to be seen.",
                "rating": 5
            },
            {
                "reviewer": "BookPage (Starred Review)",
                "quote": "A meditation on legacy, love, and the infinite ways we leave our mark."
            }
        ],
        "funFacts": [
            "Schwab spent 10 years writing and revising this novel",
            "The book spans 300 years and multiple countries",
            "Inspired by Schwab's own questions about legacy and memory",
            "Features Easter eggs referencing real historical figures Addie 'influenced'",
            "The time-jumping structure was one of the biggest writing challenges"
        ],
        "targetAudience": "Fantasy lovers, fans of time-spanning narratives, readers who love lyrical prose, and anyone fascinated by the question: what mark will I leave on the world?",
        "similarTitles": ["The Midnight Library", "The Time Traveler's Wife", "The Night Circus"]
    },
    "book_018": {
        "extendedDescription": "Linus Baker is a case worker for the Department in Charge of Magical Youth, inspecting orphanages for magical children. He's a by-the-book bureaucrat who lives a quiet, lonely life—until he's given a highly classified assignment. He must travel to Marsyas Island Orphanage and report on six dangerous children, including the Antichrist himself. There, he meets Arthur Parnassus, the enigmatic master of the orphanage, and discovers a family like no other. Linus must choose between the rules he's followed his entire life and the people he's come to love. This is a heartwarming, whimsical tale about found family, prejudice, and the courage to choose love over fear.",
        "authorBio": "TJ Klune is a Lambda Literary Award-winning author of LGBTQ+ fiction, including The House in the Cerulean Sea, which became a viral sensation and New York Times bestseller. He lives in Virginia with his husband and their cat. His work often explores themes of acceptance, found family, and queer joy.",
        "awards": [
            "Alex Award Winner (2021)",
            "Lambda Literary Award Finalist",
            "Goodreads Choice Awards Fantasy Finalist",
            "Indie Next Pick",
            "Over 1 million copies sold"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times Book Review",
                "quote": "A witty, wholesome fantasy that's likely to cause heart-swelling.",
                "rating": 5
            },
            {
                "reviewer": "The Washington Post",
                "quote": "Likely to spark a revolution... Masterfully told and joyously affirming."
            }
        ],
        "funFacts": [
            "Inspired in part by the '60s Scoop' in Canada, when Indigenous children were removed from their families",
            "The character of Linus is asexual, making this a rare ace representation in fantasy",
            "Became a bestseller years after publication due to word-of-mouth",
            "Features a delightfully sassy six-year-old Antichrist named Lucy",
            "The title is inspired by a song by Klune's favorite band"
        ],
        "targetAudience": "Fantasy fans seeking cozy, heartwarming reads; LGBTQ+ readers; anyone who loves found family stories and characters who choose kindness over rules.",
        "similarTitles": ["Under the Whispering Door", "The Midnight Library", "A Man Called Ove"]
    },
    "book_019": {
        "extendedDescription": "Set in the distant future, Dune tells the story of Paul Atreides, whose family accepts stewardship of the desert planet Arrakis. Arrakis is the only source of 'melange,' or 'the spice'—the most valuable substance in the universe, extending life and enabling space travel. But Arrakis is also deadly: water is scarce, giant sandworms roam the deserts, and political intrigue abounds. When Paul's family is betrayed, he must flee into the desert and join the Fremen, the planet's native inhabitants. There, Paul discovers his destiny as a messianic figure who will change the fate of the universe. This epic novel explores themes of politics, religion, ecology, and power with unparalleled depth.",
        "authorBio": "Frank Herbert (1920-1986) was an American science fiction author best known for Dune, which is widely considered one of the greatest science fiction novels ever written. Before becoming a novelist, Herbert worked as a journalist and oyster diver. He spent six years researching and writing Dune, drawing on his interests in ecology, religion, and politics.",
        "awards": [
            "Hugo Award for Best Novel (1966)",
            "Nebula Award for Best Novel (1965)",
            "Over 20 million copies sold worldwide",
            "Inducted into the Science Fiction Hall of Fame",
            "Considered one of the greatest sci-fi novels of all time"
        ],
        "reviews": [
            {
                "reviewer": "Chicago Tribune",
                "quote": "One of the monuments of modern science fiction.",
                "rating": 5
            },
            {
                "reviewer": "The New York Times",
                "quote": "Herbert has created a universe as rich and complex as Middle-earth."
            }
        ],
        "funFacts": [
            "Initially rejected by 20+ publishers before being accepted",
            "Herbert was inspired by sand dunes in Oregon and Middle Eastern politics",
            "The spice melange is often interpreted as an allegory for oil",
            "The Fremen language draws from Arabic",
            "Denis Villeneuve's 2021 film adaptation became a critical and commercial hit"
        ],
        "targetAudience": "Science fiction fans, readers who love epic world-building, anyone interested in ecology and politics, and fans of Game of Thrones-style complexity.",
        "similarTitles": ["Foundation", "Hyperion", "The Left Hand of Darkness"]
    },
    "book_020": {
        "extendedDescription": "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet fishing village in North Carolina. Kya Clark is the young woman who raised herself in the marshes after her family abandoned her. Shunned by the townspeople, Kya finds solace in nature, studying the creatures of the marsh and creating a life of quiet beauty. When the town's golden boy, Chase Andrews, is found dead in 1969, Kya is immediately suspected. As the trial unfolds, the story alternates between Kya's isolated childhood and the mystery of Chase's death. This is a powerful meditation on loneliness, resilience, and the places we call home.",
        "authorBio": "Delia Owens is an American author and wildlife scientist. Before writing Where the Crawdads Sing, she co-authored three internationally bestselling nonfiction books about her experiences studying wildlife in Africa. This is her first novel, published when she was 69 years old.",
        "awards": [
            "Over 12 million copies sold",
            "#1 New York Times Bestseller for over 150 weeks",
            "Goodreads Choice Awards Best Fiction (2018)",
            "Reese's Book Club Pick",
            "Adapted into a major motion picture (2022)"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Painfully beautiful... A nature-infused love story and murder mystery.",
                "rating": 5
            },
            {
                "reviewer": "Entertainment Weekly",
                "quote": "A lush, lyrical debut that will leave you breathless."
            }
        ],
        "funFacts": [
            "Owens was 69 when she published her first novel",
            "The marsh descriptions are based on her childhood in Georgia",
            "The book stayed on the NYT bestseller list longer than To Kill a Mockingbird",
            "Taylor Swift wrote a song inspired by the book",
            "Became a word-of-mouth phenomenon through book clubs"
        ],
        "targetAudience": "Book club favorites, nature lovers, fans of literary mysteries, and readers who appreciate stories of resilience and survival.",
        "similarTitles": ["Educated", "The Great Alone", "My Antonia"]
    },
    "book_021": {
        "extendedDescription": "The Vignes twin sisters will always be identical. But after growing up together in a small, southern Black community and running away at age 16, it's not just their looks that are different. It's everything: their families, their communities, their racial identities. Ten years later, one sister lives with her Black daughter in the same southern town she once tried to escape. The other secretly passes for white, and her white husband knows nothing of her past. Still, even separated by many miles and just as many lies, the fates of the twins remain intertwined. This is a stunning exploration of identity, family, and the way history shapes us.",
        "authorBio": "Brit Bennett is the author of The Mothers and The Vanishing Half. She holds an MFA from the University of Michigan and has been featured in The New Yorker, The New York Times Magazine, and The Paris Review. The Vanishing Half was a finalist for the National Book Award and an instant #1 New York Times bestseller.",
        "awards": [
            "#1 New York Times Bestseller",
            "Longlisted for the National Book Award (2020)",
            "Women's Prize for Fiction Shortlist",
            "Goodreads Choice Awards Finalist",
            "Barack Obama's Favorite Books of 2020"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "An ambitious meditation on race and identity... Breathtakingly beautiful.",
                "rating": 5
            },
            {
                "reviewer": "TIME Magazine",
                "quote": "Bennett renders her characters and their struggles with great compassion."
            }
        ],
        "funFacts": [
            "Inspired by the real story of a woman who passed as white",
            "Bennett researched the history of colorism and passing extensively",
            "The fictional town of Mallard is based on real towns in Louisiana",
            "HBO is developing a limited series adaptation",
            "The book explores how colorism affects Black communities"
        ],
        "targetAudience": "Readers interested in racial identity and history, book clubs, fans of literary fiction, and anyone who loves family sagas with depth.",
        "similarTitles": ["The Mothers", "Homegoing", "Americanah"]
    },
    "book_022": {
        "extendedDescription": "On a summer's day in 1596, a young girl in Stratford-upon-Avon takes to her bed with a sudden fever. Her twin brother, Hamnet, searches for help while their mother, Agnes (known to history as Anne Hathaway), is away. By the time Agnes returns, it is too late. Her son Hamnet is dead. Four years later, her husband William Shakespeare writes his greatest play: Hamlet. This is the story of that loss, of a marriage, of a family in Elizabethan England, and of how grief can transform us. It's also a stunning reimagining of Agnes Hathaway—not as a footnote in Shakespeare's story, but as a force in her own right.",
        "authorBio": "Maggie O'Farrell is the author of nine novels, including The Hand That First Held Mine, which won the Costa Novel Award. She has won numerous awards for her fiction and been shortlisted for the Man Booker Prize. She lives in Edinburgh with her family.",
        "awards": [
            "Women's Prize for Fiction Winner (2020)",
            "National Book Critics Circle Award Winner",
            "Waterstones Book of the Year",
            "Barnes & Noble Book of the Year",
            "Over 1 million copies sold worldwide"
        ],
        "reviews": [
            {
                "reviewer": "The Guardian",
                "quote": "Magnificent... A luminous portrait of grief and love.",
                "rating": 5
            },
            {
                "reviewer": "The Times (UK)",
                "quote": "A thing of shimmering originality and searing beauty."
            }
        ],
        "funFacts": [
            "O'Farrell never names Shakespeare directly in the novel—he's just 'the husband'",
            "Agnes is portrayed as having second sight and deep intuition",
            "The novel reimagines Anne Hathaway as a powerful, complex woman",
            "Hamnet and Judith were Shakespeare's real twins",
            "O'Farrell visited Stratford-upon-Avon multiple times for research"
        ],
        "targetAudience": "Historical fiction fans, Shakespeare enthusiasts, readers who appreciate literary prose, and anyone interested in stories of grief and motherhood.",
        "similarTitles": ["The Marriage Portrait", "Wolf Hall", "The Essex Serpent"]
    },
    "book_023": {
        "extendedDescription": "Theo Decker is 13 years old when his mother is killed in a terrorist attack at the Metropolitan Museum of Art. In the chaos, Theo steals a priceless painting: The Goldfinch by Carel Fabritius. The painting becomes both his salvation and his burden, a secret he carries into adulthood. As Theo grows up in New York City, moving between the homes of wealthy friends and underworld criminals, the painting remains hidden, a constant reminder of his mother and his guilt. This is a sweeping coming-of-age tale about love, loss, obsession, and the power of art to give meaning to our lives.",
        "authorBio": "Donna Tartt is the author of three novels: The Secret History, The Little Friend, and The Goldfinch. She won the Pulitzer Prize for Fiction in 2014 for The Goldfinch. Known for taking many years between books (The Goldfinch took 11 years to write), she is celebrated for her literary precision and depth.",
        "awards": [
            "Pulitzer Prize for Fiction (2014)",
            "Andrew Carnegie Medal for Excellence",
            "Over 5 million copies sold",
            "Adapted into a major motion picture (2019)",
            "Critics' Choice Book Awards Winner"
        ],
        "reviews": [
            {
                "reviewer": "The Wall Street Journal",
                "quote": "A glorious novel that pulls together all its complex threads into a tapestry of tragedy and beauty.",
                "rating": 5
            },
            {
                "reviewer": "The Guardian",
                "quote": "Magnificent... A novel of shocking narrative energy and force."
            }
        ],
        "funFacts": [
            "The Goldfinch is a real painting on display at the Mauritshuis in The Hague",
            "Tartt visited the museum multiple times to study the painting",
            "The book is over 770 pages and took 11 years to write",
            "Stephen King called it a 'rarity: a novel that reaches for greatness'",
            "Carel Fabritius died in a gunpowder explosion at age 32"
        ],
        "targetAudience": "Lovers of literary fiction, art enthusiasts, readers who appreciate long, immersive novels, and fans of coming-of-age stories with depth.",
        "contentWarnings": ["Drug use", "Death of a parent", "Violence"],
        "similarTitles": ["The Secret History", "A Little Life", "The Corrections"]
    },
    "book_024": {
        "extendedDescription": "In 1922, Count Alexander Rostov is deemed an unrepentant aristocrat by a Bolshevik tribunal and is sentenced to house arrest in the Metropol, a grand hotel across the street from the Kremlin. Rostov, an indomitable man of erudition and wit, has never worked a day in his life and must now live in an attic room while some of the most tumultuous decades in Russian history unfold outside the hotel's doors. But Rostov discovers that a life of purpose and connection can be found within the confines of the hotel. This is a story of resilience, friendship, love, and the idea that a gentleman does not change with the times—the times change around the gentleman.",
        "authorBio": "Amor Towles is the author of the New York Times bestsellers Rules of Civility, A Gentleman in Moscow, and The Lincoln Highway. He graduated from Yale College and received an MA in English from Stanford University. Before writing, he worked as an investment professional in Manhattan.",
        "awards": [
            "#1 New York Times Bestseller",
            "Over 3 million copies sold",
            "Indie Next Pick",
            "Named Best Book of the Year by multiple publications",
            "Paramount+ series in development"
        ],
        "reviews": [
            {
                "reviewer": "The Washington Post",
                "quote": "A master class in storytelling... Witty, elegant, and compulsively entertaining.",
                "rating": 5
            },
            {
                "reviewer": "NPR",
                "quote": "A remarkably warm and witty story about the power of friendship and good manners."
            }
        ],
        "funFacts": [
            "Towles researched Russian history and culture extensively",
            "The Metropol Hotel is a real place in Moscow",
            "The Count never leaves the hotel for 32 years",
            "The novel spans from 1922 to 1954",
            "Became a massive word-of-mouth bestseller"
        ],
        "targetAudience": "Historical fiction fans, readers who appreciate wit and elegance, Anglophiles (and Russophiles), book clubs, and anyone who loves character-driven stories.",
        "similarTitles": ["The Lincoln Highway", "All the Light We Cannot See", "The Remains of the Day"]
    },
    "book_025": {
        "extendedDescription": "Connell and Marianne both attend secondary school in County Sligo, Ireland. Connell is popular and good at football; Marianne is awkward and lonely. But when Connell picks up his mother—who cleans Marianne's house—after school one day, a strange and intense connection begins. As they leave school and enter university in Dublin, their relationship deepens and fractures in unpredictable ways. They can't seem to stay together, but they also can't seem to stay apart. This is a devastating portrait of first love, class dynamics, and the way we misunderstand each other—even the people we love most.",
        "authorBio": "Sally Rooney is an Irish novelist born in 1991. She is the author of Conversations with Friends, Normal People, and Beautiful World, Where Are You. Often described as 'the first great millennial novelist,' her work has been translated into 46 languages. She lives in Dublin.",
        "awards": [
            "Costa Novel Award Winner (2018)",
            "Longlisted for the Man Booker Prize (2018)",
            "Waterstones Book of the Year",
            "British Book Awards Book of the Year",
            "Adapted into a critically acclaimed Hulu/BBC series"
        ],
        "reviews": [
            {
                "reviewer": "The Guardian",
                "quote": "A novel of great intensity... Devastatingly good.",
                "rating": 5
            },
            {
                "reviewer": "The New Yorker",
                "quote": "Rooney has a genius for understanding the emotional lives of young people."
            }
        ],
        "funFacts": [
            "The 2020 TV adaptation became a cultural phenomenon",
            "Rooney was 26 when Normal People was published",
            "The book was inspired by Rooney's experiences at Trinity College Dublin",
            "Features minimal quotation marks in the dialogue",
            "The 'Connell's chain' became a viral meme"
        ],
        "targetAudience": "Fans of character-driven literary fiction, readers interested in class and social dynamics, anyone who's experienced the pain of miscommunication in relationships.",
        "contentWarnings": ["Sexual content", "Depression", "Domestic abuse (briefly depicted)"],
        "similarTitles": ["Conversations with Friends", "Beautiful World Where Are You", "The Catcher in the Rye"]
    },
    "book_026": {
        "extendedDescription": "It is 1939. Nazi Germany. The country is holding its breath. Death has never been busier, and will become busier still. By her brother's graveside, Liesel's life is changed when she picks up a single object, partially hidden in the snow. It is The Grave Digger's Handbook, left behind by accident, and it is her first act of book thievery. So begins Liesel's love affair with books and words, and her story of survival in Molching, a small town near Munich. Liesel learns to read from her foster father Hans, begins stealing books from Nazi book burnings, and shares them with Max Vandenburg, the Jewish man hiding in their basement. Death narrates this story, watching as Liesel discovers the power of words—both to destroy and to save.",
        "authorBio": "Markus Zusak is an Australian author best known for The Book Thief, which spent over 10 years on the New York Times bestseller list. He has won numerous awards, including the Michael L. Printz Honor for excellence in young adult literature. His most recent novel, Bridge of Clay, was released in 2018.",
        "awards": [
            "Michael L. Printz Honor Book",
            "Over 16 million copies sold worldwide",
            "Over 10 years on the New York Times bestseller list",
            "Translated into 40+ languages",
            "Adapted into a major motion picture (2013)"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Brilliant and hugely ambitious... Zusak's masterpiece.",
                "rating": 5
            },
            {
                "reviewer": "USA Today",
                "quote": "A beautifully balanced piece of storytelling... Unsentimental and yet affirming."
            }
        ],
        "funFacts": [
            "Death as narrator was inspired by Zusak's parents' stories of WWII",
            "Zusak's mother witnessed the bombing of Munich as a child",
            "The author rewrote the book over 200 times",
            "It took 8 years to write",
            "Originally published as Young Adult but loved by all ages"
        ],
        "targetAudience": "YA and adult readers, WWII history enthusiasts, anyone who loves stories about the power of words, and readers seeking hope in dark times.",
        "contentWarnings": ["Death", "Holocaust themes", "War violence"],
        "similarTitles": ["All the Light We Cannot See", "The Nightingale", "Sarah's Key"]
    },
    "book_027": {
        "extendedDescription": "Marie-Laure is a blind French girl who flees occupied Paris with her father, carrying a legendary diamond rumored to bring misfortune to anyone who possesses it. Werner is a German orphan with a talent for building and fixing radios—a talent that wins him a place at a brutal military academy and, eventually, a special assignment tracking resistance broadcasts. As the war rages across Europe, Marie-Laure and Werner's paths converge in the walled city of Saint-Malo on the Brittany coast. This is a story about the ravages of war, the resilience of the human spirit, and all the invisible connections that bind us together.",
        "authorBio": "Anthony Doerr is an American author born in 1973. He is the author of the Pulitzer Prize-winning novel All the Light We Cannot See, as well as The Shell Collector, About Grace, and Cloud Cuckoo Land. His work has appeared in The New Yorker, The Atlantic, and Best American Short Stories. He lives in Boise, Idaho.",
        "awards": [
            "Pulitzer Prize for Fiction (2015)",
            "Andrew Carnegie Medal",
            "Over 15 million copies sold",
            "#1 New York Times Bestseller",
            "Netflix limited series released in 2023"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "A stunningly ambitious book... Doerr's best yet.",
                "rating": 5
            },
            {
                "reviewer": "The Washington Post",
                "quote": "Beautiful and elegiac... A story that will transport you."
            }
        ],
        "funFacts": [
            "Doerr spent 10 years researching and writing the novel",
            "He visited Saint-Malo multiple times to research the setting",
            "The Sea of Flames diamond is fictional but inspired by real cursed gems",
            "Werner's character was inspired by young German soldiers' letters",
            "The book contains references to Jules Verne's Twenty Thousand Leagues"
        ],
        "targetAudience": "Historical fiction lovers, WWII enthusiasts, fans of literary fiction, and readers who appreciate beautifully crafted prose and dual narratives.",
        "contentWarnings": ["War violence", "Death", "Child soldiers"],
        "similarTitles": ["The Nightingale", "The Book Thief", "The Alice Network"]
    },
    "book_028": {
        "extendedDescription": "France, 1939. Vianne Mauriac and her husband are living a quiet life in a village in the French countryside when he is called to fight at the front. Left alone with their young daughter, Vianne must navigate the German occupation—including billeting a Nazi officer in her home. Her younger sister, Isabelle, is rebellious and passionate, and joins the Resistance, risking everything to save Allied pilots. As the war intensifies, both sisters face impossible choices. This is an epic tale of courage, sacrifice, and the unbreakable bonds between sisters. It explores how women resisted in different ways and how war changes everyone it touches.",
        "authorBio": "Kristin Hannah is the author of more than 20 novels, including The Great Alone, The Four Winds, and Firefly Lane. A former lawyer, she turned to writing fiction full-time in 1992. The Nightingale has sold over 4.5 million copies worldwide and has been translated into 45 languages.",
        "awards": [
            "Goodreads Choice Awards Best Historical Fiction (2015)",
            "#1 New York Times Bestseller",
            "Over 4.5 million copies sold worldwide",
            "People's Choice Award Favorite Fiction",
            "Major motion picture in development"
        ],
        "reviews": [
            {
                "reviewer": "The Wall Street Journal",
                "quote": "A heart-pounding story... Hannah at her very best.",
                "rating": 5
            },
            {
                "reviewer": "Library Journal (Starred)",
                "quote": "Haunting, action-packed, and compelling... A must-read."
            }
        ],
        "funFacts": [
            "Hannah was inspired by a true story of a Belgian woman who saved downed pilots",
            "The French Resistance included many women who are often forgotten in history",
            "Vianne and Isabelle are fictional but based on real women's experiences",
            "Hannah researched WWII for years before writing",
            "The novel has been translated into 45 languages"
        ],
        "targetAudience": "Historical fiction fans, readers interested in women's roles in WWII, book clubs, and anyone who loves emotional, character-driven stories.",
        "contentWarnings": ["War violence", "Sexual assault (depicted)", "Death"],
        "similarTitles": ["All the Light We Cannot See", "The Book Thief", "The Great Alone"]
    },
    "book_029": {
        "extendedDescription": "1947: In the chaotic aftermath of World War II, American college girl Charlie St. Clair is pregnant, unmarried, and on the verge of being sent home in disgrace. But Charlie isn't ready to give up her search for her cousin Rose, who disappeared in Nazi-occupied France during the war. The only clue is a cryptic postcard from a place called 'The Alice Network.' Charlie teams up with Eve Gardiner, an embittered ex-spy who was part of a real-life network of female spies during WWI. Together, they embark on a dangerous mission to find out what happened to Rose. This is a gripping tale of courage, betrayal, and redemption spanning two world wars.",
        "authorBio": "Kate Quinn is the New York Times bestselling author of historical fiction, including The Rose Code, The Diamond Eye, and The Huntress. A lifelong history buff, she has a bachelor's and master's degree in Classical Voice. She lives in San Diego with her husband.",
        "awards": [
            "Goodreads Choice Awards Historical Fiction Nominee",
            "Reese's Book Club Pick",
            "#1 New York Times Bestseller",
            "Over 1 million copies sold",
            "Indie Next Pick"
        ],
        "reviews": [
            {
                "reviewer": "Historical Novel Society",
                "quote": "Both funny and heartbreaking... Quinn delivers a knockout.",
                "rating": 5
            },
            {
                "reviewer": "Marie Claire",
                "quote": "A thrilling tale... A must-read for fans of WWII fiction."
            }
        ],
        "funFacts": [
            "The Alice Network was a real WWI spy network run by women",
            "Louise de Bettignies was a real French spy who inspired Eve's character",
            "Quinn researched female spies extensively for authenticity",
            "The dual timeline structure connects WWI and WWII",
            "The book highlights lesser-known heroines of history"
        ],
        "targetAudience": "Historical fiction enthusiasts, fans of espionage thrillers, readers interested in women's history, and anyone who loves dual-timeline narratives.",
        "contentWarnings": ["Torture (depicted)", "War violence", "Pregnancy outside marriage"],
        "similarTitles": ["The Rose Code", "Code Name Verity", "The Nightingale"]
    },
    "book_030": {
        "extendedDescription": "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child—neither powerful like her father nor seductively beautiful like her mother. Scorned and rejected, Circe grows up in the shadows of her family's glory. When she discovers she possesses the power of witchcraft, she is exiled to the deserted island of Aiaia. There, she hones her craft, tames wild beasts, and crosses paths with many of mythology's most famous figures: the messenger god Hermes, the craftsman Daedalus, the hero Odysseus. But there is danger in solitude, and Circe must choose between the gods and the mortals she has come to love. This is a stunning reimagining of one of mythology's most infamous women.",
        "authorBio": "Madeline Miller is the author of The Song of Achilles and Circe, both of which have been international bestsellers. She holds an MA in Classics from Brown University and has taught Latin, Greek, and Shakespeare. The Song of Achilles won the Orange Prize for Fiction (now the Women's Prize).",
        "awards": [
            "Goodreads Choice Awards Best Fantasy (2018)",
            "#1 New York Times Bestseller",
            "Indie Next Pick",
            "Over 2 million copies sold",
            "Shortlisted for the Women's Prize for Fiction"
        ],
        "reviews": [
            {
                "reviewer": "The Washington Post",
                "quote": "A bold and subversive retelling... Miller's feminist take is captivating.",
                "rating": 5
            },
            {
                "reviewer": "NPR",
                "quote": "Miller has created a Circe who is both divine and deeply human."
            }
        ],
        "funFacts": [
            "Circe appears in Homer's Odyssey as a witch who turns men into pigs",
            "Miller gives Circe agency and depth often lacking in male-authored mythology",
            "The book explores themes of female power and independence",
            "HBO is developing a limited series adaptation",
            "Miller researched ancient Greek texts extensively"
        ],
        "targetAudience": "Mythology lovers, fantasy fans, readers interested in feminist retellings, and anyone who enjoys lyrical, literary prose.",
        "similarTitles": ["The Song of Achilles", "A Thousand Ships", "Ariadne"]
    },
    "lot_011": {
        "whatsIncluded": [
            "Celestron beginner refractor telescope (50mm aperture)",
            "Adjustable aluminum tripod",
            "Two eyepieces (20mm and 4mm)",
            "Finderscope for locating objects",
            "Moon map and star chart",
            "Basic astronomy guide for beginners",
            "Protective carrying case"
        ],
        "howToUse": "Set up the tripod on stable ground, attach the telescope tube, and align the finderscope. Start with the 20mm eyepiece for wider views, then switch to the 4mm for closer details. Use the moon map to identify lunar features and the star chart to locate constellations. Best viewing is away from city lights on clear nights.",
        "careInstructions": "Store in the protective case when not in use. Never look directly at the sun through the telescope (permanent eye damage). Wipe lenses gently with lens cleaning cloth only. Keep away from moisture. Allow telescope to adjust to outdoor temperature before viewing.",
        "safetyInfo": "NEVER point telescope at the sun. Adult supervision required for children under 14. Use caution when moving the tripod—pinch points exist. Do not leave telescope unattended in public areas.",
        "recommendedUses": [
            "Moon observation (craters, seas, mountains)",
            "Viewing planets (Jupiter's moons, Saturn's rings)",
            "Star clusters and binary stars",
            "Learning constellations and celestial navigation",
            "Science projects and school assignments",
            "Family stargazing nights"
        ],
        "phillyTips": [
            "Best local viewing spots: Belmont Plateau in Fairmount Park, Cherry Hill State Park in NJ",
            "Check out the Franklin Institute's observatory for more astronomy resources",
            "Join the Philadelphia Area Astronomy Society for group star parties",
            "Light pollution is lower on weeknights—avoid weekend stadium lighting",
            "Fall and winter offer clearer skies in the Philly region",
            "Penn's Department of Astronomy hosts free public lectures"
        ],
        "bestSeasons": ["Fall", "Winter"],
        "ageRecommendation": "Ages 8+ with adult supervision, Ages 14+ independently",
        "depositAmount": 50.0,
        "replacementCost": 150.0
    },
    "lot_012": {
        "whatsIncluded": [
            "Electric bike (pedal-assist, 20-inch wheels)",
            "Rechargeable lithium battery (removable)",
            "Battery charger with US plug",
            "Adjustable helmet (adult size)",
            "Heavy-duty U-lock with mounting bracket",
            "Reflective vest and LED safety lights",
            "User manual and safety guidelines",
            "Tool kit for minor adjustments"
        ],
        "howToUse": "Charge the battery fully before first use (4-6 hours). Insert the battery into the frame, turn on the power, and select your assist level (1-5). Pedal normally—the motor assists your pedaling. Lock the bike securely when not in use. Return with at least 20% battery charge remaining.",
        "careInstructions": "Charge battery every 2 weeks even if not in use. Store battery indoors if temperatures drop below 32°F. Wipe down after riding in rain. Do not submerge in water. Check tire pressure weekly (40-50 PSI). Report any mechanical issues immediately.",
        "safetyInfo": "Helmet must be worn at all times. Follow all traffic laws—e-bikes are considered vehicles in PA. Maximum rider weight: 275 lbs. Do not modify the motor or battery. Ride in bike lanes where available. Use lights at night (included).",
        "recommendedUses": [
            "Commuting to work or school (5-15 mile range)",
            "Exploring Philadelphia's bike trails (Schuylkill River Trail, Pennypack Trail)",
            "Running errands without a car",
            "Leisurely neighborhood rides",
            "Testing e-bike ownership before purchasing",
            "Visiting friends across town"
        ],
        "phillyTips": [
            "Use the Schuylkill River Trail for a scenic car-free route",
            "Indego bike share stations mark good routes—follow their paths",
            "Avoid cobblestone streets in Old City—they're rough on e-bikes",
            "Kelly Drive is closed to cars on weekends—perfect for e-biking",
            "Washington Avenue has a protected bike lane connecting South Philly to Center City",
            "Check SEPTA's bike-friendly routes for longer trips"
        ],
        "bestSeasons": ["Spring", "Summer", "Fall"],
        "ageRecommendation": "Ages 16+ with valid ID",
        "depositAmount": 100.0,
        "replacementCost": 800.0
    },
    "lot_013": {
        "whatsIncluded": [
            "Compact binoculars (8x42 magnification)",
            "Field guide: Birds of Pennsylvania and New Jersey",
            "Philadelphia-area birding map with hotspots",
            "Waterproof notebook and pencil for logging sightings",
            "Bird call identification cards (50 common species)",
            "Lightweight backpack with padded straps",
            "Insect repellent wipes",
            "Collapsible water bottle"
        ],
        "howToUse": "Wear the backpack for hands-free carrying. Use binoculars to observe birds from a distance—approach slowly and quietly. Consult the field guide to identify species by color, size, and markings. Record your sightings in the notebook. Visit multiple habitats (forests, wetlands, parks) for variety.",
        "careInstructions": "Wipe binocular lenses with microfiber cloth only. Store field guide in the backpack's waterproof pocket. Empty and air-dry backpack after each use. Do not leave in direct sunlight or extreme heat.",
        "safetyInfo": "Stay on marked trails to avoid ticks and poison ivy. Wear long pants and closed-toe shoes in wooded areas. Check for ticks after each outing. Bring water and sunscreen. Never approach nesting birds closely—observe from a distance.",
        "recommendedUses": [
            "Learning to identify local bird species",
            "Photography (binoculars help spot subjects)",
            "Nature walks with family or solo",
            "School biology projects",
            "Participating in citizen science (eBird app)",
            "Stress relief through nature connection"
        ],
        "phillyTips": [
            "Wissahickon Valley Park is excellent year-round—over 200 species recorded",
            "John Heinz National Wildlife Refuge in Southwest Philly is a birding paradise",
            "Best spring migration viewing: late April to mid-May",
            "Fall migration peaks in September—look for warblers",
            "Pennypack Park offers easy trails and diverse habitats",
            "Join the Delaware Valley Ornithological Club for guided walks"
        ],
        "bestSeasons": ["Spring", "Fall"],
        "ageRecommendation": "All ages (children under 10 need adult supervision)",
        "depositAmount": 40.0,
        "replacementCost": 120.0
    },
    "lot_014": {
        "whatsIncluded": [
            "Digital blood pressure monitor (upper arm cuff)",
            "Medium-size cuff (fits 9-13 inch arm circumference)",
            "AC adapter and 4 AA batteries",
            "Quick-start guide in English and Spanish",
            "Blood pressure tracking log (paper)",
            "Storage case"
        ],
        "howToUse": "Sit quietly for 5 minutes before taking measurement. Wrap cuff snugly around bare upper arm, level with heart. Press the START button. Remain still and quiet during measurement (30-40 seconds). Record results in the log. Take readings at the same time daily for consistency.",
        "careInstructions": "Wipe cuff with damp cloth only—do not machine wash. Store in case when not in use. Replace batteries every 6 months or as needed. Keep away from extreme temperatures. Sanitize cuff with alcohol wipes between users.",
        "safetyInfo": "This device is for monitoring only—not for diagnosis. Consult your doctor about your readings. Do not use if you have an irregular heartbeat without medical guidance. Do not take measurements over clothing or rolled-up sleeves. Not recommended for children under 12.",
        "recommendedUses": [
            "Monitoring blood pressure at home between doctor visits",
            "Tracking medication effectiveness",
            "Understanding how diet, exercise, and stress affect BP",
            "Establishing baseline readings",
            "Managing hypertension under doctor's supervision",
            "Testing if you need a monitor before purchasing one"
        ],
        "phillyTips": [
            "Philadelphia has high rates of hypertension—free screenings available at health centers",
            "Temple University Hospital offers free BP clinics in North Philly",
            "Humid summer weather can affect readings—use climate-controlled spaces",
            "Coordinate with your doctor at Penn Medicine, Jefferson, or CHOP",
            "Public libraries offer health literacy programs on managing hypertension",
            "South Philly has community health fairs with free screenings quarterly"
        ],
        "bestSeasons": ["Year-round"],
        "ageRecommendation": "Adults 18+",
        "depositAmount": 25.0,
        "replacementCost": 60.0
    },
    "lot_015": {
        "whatsIncluded": [
            "Full-size acoustic guitar (dreadnought style)",
            "Nylon carrying case with shoulder strap",
            "Clip-on digital tuner",
            "Guitar picks (3 different thicknesses)",
            "Extra set of strings",
            "Beginner's chord chart poster",
            "Access code for online lessons (Fender Play, 1 month free)",
            "Guitar strap"
        ],
        "howToUse": "Tune the guitar using the clip-on tuner before each session. Follow the online lessons or use the chord chart to learn basic chords (C, G, D, Am, Em). Practice 15-20 minutes daily for best results. Store in the case when not in use to protect from temperature changes.",
        "careInstructions": "Wipe strings and body with a soft cloth after playing. Keep away from extreme heat, cold, and humidity. Loosen strings slightly for long-term storage. Do not leave in a car or near heaters. Report any cracks or tuning issues immediately.",
        "safetyInfo": "Strings can break under tension—wear safety glasses when tuning for the first time. Keep picks away from small children (choking hazard). Supervise young children during use. Ensure proper posture to avoid back or wrist strain.",
        "recommendedUses": [
            "Learning to play guitar from scratch",
            "Testing if guitar is right for you before buying",
            "Practicing folk, rock, pop, or indie music",
            "Songwriting and composition",
            "Performing at open mic nights",
            "Entertaining at gatherings"
        ],
        "phillyTips": [
            "Philly has a vibrant folk scene—check out Chaplin's and Ortlieb's for open mics",
            "World Cafe Live hosts songwriter nights perfect for beginners",
            "The Philadelphia Folk Song Society offers workshops and jams",
            "Rittenhouse Square has spontaneous musician gatherings in warm weather",
            "Visit C.F. Martin Guitar headquarters in nearby Nazareth, PA for inspiration",
            "South Street Music stores offer free group lessons occasionally"
        ],
        "bestSeasons": ["Year-round"],
        "ageRecommendation": "Ages 10+ (younger children may need 3/4 size guitar)",
        "depositAmount": 50.0,
        "replacementCost": 200.0
    }
}

def main():
    """Add details to batch 3 items"""
    print("Starting Batch 3: Adding details to 20 items...")
    print()

    # Load catalog
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # Add details to each item
    items_updated = 0
    for item in catalog:
        if item['id'] in BATCH_3_DETAILS:
            item['details'] = BATCH_3_DETAILS[item['id']]
            items_updated += 1
            print(f"✓ Added details to: {item['id']} - {item['title']}")

    # Save updated catalog
    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    # Summary
    print()
    print("=" * 60)
    print("✅ BATCH 3 COMPLETE")
    print("=" * 60)
    print(f"Added details to {items_updated} items")
    print()
    print("Items with details:")
    print("  📚 Books: 15 (book_016 to book_030)")
    print("  📦 Library of Things: 5 (lot_011 to lot_015)")
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

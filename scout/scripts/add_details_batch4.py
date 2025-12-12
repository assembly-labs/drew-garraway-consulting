#!/usr/bin/env python3
"""
Add detailed information to catalog items - Batch 4
This script adds rich details to 20 items: book_031 to book_050
"""

import json
import sys
from pathlib import Path

# Define the catalog path
CATALOG_PATH = Path(__file__).parent.parent / "data" / "catalog.json"

# Details for each item in batch 4
BATCH_4_DETAILS = {
    "book_031": {
        "extendedDescription": "Looking at real estate isn't usually a life-or-death situation, but an apartment open house becomes just that when a failed bank robber bursts in and takes a group of strangers hostage. The captives include a recently retired couple, a wealthy banker, a young couple about to have their first baby, and a 87-year-old woman who has lived a long and interesting life. As the hours pass and it becomes clear that the robber is not a criminal mastermind (they forgot to bring bullets), the hostages begin to talk. What emerges are stories of divorce, job loss, anxiety, and the universal human need to be seen and understood. This is vintage Fredrik Backman: funny, heartbreaking, and filled with wisdom about what it means to be human.",
        "authorBio": "Fredrik Backman is the #1 New York Times bestselling author of A Man Called Ove, Beartown, and several other novels. His work has been translated into more than 40 languages. Before becoming a novelist, he was a columnist and blogger. He lives in Stockholm, Sweden, with his wife and two children.",
        "awards": [
            "New York Times Bestseller",
            "Indie Next Pick",
            "LibraryReads Favorite",
            "Over 1 million copies sold worldwide",
            "Goodreads Choice Awards Nominee"
        ],
        "reviews": [
            {
                "reviewer": "People Magazine",
                "quote": "Backman delivers a clever, poignant, and ultimately redemptive tale.",
                "rating": 5
            },
            {
                "reviewer": "Kirkus Reviews",
                "quote": "Surprising, compassionate, and filled with Backman's signature wit."
            }
        ],
        "funFacts": [
            "The title reflects Backman's belief that everyone is anxious",
            "Features Backman's signature blend of humor and heartbreak",
            "The bank robber is one of the most sympathetic criminals in fiction",
            "Each hostage represents a different life stage and challenge",
            "Originally a Swedish novel titled 'Folk med ångest'"
        ],
        "targetAudience": "Fans of A Man Called Ove, readers who love ensemble casts, anyone dealing with anxiety or life transitions, and book clubs seeking heartwarming stories.",
        "similarTitles": ["A Man Called Ove", "Eleanor Oliphant Is Completely Fine", "The Midnight Library"]
    },
    "book_032": {
        "extendedDescription": "Molly Gray is not like everyone else. She struggles with social cues and interprets people literally. Her gran taught her how to navigate the world, but since Gran died, Molly's been on her own. She finds solace in her job as a maid at the Regency Grand Hotel, where she takes pride in her meticulous work and predictable routine. But when she discovers the wealthy and beloved Mr. Black dead in his suite, her life is turned upside down. Molly quickly becomes the police's top suspect. She must navigate a web of lies, secrets, and danger to uncover what really happened. This is a clever mystery with a protagonist you'll root for from the first page.",
        "authorBio": "Nita Prose is a Canadian editor and author. After decades working as a book editor for some of Canada's top authors, she turned to writing fiction with The Maid, her debut novel. She lives in Toronto, Canada.",
        "awards": [
            "#1 New York Times Bestseller",
            "Goodreads Choice Awards Mystery & Thriller Nominee (2022)",
            "Reese's Book Club Pick",
            "Over 1 million copies sold",
            "Universal Pictures film adaptation in development"
        ],
        "reviews": [
            {
                "reviewer": "The Washington Post",
                "quote": "A quirky, charming mystery that will have you guessing until the end.",
                "rating": 4
            },
            {
                "reviewer": "Good Morning America",
                "quote": "Molly the Maid is a character you won't soon forget."
            }
        ],
        "funFacts": [
            "Prose worked as a book editor for 20+ years before writing this",
            "Molly's character is inspired by neurodivergent representation",
            "The hotel setting adds old-fashioned mystery vibes",
            "Florence Pugh is attached to star in the film adaptation",
            "A sequel, The Mystery Guest, was published in 2023"
        ],
        "targetAudience": "Mystery lovers, readers who appreciate neurodivergent characters, fans of cozy mysteries, and anyone who loves underdog protagonists.",
        "similarTitles": ["Eleanor Oliphant Is Completely Fine", "The Curious Incident of the Dog in the Night-Time", "Remarkably Bright Creatures"]
    },
    "book_033": {
        "extendedDescription": "Chemist Elizabeth Zott is not your average woman. In fact, she's not even your average scientist in 1960s California. Elizabeth has a doctorate but is treated like a lab assistant. She dreams of a life where women are respected for their minds, not their looks. When she falls in love with brilliant chemist Calvin Evans, they form a partnership that challenges the norms of their time. But when tragedy strikes, Elizabeth is forced to reinvent herself. She becomes the host of a televisions cooking show called 'Supper at Six,' but this is no ordinary cooking show. Elizabeth uses it to teach women chemistry, physics, and the confidence to think for themselves. This is a sharp, witty, and inspiring story about a woman who refuses to be defined by her era.",
        "authorBio": "Bonnie Garmus is the author of Lessons in Chemistry. Before becoming a novelist, she worked in medicine, education, and technology. This is her debut novel, published when she was in her 60s. She lives in London with her husband and two dogs.",
        "awards": [
            "#1 New York Times Bestseller for over 50 weeks",
            "Goodreads Choice Awards Best Historical Fiction (2022)",
            "Indie Next Pick",
            "Apple TV+ series starring Brie Larson (2023)",
            "Over 6 million copies sold worldwide"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Mad Men meets The Marvelous Mrs. Maisel... Irresistible.",
                "rating": 5
            },
            {
                "reviewer": "NPR",
                "quote": "A laugh-out-loud, pitch-perfect feminist adventure."
            }
        ],
        "funFacts": [
            "Garmus was 64 when this debut novel was published",
            "Elizabeth Zott is inspired by women scientists who were overlooked",
            "The TV show element is a clever vehicle for education and empowerment",
            "Six-Thirty, Elizabeth's dog, is a scene-stealer",
            "The book sat on the NYT bestseller list for over a year"
        ],
        "targetAudience": "Feminists, history buffs, science enthusiasts, fans of strong female characters, book clubs, and anyone who's felt underestimated.",
        "similarTitles": ["The Marvelous Mrs. Maisel (TV)", "Hidden Figures", "The Seven Husbands of Evelyn Hugo"]
    },
    "book_034": {
        "extendedDescription": "Sam and Sadie meet in a hospital when they are twelve. They bond over video games, and though they drift apart, they reunite years later in college. Together, they create a wildly successful video game called Ichigo. Their collaboration turns into a business partnership that launches them to fame, but as the stakes rise, so do the tensions between them. This is a love story, but not a romantic one—it's about the love between creative partners, the kind that can be as consuming and complicated as any romance. It's about the worlds we create, the worlds we escape to, and the impossibility of understanding another person completely.",
        "authorBio": "Gabrielle Zevin is the New York Times bestselling author of several novels for adults and young adults, including The Storied Life of A.J. Fikry. Her books have been translated into 39 languages. She lives in Los Angeles and is a screenwriter as well.",
        "awards": [
            "#1 New York Times Bestseller",
            "Goodreads Choice Awards Best Fiction (2022)",
            "Indie Next Pick",
            "Read with Jenna Book Club Pick",
            "Over 1 million copies sold"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Exhilarating and profound... A love letter to gaming and creativity.",
                "rating": 5
            },
            {
                "reviewer": "Entertainment Weekly",
                "quote": "A stunning exploration of ambition, identity, and the bonds that define us."
            }
        ],
        "funFacts": [
            "Zevin interviewed dozens of game designers for research",
            "The fictional games in the book are described in incredible detail",
            "The title is from Shakespeare's Macbeth",
            "Both protagonists are Asian American—rare representation in literary fiction",
            "The book spans 30 years of gaming history"
        ],
        "targetAudience": "Gamers, readers interested in creative partnerships, fans of character-driven literary fiction, and anyone who's had a complicated friendship.",
        "similarTitles": ["The Song of Achilles", "Normal People", "Ready Player One"]
    },
    "book_035": {
        "extendedDescription": "In June 1954, eighteen-year-old Emmett Watson is driven home to Nebraska by the warden of the juvenile work farm where he has just served fifteen months for involuntary manslaughter. His mother is long gone, his father recently deceased, and the family farm foreclosed upon. Emmett's plan is to pick up his eight-year-old brother, Billy, and head to California to start a new life. But when the warden departs, Emmett discovers that two friends from the work farm have stowed away in the warden's trunk. Together, they embark on a different journey—one that will take them all the way to New York City. This is a story about the roads we take and the roads we leave behind, about kindness and decency, and the power of stories to shape our lives.",
        "authorBio": "Amor Towles is the New York Times bestselling author of Rules of Civility, A Gentleman in Moscow, and The Lincoln Highway. He graduated from Yale College and received an MA in English from Stanford University. He lives in Manhattan with his family.",
        "awards": [
            "#1 New York Times Bestseller",
            "Indie Next Pick",
            "Barack Obama's Favorite Books of 2021",
            "Over 2 million copies sold",
            "Best Book of the Year by multiple publications"
        ],
        "reviews": [
            {
                "reviewer": "The Wall Street Journal",
                "quote": "A remarkable blend of sweetness and doom... Towles is a master.",
                "rating": 5
            },
            {
                "reviewer": "NPR",
                "quote": "A glorious novel about traveling off the beaten path."
            }
        ],
        "funFacts": [
            "The Lincoln Highway was America's first transcontinental highway",
            "The novel takes place over just 10 days in 1954",
            "Each chapter is narrated by a different character",
            "Towles researched 1950s America extensively",
            "The story moves backward in numbers: Chapter 10, 9, 8..."
        ],
        "targetAudience": "Historical fiction fans, road trip enthusiasts, readers who love Towles' elegant prose, and anyone interested in post-war America.",
        "similarTitles": ["A Gentleman in Moscow", "East of Eden", "On the Road"]
    },
    "book_036": {
        "extendedDescription": "Tara Westover was seventeen the first time she set foot in a classroom. Born to survivalists in the mountains of Idaho, she prepared for the end of the world by stockpiling home-canned peaches and sleeping with her 'head-for-the-hills bag.' Her father forbade hospitals, so Tara never saw a doctor or nurse. Gashes and concussions, even burns from explosions, were all treated at home with herbalism. The family was so isolated from mainstream society that there was no one to ensure the children received an education, and no one to intervene when Tara's older brother became violent. Then, lacking any formal schooling, Tara began to educate herself. She taught herself enough mathematics and grammar to be admitted to Brigham Young University, where she studied history. Her quest for knowledge transformed her, taking her to Harvard and to Cambridge University for her PhD. This is an unforgettable memoir about the struggle for self-invention.",
        "authorBio": "Tara Westover grew up in rural Idaho. She holds a PhD in History from Cambridge University and a Master's degree from Trinity College, Cambridge. Educated is her first book. She lives in the United Kingdom.",
        "awards": [
            "#1 New York Times Bestseller for over 100 weeks",
            "Goodreads Choice Awards Best Memoir (2018)",
            "Los Angeles Times Book Prize",
            "Barack Obama's Favorite Books of 2018",
            "Over 10 million copies sold worldwide"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Westover is a keen and consistently surprising writer... Stunning.",
                "rating": 5
            },
            {
                "reviewer": "Bill Gates",
                "quote": "One of the most inspiring books I've ever read."
            }
        ],
        "funFacts": [
            "Westover didn't have a birth certificate until she was nine",
            "She learned about the Holocaust for the first time at BYU",
            "The book has sparked conversations about education and family",
            "Her siblings have disputed some details in the memoir",
            "She earned her PhD from Cambridge at age 27"
        ],
        "targetAudience": "Memoir readers, anyone interested in education, survivors of family trauma, and readers who appreciate stories of resilience and transformation.",
        "contentWarnings": ["Family abuse", "Untreated injuries", "Isolation"],
        "similarTitles": ["The Glass Castle", "Hillbilly Elegy", "Wild"]
    },
    "book_037": {
        "extendedDescription": "In a life filled with meaning and accomplishment, Michelle Obama has emerged as one of the most iconic and compelling women of our era. As First Lady of the United States—the first African American to serve in that role—she helped create the most welcoming and inclusive White House in history. Now, in her own words, she shares her extraordinary journey: from her childhood on the South Side of Chicago to her years balancing the demands of motherhood and work, to her time spent at the world's most famous address. With humor, wisdom, and powerful storytelling, she describes her triumphs and her disappointments, both public and private. This is her story, told by her, in her own words and on her own terms.",
        "authorBio": "Michelle Obama served as First Lady of the United States from 2009 to 2017. A graduate of Princeton University and Harvard Law School, she was a successful attorney, Chicago city administrator, and community outreach leader before becoming First Lady. She is the author of the #1 bestselling memoir Becoming.",
        "awards": [
            "Over 17 million copies sold worldwide",
            "#1 New York Times Bestseller",
            "NAACP Image Award for Outstanding Literary Work",
            "Grammy Award for Best Spoken Word Album",
            "Goodreads Choice Awards Best Memoir (2018)"
        ],
        "reviews": [
            {
                "reviewer": "Oprah Winfrey",
                "quote": "The book I've been waiting for... Inspiring, wise, and revelatory.",
                "rating": 5
            },
            {
                "reviewer": "The Washington Post",
                "quote": "Obama's memoir is a genuine page-turner."
            }
        ],
        "funFacts": [
            "Sold more copies than any other book published in 2018",
            "Translated into 45+ languages",
            "The audiobook, read by Obama herself, won a Grammy",
            "A Netflix documentary about her book tour was released in 2020",
            "She wrote parts of it in longhand"
        ],
        "targetAudience": "Memoir readers, political history enthusiasts, anyone interested in leadership and public service, and readers seeking inspiration.",
        "similarTitles": ["Promised Land (Barack Obama)", "My Life (Bill Clinton)", "A Promised Land"]
    },
    "book_038": {
        "extendedDescription": "Trevor Noah's unlikely path from apartheid South Africa to hosting The Daily Show began with a criminal act: his birth. Born to a white Swiss father and a Black Xhosa mother, Noah's very existence was illegal in a country where racial mixing was punishable by five years in prison. Living proof of his parents' indiscretion, Trevor was kept mostly indoors for his earliest years, his existence a secret to neighbors and authorities. This memoir chronicles Noah's coming-of-age in a country roiling with violence and upheaval. Through stories of resilience, rebellion, and his complicated relationship with his abusive stepfather, Noah paints a moving yet funny portrait of a boy making his way in a world where he was never supposed to exist.",
        "authorBio": "Trevor Noah is the host of The Daily Show, a comedian, and the author of Born a Crime. Born in Johannesburg, South Africa, he began his career in entertainment in South Africa before moving to the United States. He has performed stand-up comedy around the world.",
        "awards": [
            "#1 New York Times Bestseller",
            "Thurber Prize for American Humor",
            "Audie Award for Autobiography/Memoir",
            "NAACP Image Award",
            "Over 2 million copies sold"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Incisive, funny, and vivid... A compelling story about refusing to be crushed by history.",
                "rating": 5
            },
            {
                "reviewer": "Dwight Garner, NYT Critic",
                "quote": "Noah's memoir is a love letter to his mother."
            }
        ],
        "funFacts": [
            "Noah reads the audiobook himself in multiple accents and languages",
            "His mother was shot by his stepfather but survived",
            "He learned multiple South African languages growing up",
            "The book explores colorism, racism, and identity in profound ways",
            "A film adaptation is in development"
        ],
        "targetAudience": "Memoir readers, fans of Trevor Noah, anyone interested in South African history, and readers who appreciate stories that blend humor with serious topics.",
        "contentWarnings": ["Domestic violence", "Poverty", "Apartheid-era racism"],
        "similarTitles": ["Educated", "The Color of Water", "Long Walk to Freedom"]
    },
    "book_039": {
        "extendedDescription": "At the age of thirty-six, on the verge of completing a decade's worth of training as a neurosurgeon, Paul Kalanithi was diagnosed with stage IV lung cancer. One day he was a doctor treating the dying, and the next he was a patient struggling to live. Just like that, the future he and his wife had imagined evaporated. When Breath Becomes Air chronicles Kalanithi's transformation from a naïve medical student into a neurosurgeon working in the brain, and finally into a patient and new father confronting his own mortality. What makes life worth living in the face of death? What do you do when the future, no longer a ladder toward your goals in life, flattens out into a perpetual present? These are some of the questions Kalanithi wrestles with in this profound memoir.",
        "authorBio": "Paul Kalanithi (1977-2015) was a neurosurgeon and writer. He held degrees in English literature, human biology, and the history and philosophy of science and medicine from Stanford and Cambridge, and graduated cum laude from the Yale School of Medicine. He died in March 2015 at the age of 37.",
        "awards": [
            "#1 New York Times Bestseller",
            "Best Book of the Year by multiple publications",
            "Over 2 million copies sold",
            "Pulitzer Prize Finalist (posthumously considered)",
            "Goodreads Choice Awards Finalist"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Rattling, heartbreaking, and ultimately beautiful... A profound meditation on mortality.",
                "rating": 5
            },
            {
                "reviewer": "The Washington Post",
                "quote": "A moving and thoughtful meditation on mortality."
            }
        ],
        "funFacts": [
            "Kalanithi completed the manuscript just before he died",
            "His wife Lucy wrote the afterword",
            "He became a father during his terminal illness",
            "The title comes from a line in a Baron Brooke poem",
            "The book has been translated into 45+ languages"
        ],
        "targetAudience": "Readers grappling with mortality, medical professionals, memoir lovers, and anyone seeking wisdom about living a meaningful life.",
        "contentWarnings": ["Terminal illness", "Death", "Grief"],
        "similarTitles": ["Being Mortal", "The Bright Hour", "The Emperor of All Maladies"]
    },
    "book_040": {
        "extendedDescription": "In this unforgettable memoir, Michelle Zauner tells of growing up as one of the few Asian American kids in her small Oregon town, of struggling with her mother's particular, high expectations, and of a painful adolescence. After her mother is diagnosed with terminal cancer, Zauner is forced to return to the Korean food and traditions she once resisted. Vivid and lyrical, Crying in H Mart is a powerful exploration of grief, identity, and the healing power of food. H Mart is a Korean grocery store chain, and for Zauner, it becomes a place of pilgrimage where she goes to feel close to her mother. This is a book about losing the person who made you feel like yourself, and learning how to carry them with you.",
        "authorBio": "Michelle Zauner is the author of Crying in H Mart and the singer-songwriter behind the indie-pop project Japanese Breakfast. Her music has been nominated for Grammy Awards. She lives in New York.",
        "awards": [
            "#1 New York Times Bestseller",
            "Indie Next Pick",
            "TIME Magazine's Must-Read Books of 2021",
            "Goodreads Choice Awards Nominee",
            "Over 500,000 copies sold"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Powerful... A wrenching, powerful story about food, family, and loss.",
                "rating": 5
            },
            {
                "reviewer": "NPR",
                "quote": "Zauner's prose is unflinchingly honest and deeply moving."
            }
        ],
        "funFacts": [
            "The title essay was originally published in The New Yorker in 2018",
            "Zauner's band Japanese Breakfast gained fame before the book",
            "H Mart stores saw increased traffic after the book's release",
            "A film adaptation is in development with Zauner attached",
            "The book includes recipes her mother cooked"
        ],
        "targetAudience": "Memoir readers, fans of Japanese Breakfast, anyone who has lost a parent, foodies, and readers interested in Korean American identity.",
        "contentWarnings": ["Terminal illness", "Death of a parent", "Grief"],
        "similarTitles": ["The Year of Magical Thinking", "When Breath Becomes Air", "Minor Feelings"]
    },
    "book_041": {
        "extendedDescription": "How did our species succeed in the battle for dominance? Why did our foraging ancestors come together to create cities and kingdoms? How did we come to believe in gods, nations, and human rights; to trust money, books, and laws; and to be enslaved by bureaucracy, timetables, and consumerism? And what will our world be like in the millennia to come? In Sapiens, Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions. Drawing on insights from biology, anthropology, paleontology, and economics, he explores how the currents of history have shaped our human societies, the animals and plants around us, and even our personalities. This is a provocative look at who we are and where we're going.",
        "authorBio": "Professor Yuval Noah Harari is a historian and philosopher. He is the author of the international bestsellers Sapiens, Homo Deus, and 21 Lessons for the 21st Century. He holds a PhD from Oxford University and lectures at Hebrew University of Jerusalem.",
        "awards": [
            "#1 New York Times Bestseller",
            "Over 25 million copies sold worldwide",
            "Bill Gates' Favorite Books",
            "Barack Obama's Favorite Books",
            "Translated into 60+ languages"
        ],
        "reviews": [
            {
                "reviewer": "Jared Diamond, author of Guns, Germs, and Steel",
                "quote": "Tackles the biggest questions of history... Jaw-droppingly good.",
                "rating": 5
            },
            {
                "reviewer": "The Guardian",
                "quote": "Thrilling and addictive... Written in wonderfully lucid prose."
            }
        ],
        "funFacts": [
            "Harari is openly gay and credits his husband with helping edit his work",
            "The book started as a series of lectures at Hebrew University",
            "It took 4 years to write",
            "Mark Zuckerberg recommended it in his book club",
            "The sequel, Homo Deus, explores the future of humanity"
        ],
        "targetAudience": "History buffs, philosophy readers, anyone curious about humanity's past and future, and readers who love big-picture thinking.",
        "similarTitles": ["Guns, Germs, and Steel", "Homo Deus", "The Dawn of Everything"]
    },
    "book_042": {
        "extendedDescription": "From 1915 to 1970, nearly six million Black Americans left the South for northern and western cities, in search of a better life. This was the Great Migration, and it reshaped America. Isabel Wilkerson chronicles this epic story through the lives of three people: Ida Mae Brandon Gladney, who left Mississippi for Chicago; George Swanson Starling, who fled Florida for Harlem; and Robert Joseph Pershing Foster, who journeyed from Louisiana to California. Their stories, and those of millions of others, reveal the truth of a largely overlooked chapter of American history. This is a deeply researched and beautifully written work of narrative history that reads like a novel.",
        "authorBio": "Isabel Wilkerson is a Pulitzer Prize-winning journalist and the author of The Warmth of Other Suns and Caste. She was the first African American woman to win the Pulitzer Prize in journalism. She lives in Atlanta.",
        "awards": [
            "National Book Critics Circle Award",
            "NAACP Image Award",
            "New York Times Notable Book",
            "Barack Obama's Favorite Books",
            "Over 2 million copies sold"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "A landmark piece of nonfiction... Majestic and essential.",
                "rating": 5
            },
            {
                "reviewer": "The Washington Post",
                "quote": "Destined to become a classic of American history."
            }
        ],
        "funFacts": [
            "Wilkerson interviewed over 1,200 people for the book",
            "She followed three protagonists over 15 years of research",
            "The book took 15 years to complete",
            "It's used in college courses across America",
            "The title comes from a Richard Wright poem"
        ],
        "targetAudience": "History readers, anyone interested in African American history, fans of narrative nonfiction, and readers seeking to understand systemic racism.",
        "similarTitles": ["Caste", "The New Jim Crow", "Between the World and Me"]
    },
    "book_043": {
        "extendedDescription": "In the 1920s, the richest people per capita in the world were members of the Osage Nation in Oklahoma, thanks to oil found beneath their land. Then, one by one, the Osage began to be killed off. The family of an Osage woman, Mollie Burkhart, became a prime target. Her relatives were shot and poisoned, and it was clear that the murders were part of a sinister conspiracy to steal their oil money. As the death toll rose, the newly formed FBI took on the case. It was one of the organization's first major homicide investigations. But the bureau was then corrupt and it struggled to solve the case. This is a gripping true story of greed, murder, and racial injustice, and the birth of the FBI.",
        "authorBio": "David Grann is a staff writer at The New Yorker and the bestselling author of The Lost City of Z and The White Darkness. His work has garnered several honors, including a George Polk Award. He lives in Westchester County, New York, with his family.",
        "awards": [
            "#1 New York Times Bestseller",
            "National Book Award Finalist",
            "Edgar Award for Best Fact Crime",
            "Martin Scorsese film adaptation (2023)",
            "Over 5 million copies sold"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "A fiercely entertaining mystery story and a wrenching exploration of evil.",
                "rating": 5
            },
            {
                "reviewer": "The Washington Post",
                "quote": "Disturbing and riveting... A masterpiece of narrative nonfiction."
            }
        ],
        "funFacts": [
            "The Osage Reign of Terror lasted years and many killers were never caught",
            "J. Edgar Hoover used the case to promote the FBI",
            "The book uncovers murders that were never officially investigated",
            "Scorsese's film starred Leonardo DiCaprio and Robert De Niro",
            "Grann spent years researching archives and interviewing descendants"
        ],
        "targetAudience": "True crime fans, history buffs, readers interested in Native American history, and anyone who appreciates investigative journalism.",
        "contentWarnings": ["Murder", "Racism", "Violence against Native Americans"],
        "similarTitles": ["In Cold Blood", "The Lost City of Z", "Midnight in the Garden of Good and Evil"]
    },
    "book_044": {
        "extendedDescription": "Two stories unfold in parallel: the tale of the 1893 Chicago World's Fair, one of the most spectacular events in history, and the story of H.H. Holmes, a charming doctor who used the fair to lure victims to his elaborately constructed 'Murder Castle.' The World's Fair showcased America's coming of age, with innovations like the Ferris wheel and Cracker Jack. But in the shadows, Holmes was committing heinous crimes, building a hotel designed specifically for murder—with soundproofed rooms, gas lines for asphyxiation, and a crematorium in the basement. Erik Larson masterfully weaves these two narratives together, creating a spellbinding portrait of Chicago at a transformative moment.",
        "authorBio": "Erik Larson is the bestselling author of several narrative nonfiction books, including The Splendid and the Vile, Dead Wake, and In the Garden of Beasts. He lives in Manhattan with his wife.",
        "awards": [
            "#1 New York Times Bestseller",
            "Edgar Award for Best Fact Crime",
            "Over 3 million copies sold",
            "Adapted into a Hulu limited series (in development)",
            "National Bestseller for years"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "A compulsively readable tour de force... Larson is a master.",
                "rating": 5
            },
            {
                "reviewer": "Chicago Tribune",
                "quote": "Utterly absorbing... Larson makes history come alive."
            }
        ],
        "funFacts": [
            "Holmes may have killed as many as 200 people",
            "The Ferris wheel was designed specifically for the fair",
            "The fair attracted 27 million visitors—a huge number for the time",
            "Many of Holmes' victims were never identified",
            "Larson uses only historical facts—no invented dialogue"
        ],
        "targetAudience": "True crime readers, history buffs, fans of Chicago, and anyone who loves narrative nonfiction that reads like a thriller.",
        "contentWarnings": ["Murder", "Violence", "Serial killer content"],
        "similarTitles": ["In Cold Blood", "Killers of the Flower Moon", "The Lost City of Z"]
    },
    "book_045": {
        "extendedDescription": "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results. If you're having trouble changing your habits, the problem isn't you. The problem is your system. Bad habits repeat themselves not because you don't want to change, but because you have the wrong system for change. You do not rise to the level of your goals. You fall to the level of your systems. Here, you'll get a proven system that can take you to new heights. Clear draws on neuroscience, psychology, and biology to create an easy-to-understand guide for making good habits inevitable and bad habits impossible.",
        "authorBio": "James Clear is a writer and speaker focused on habits, decision making, and continuous improvement. His work has appeared in the New York Times, Time, and Entrepreneur. His website receives millions of visitors each month. He lives in Columbus, Ohio.",
        "awards": [
            "#1 New York Times Bestseller for over 150 weeks",
            "Over 15 million copies sold worldwide",
            "Amazon's Best Book of the Year (2018)",
            "Wall Street Journal Bestseller",
            "Translated into 50+ languages"
        ],
        "reviews": [
            {
                "reviewer": "Adam Grant",
                "quote": "A supremely practical guide to breaking bad patterns and building great ones.",
                "rating": 5
            },
            {
                "reviewer": "Mark Manson",
                "quote": "A game-changer... One of the best books on habits ever written."
            }
        ],
        "funFacts": [
            "Clear's email newsletter reaches over 1 million subscribers",
            "The 'two-minute rule' has become widely adopted",
            "He developed many ideas from his blog, JamesClear.com",
            "The book's framework: make it obvious, attractive, easy, satisfying",
            "Clear suffered a traumatic brain injury in high school that shaped his thinking"
        ],
        "targetAudience": "Anyone looking to improve their habits, productivity enthusiasts, self-help readers, athletes, and professionals seeking personal growth.",
        "similarTitles": ["The Power of Habit", "Deep Work", "Mindset"]
    },
    "book_046": {
        "extendedDescription": "Trauma is a fact of life. Veterans and their families deal with the painful aftermath of combat; one in five Americans has been molested; one in four grew up with alcoholics; one in three couples have engaged in physical violence. Dr. Bessel van der Kolk, one of the world's foremost experts on trauma, has spent over three decades working with survivors. In The Body Keeps the Score, he uses recent scientific advances to show how trauma literally reshapes both body and brain, compromising sufferers' capacities for pleasure, engagement, self-control, and trust. He explores innovative treatments—from neurofeedback and meditation to sports, drama, and yoga—that offer new paths to recovery by activating the brain's natural neuroplasticity. This is a pioneering work that offers hope and healing to millions.",
        "authorBio": "Bessel van der Kolk, MD, is a psychiatrist, author, researcher, and educator based in Boston. He is the founder of the Trauma Research Foundation and has been conducting research on trauma for over 30 years. His work has revolutionized the treatment of trauma.",
        "awards": [
            "#1 New York Times Bestseller for years",
            "Over 3 million copies sold",
            "One of the most influential psychology books of the decade",
            "Winner of multiple awards for psychology and medicine",
            "Translated into 30+ languages"
        ],
        "reviews": [
            {
                "reviewer": "The New York Times",
                "quote": "Profound... Essential reading for anyone interested in understanding trauma.",
                "rating": 5
            },
            {
                "reviewer": "The Boston Globe",
                "quote": "A landmark book that will transform how we think about trauma."
            }
        ],
        "funFacts": [
            "Van der Kolk has been studying trauma since the 1970s",
            "The book challenges traditional talk therapy approaches",
            "It explores how trauma is stored in the body, not just the mind",
            "EMDR, yoga, and MDMA therapy are among treatments discussed",
            "The title reflects how the body 'remembers' trauma even when the mind suppresses it"
        ],
        "targetAudience": "Trauma survivors, therapists, medical professionals, anyone interested in mental health, and readers seeking to understand PTSD and healing.",
        "contentWarnings": ["Detailed discussion of trauma", "Abuse", "PTSD"],
        "similarTitles": ["The Deepest Well", "What Happened to You?", "Complex PTSD"]
    },
    "book_047": {
        "extendedDescription": "For many years, Glennon Doyle denied her own desires and told herself to be satisfied with what she had. Then, at a conference for her non-profit, she locked eyes with Abby Wambach, the legendary soccer player. In that moment, her carefully built life exploded. Untamed is the story of how Glennon set herself free—first from her addiction to drugs and alcohol, then from the societal expectations that kept her caged. She stopped pleasing and started living. She found that the 'good girl' she'd been trained to be was actually a cage. Untamed shows us how to be brave, to trust ourselves, to stop betraying ourselves, and to become the women we were meant to be. It's a rallying cry for women to free themselves and live authentically.",
        "authorBio": "Glennon Doyle is the author of the #1 New York Times bestsellers Untamed, Love Warrior, and Carry On, Warrior. She is also the founder of Together Rising, a non-profit organization supporting women and families in crisis. She lives in Florida with her wife Abby Wambach and three children.",
        "awards": [
            "#1 New York Times Bestseller for over 100 weeks",
            "Reese's Book Club Pick",
            "Over 2 million copies sold",
            "Goodreads Choice Awards Nominee",
            "Oprah's Book Club Pick"
        ],
        "reviews": [
            {
                "reviewer": "Brené Brown",
                "quote": "This book is going to change lives... A must-read.",
                "rating": 5
            },
            {
                "reviewer": "Elizabeth Gilbert",
                "quote": "Glennon is the voice of a generation of women who are waking up."
            }
        ],
        "funFacts": [
            "Doyle left her husband and married Abby Wambach in 2017",
            "The book's central metaphor is a captive cheetah being freed",
            "Reese Witherspoon optioned the book for a TV adaptation",
            "Doyle's organization Together Rising has raised over $25 million",
            "The book became an instant phenomenon on social media"
        ],
        "targetAudience": "Women seeking empowerment, LGBTQ+ readers, memoir and self-help fans, and anyone questioning societal expectations.",
        "similarTitles": ["Wild", "Educated", "Big Magic"]
    },
    "book_048": {
        "extendedDescription": "Intelligence is usually seen as the ability to think and learn, but in a rapidly changing world, there's another set of cognitive skills that might matter more: the ability to rethink and unlearn. In Think Again, Adam Grant makes a compelling case for why we need to spend as much time rethinking as we do thinking. We live in a rapidly changing world, and the ability to question our opinions and open our minds to new perspectives is more important than ever. Grant identifies the critical art of rethinking: learning to question your opinions and open other people's minds, which can position you for excellence at work and wisdom in life. This is a book about the benefit of doubt, and about how we can get better at embracing the unknown and the joy of being wrong.",
        "authorBio": "Adam Grant is an organizational psychologist at Wharton, where he has been the top-rated professor for seven straight years. He is a #1 New York Times bestselling author of Give and Take, Originals, and Option B. He hosts the podcast WorkLife.",
        "awards": [
            "#1 New York Times Bestseller",
            "#1 Wall Street Journal Bestseller",
            "Financial Times Book of the Year",
            "Over 1 million copies sold",
            "Amazon Best Business Book of 2021"
        ],
        "reviews": [
            {
                "reviewer": "Daniel Kahneman",
                "quote": "A must-read... Grant offers a master class in how to rethink.",
                "rating": 5
            },
            {
                "reviewer": "Susan Cain",
                "quote": "Brilliant... This book will challenge how you think about thinking."
            }
        ],
        "funFacts": [
            "Grant is one of the youngest tenured professors at Wharton",
            "He's been recognized as one of the world's 10 most influential management thinkers",
            "The book challenges confirmation bias and overconfidence",
            "Grant interviews firefighters, vaccine scientists, and educators",
            "His TED talks have been viewed over 25 million times"
        ],
        "targetAudience": "Business professionals, psychology enthusiasts, lifelong learners, and anyone interested in improving their decision-making and critical thinking.",
        "similarTitles": ["Thinking, Fast and Slow", "Mindset", "The Scout Mindset"]
    },
    "book_049": {
        "extendedDescription": "What is the nature of space and time? How do we fit within the universe? How does the universe fit within us? There's no better guide through these mind-expanding questions than acclaimed astrophysicist and best-selling author Neil deGrasse Tyson. But today, few of us have time to contemplate the cosmos. So Tyson brings the universe down to Earth succinctly and clearly, with sparkling wit, in digestible chapters consumable anytime and anywhere in your busy day. While waiting for your morning coffee to brew, or while waiting for the bus, the train, or the plane to arrive, Astrophysics for People in a Hurry will reveal just what you need to be fluent and ready for the next cosmic headlines: from the Big Bang to black holes, from quarks to quantum mechanics, and from the search for planets to the search for life in the universe.",
        "authorBio": "Neil deGrasse Tyson is an astrophysicist and the director of the Hayden Planetarium in New York City. He is the host of StarTalk Radio and the Emmy-nominated Cosmos: A Spacetime Odyssey. He lives in New York City.",
        "awards": [
            "#1 New York Times Bestseller",
            "Over 1 million copies sold",
            "Amazon Best Science Book",
            "Translated into 20+ languages",
            "Won multiple science communication awards"
        ],
        "reviews": [
            {
                "reviewer": "USA Today",
                "quote": "Tyson is a rock star of science... Accessible and fun.",
                "rating": 4
            },
            {
                "reviewer": "The Guardian",
                "quote": "An illuminating read that makes complex science digestible."
            }
        ],
        "funFacts": [
            "The book was written for people with limited time",
            "Each chapter can be read in about 10 minutes",
            "Tyson has become one of the most famous scientists in America",
            "He's known for making science accessible and entertaining",
            "The book covers everything from dark matter to the multiverse"
        ],
        "targetAudience": "Science enthusiasts, busy professionals, students, and anyone curious about the universe but short on time.",
        "similarTitles": ["A Brief History of Time", "Cosmos", "The Universe in a Nutshell"]
    },
    "book_050": {
        "extendedDescription": "Jennifer Doudna was a professor at Berkeley when her life changed forever. She and her collaborator Emmanuelle Charpentier invented a tool that can edit DNA with astonishing ease—CRISPR. This technology, which won them the Nobel Prize in 2020, gives humanity the power to rewrite the code of life itself. It can be used to cure diseases, engineer crops, and even alter human embryos. But it also raises profound ethical questions: Should we edit our children's genes? Where do we draw the line? In The Code Breaker, Walter Isaacson tells the story of this scientific revolution through the life of its most important protagonist. It's a story about competition, collaboration, and the future of the human race.",
        "authorBio": "Walter Isaacson is the bestselling author of biographies of Leonardo da Vinci, Steve Jobs, Albert Einstein, and Benjamin Franklin. He is a professor at Tulane University and was CEO of the Aspen Institute. He lives in New Orleans.",
        "awards": [
            "#1 New York Times Bestseller",
            "Amazon Best Science Book of 2021",
            "Financial Times Best Book of the Year",
            "Goodreads Choice Awards Science Nominee",
            "Over 500,000 copies sold"
        ],
        "reviews": [
            {
                "reviewer": "Bill Gates",
                "quote": "A fascinating account of the most important biological breakthrough of our era.",
                "rating": 5
            },
            {
                "reviewer": "The New York Times",
                "quote": "A thrilling detective story... Isaacson at his best."
            }
        ],
        "funFacts": [
            "Doudna and Charpentier won the Nobel Prize in Chemistry in 2020",
            "CRISPR stands for Clustered Regularly Interspaced Short Palindromic Repeats",
            "The technology was developed from bacteria immune systems",
            "A Chinese scientist controversially used CRISPR on human embryos in 2018",
            "Isaacson interviewed Doudna extensively for the book"
        ],
        "targetAudience": "Science readers, biography fans, anyone interested in genetics and bioethics, and readers curious about the future of medicine.",
        "similarTitles": ["The Gene", "Life After Life", "The Immortal Life of Henrietta Lacks"]
    }
}

def main():
    """Add details to batch 4 items"""
    print("Starting Batch 4: Adding details to 20 books...")
    print()

    # Load catalog
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # Add details to each item
    items_updated = 0
    for item in catalog:
        if item['id'] in BATCH_4_DETAILS:
            item['details'] = BATCH_4_DETAILS[item['id']]
            items_updated += 1
            print(f"✓ Added details to: {item['id']} - {item['title']}")

    # Save updated catalog
    with open(CATALOG_PATH, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)

    # Summary
    print()
    print("=" * 60)
    print("✅ BATCH 4 COMPLETE")
    print("=" * 60)
    print(f"Added details to {items_updated} items")
    print()
    print("Items with details:")
    print("  📚 Books: 20 (book_031 to book_050)")
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

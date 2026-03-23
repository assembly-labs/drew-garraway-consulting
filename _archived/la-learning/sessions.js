/**
 * DISCOVER LA - Session Content Data
 * 10 Sessions about California and Los Angeles
 *
 * Each session contains:
 * - id: unique identifier
 * - number: display number (1-10)
 * - title: session title
 * - subtitle: brief description
 * - duration: estimated time in minutes
 * - sections: array of content sections with paragraphs
 * - images: array of image objects
 * - facts: array of "Did You Know?" facts
 * - quiz: array of quiz questions
 */

const SESSIONS_DATA = [
    // ========================================
    // SESSION 1: Welcome to California!
    // ========================================
    {
        id: 'session-1',
        number: 1,
        title: 'Welcome to California!',
        subtitle: 'Discover the Golden State',
        duration: 7,
        icon: '🌟',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
            alt: 'Dramatic Big Sur coastline with rocky cliffs meeting the Pacific Ocean',
            credit: 'Big Sur Coast'
        },
        sections: [
            {
                heading: 'The Golden State',
                icon: '☀️',
                paragraphs: [
                    "Welcome to California, one of the most amazing states in the entire United States! California is called the \"Golden State\" because of its beautiful golden hills, sunny weather, and the famous Gold Rush that brought thousands of people here in 1849. It's the third largest state by size and the most populated state in the whole country!",
                    "California sits on the west coast of the United States, right next to the Pacific Ocean. To the north is Oregon, to the south is Mexico, to the east are Nevada and Arizona. The state stretches about 770 miles from top to bottom - that's like driving for 12 hours!",
                    "One of the coolest things about California is how different the land can be. You can find snowy mountains, hot deserts, beautiful beaches, and giant redwood forests all in the same state. Mount Whitney is the highest point in the lower 48 states, while Death Valley is the lowest and hottest place in North America!"
                ]
            },
            {
                heading: 'The California Flag',
                icon: '🐻',
                paragraphs: [
                    "Have you ever seen the California flag? It has a grizzly bear walking on green grass with a red star above it and a red stripe at the bottom. The words \"California Republic\" are written below the bear.",
                    "The bear on the flag represents strength and independence. The flag was first created in 1846 during the Bear Flag Revolt when California briefly became its own republic before joining the United States. Even though grizzly bears no longer live in California, they remain an important symbol of the state."
                ]
            },
            {
                heading: 'State Symbols & Major Cities',
                icon: '🏙️',
                paragraphs: [
                    "California has lots of special symbols! The state flower is the beautiful orange California poppy. The state tree is the giant redwood - the tallest trees on Earth! And of course, the state animal is the grizzly bear from the flag.",
                    "California has many famous cities. Sacramento is the capital city where the state government works. San Francisco is known for the Golden Gate Bridge and cable cars. San Diego has amazing beaches and a world-famous zoo. And then there's Los Angeles - but we'll learn all about LA in our next sessions!",
                    "Get ready for an amazing adventure through California and Los Angeles. By the end of these 10 sessions, you'll be an expert on one of the coolest places in the world!"
                ]
            }
        ],
        images: [
            {
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Flag_of_California.svg/1280px-Flag_of_California.svg.png',
                alt: 'California state flag with grizzly bear',
                caption: 'The California Bear Flag'
            },
            {
                src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1000&q=80',
                alt: 'Golden Gate Bridge spanning San Francisco Bay at sunset',
                caption: 'San Francisco\'s Golden Gate Bridge'
            },
            {
                src: 'https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=1000&q=80',
                alt: 'Towering giant sequoia redwood trees reaching toward the sky',
                caption: 'California\'s giant redwood trees'
            },
            {
                src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
                alt: 'Golden sand beach with turquoise Pacific Ocean waves',
                caption: 'California\'s stunning Pacific coastline'
            },
            {
                src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1000&q=80',
                alt: 'Vibrant orange California poppies blooming in a field',
                caption: 'California\'s state flower - the Golden Poppy'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'If California were its own country, it would have the 5th largest economy in the entire world - bigger than the United Kingdom!'
            },
            {
                title: 'Did You Know?',
                content: 'Death Valley in California once recorded a temperature of 134°F (56.7°C) - the hottest temperature ever recorded on Earth!'
            },
            {
                title: 'Did You Know?',
                content: 'California produces almost half of all the fruits, vegetables, and nuts grown in the United States. That includes over 80% of the world\'s almonds!'
            }
        ],
        quiz: [
            {
                question: 'What is California\'s nickname?',
                options: ['The Sunshine State', 'The Golden State', 'The Bear State', 'The Pacific State'],
                correctIndex: 1,
                explanation: 'California is called "The Golden State" because of its golden hills, sunny weather, and the Gold Rush of 1849!'
            },
            {
                question: 'What animal is on the California flag?',
                options: ['Eagle', 'Mountain Lion', 'Grizzly Bear', 'Deer'],
                correctIndex: 2,
                explanation: 'The grizzly bear on the California flag represents strength and independence.'
            },
            {
                question: 'What is the capital city of California?',
                options: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
                correctIndex: 3,
                explanation: 'Sacramento is California\'s capital city where the state government is located.'
            },
            {
                question: 'What is California\'s state flower?',
                options: ['Rose', 'California Poppy', 'Sunflower', 'Tulip'],
                correctIndex: 1,
                explanation: 'The beautiful orange California poppy is the state flower.'
            },
            {
                question: 'Which ocean borders California to the west?',
                options: ['Atlantic Ocean', 'Indian Ocean', 'Pacific Ocean', 'Arctic Ocean'],
                correctIndex: 2,
                explanation: 'The Pacific Ocean is on California\'s western border, giving it beautiful beaches!'
            }
        ]
    },

    // ========================================
    // SESSION 2: Los Angeles - The City of Angels
    // ========================================
    {
        id: 'session-2',
        number: 2,
        title: 'Los Angeles - The City of Angels',
        subtitle: 'Meet America\'s second largest city',
        duration: 8,
        icon: '😇',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1400&q=80',
            alt: 'Downtown Los Angeles skyline with palm trees at golden hour',
            credit: 'LA Skyline'
        },
        sections: [
            {
                heading: 'Welcome to LA!',
                icon: '🌴',
                paragraphs: [
                    "Los Angeles is the second largest city in the United States, right after New York City! About 4 million people live in the city itself, but the greater LA area has almost 13 million people. That's more people than live in many entire countries!",
                    "The name \"Los Angeles\" comes from Spanish and means \"The Angels.\" The city's full original name was \"El Pueblo de Nuestra Señora la Reina de los Ángeles del Río Porciúncula\" - which means \"The Town of Our Lady the Queen of the Angels of the Porciúncula River.\" That's quite a mouthful, so everyone just calls it LA!",
                    "Here's something really important to know: LA has over 100 different neighborhoods! In these sessions, we'll explore some of the most famous ones, but remember - there are so many more amazing places to discover. LA is like a bunch of small cities all connected together!"
                ]
            },
            {
                heading: 'LA\'s Amazing Geography',
                icon: '🏔️',
                paragraphs: [
                    "One of the coolest things about Los Angeles is that you can go from the beach to the mountains in just about an hour! The Santa Monica Mountains run through the middle of LA, and the San Gabriel Mountains are just to the north. Some people even ski in the mountains in the morning and surf at the beach in the afternoon!",
                    "Los Angeles has an amazing climate with warm, sunny weather almost all year round. The average temperature is around 70°F (21°C), and it rarely rains. This perfect weather is one of the reasons so many people wanted to move here and why the movie industry chose LA as its home."
                ]
            },
            {
                heading: 'A City of Diversity',
                icon: '🌍',
                paragraphs: [
                    "Los Angeles is one of the most diverse cities in the world! People from every country and culture call LA home. You can find neighborhoods where people speak Spanish, Korean, Chinese, Armenian, Thai, and hundreds of other languages. This diversity makes LA's food, art, and culture incredibly exciting.",
                    "Throughout our learning adventure, we'll explore LA's amazing sports teams, delicious food, world-famous entertainment industry, beautiful beaches, cool neighborhoods, and so much more. Each session will teach you something new about this incredible city. Get ready to become an LA expert!"
                ]
            }
        ],
        images: [
            {
                src: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1000&q=80',
                alt: 'Los Angeles skyline with palm trees at sunset',
                caption: 'Downtown LA\'s impressive skyline'
            },
            {
                src: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1000&q=80',
                alt: 'The famous Hollywood Sign on Mount Lee',
                caption: 'The iconic Hollywood Sign'
            },
            {
                src: 'https://images.unsplash.com/photo-1566232392379-afd9298e6a46?w=1000&q=80',
                alt: 'Griffith Observatory at dusk with LA city lights',
                caption: 'Griffith Observatory overlooking the city'
            },
            {
                src: 'https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Tall palm trees lining a Los Angeles street',
                caption: 'Palm-lined LA streets'
            },
            {
                src: 'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=1000&q=80',
                alt: 'Aerial view of Los Angeles basin stretching to the horizon',
                caption: 'LA stretches for miles'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'Los Angeles was founded on September 4, 1781, by Spanish settlers. That means the city is over 240 years old!'
            },
            {
                title: 'Did You Know?',
                content: 'LA has more museums per capita than any other city in the world - over 840 museums and galleries!'
            },
            {
                title: 'Did You Know?',
                content: 'The famous Hollywood sign originally said "Hollywoodland" when it was built in 1923 as an advertisement for a housing development!'
            }
        ],
        quiz: [
            {
                question: 'What does "Los Angeles" mean in Spanish?',
                options: ['The Stars', 'The Angels', 'The Beaches', 'The Mountains'],
                correctIndex: 1,
                explanation: 'Los Angeles means "The Angels" in Spanish, which is why it\'s called the City of Angels!'
            },
            {
                question: 'How many neighborhoods does LA have?',
                options: ['About 25', 'About 50', 'Over 100', 'About 10'],
                correctIndex: 2,
                explanation: 'LA has over 100 different neighborhoods, each with its own unique character!'
            },
            {
                question: 'Los Angeles is the _____ largest city in the United States.',
                options: ['First', 'Second', 'Third', 'Fourth'],
                correctIndex: 1,
                explanation: 'LA is the second largest US city, right after New York City.'
            },
            {
                question: 'What type of climate does Los Angeles have?',
                options: ['Cold and snowy', 'Warm and sunny', 'Rainy all year', 'Very humid'],
                correctIndex: 1,
                explanation: 'LA has warm, sunny weather almost all year round with very little rain!'
            }
        ]
    },

    // ========================================
    // SESSION 3: LA Sports Teams
    // ========================================
    {
        id: 'session-3',
        number: 3,
        title: 'LA Sports Teams',
        subtitle: 'Rams, Dodgers, and Championship Glory',
        duration: 8,
        icon: '🏈',
        heroImage: {
            src: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1400',
            alt: 'Green football field inside a massive stadium under bright lights',
            credit: 'Football Stadium'
        },
        sections: [
            {
                heading: 'The Los Angeles Rams',
                icon: '🏈',
                paragraphs: [
                    "The Los Angeles Rams are one of the most exciting football teams in the NFL! In February 2022, the Rams won Super Bowl LVI right here in their home stadium, SoFi Stadium, beating the Cincinnati Bengals 23-20 in an incredible game. It was a dream come true for LA football fans!",
                    "The Rams play at SoFi Stadium in Inglewood, which is the most amazing football stadium in the world. It cost $5 billion to build, making it the most expensive stadium ever constructed! The stadium has a giant see-through roof made of a special material called ETFE, and the Infinity Screen inside is as long as a football field and weighs 2.2 million pounds - that's heavier than three Boeing 747 airplanes!",
                    "The Rams have a long history in Los Angeles. They first came to LA in 1946, then moved to St. Louis in 1995, and finally came back home to LA in 2016. Some of the greatest players in NFL history have been Rams, including the 'Fearsome Foursome' defensive line in the 1960s. In the Super Bowl winning team, stars like quarterback Matthew Stafford, wide receiver Cooper Kupp (who was the Super Bowl MVP!), and defensive tackle Aaron Donald led the team to victory.",
                    "The Rams wear blue and yellow (sometimes called 'sol' which means sun in Spanish), honoring LA's sunny weather. Their helmet has the famous curled ram horns on the sides. On game days, SoFi Stadium fills with over 70,000 fans cheering 'Whose house? RAMS HOUSE!'"
                ]
            },
            {
                heading: 'The Los Angeles Dodgers',
                icon: '⚾',
                paragraphs: [
                    "The Los Angeles Dodgers are one of the most legendary baseball teams in history! They play at Dodger Stadium in Chavez Ravine, which opened in 1962 and is the largest baseball stadium in the world. It can hold over 56,000 fans, and on game nights the stadium lights up beautifully against the LA skyline and San Gabriel Mountains.",
                    "The Dodgers have won 7 World Series championships, including exciting wins in 2020 and 2024! The team has some of the best players in baseball today, like Mookie Betts, Freddie Freeman, and pitcher Clayton Kershaw, who has spent his whole career with the Dodgers. In 2024, Japanese superstar Shohei Ohtani joined the team in the biggest contract in sports history!",
                    "The Dodgers have an incredibly important place in American history. In 1947, when the team was still in Brooklyn, New York, Jackie Robinson became the first African American to play Major League Baseball in the modern era. He faced terrible racism but showed incredible courage, becoming a hero and opening the door for all players of color. The Dodgers retired his number 42, and now every player in baseball wears #42 on Jackie Robinson Day each year.",
                    "Going to a Dodgers game is a classic LA experience. Fans arrive early for batting practice, eat Dodger Dogs (the stadium sells over 2 million each season!), and stay for fireworks on Friday nights. The team's rivalry with the San Francisco Giants is one of the oldest and most intense in all of sports!"
                ]
            },
            {
                heading: 'More LA Sports: Lakers, Kings & Galaxy',
                icon: '🏀',
                paragraphs: [
                    "Beyond football and baseball, LA has amazing teams in every sport! The Los Angeles Lakers are one of the most famous basketball teams in history, with 17 NBA championships. Legends like Magic Johnson, Kareem Abdul-Jabbar, Shaquille O'Neal, Kobe Bryant, and now LeBron James have worn the purple and gold. The LA Clippers are the other NBA team, and both play at Crypto.com Arena downtown.",
                    "The LA Kings brought hockey to sunny Southern California and have won 2 Stanley Cups (2012 and 2014). For soccer fans, the LA Galaxy have won 5 MLS Cup championships - more than any other team! Stars like David Beckham helped make soccer popular in LA. There's also LAFC, a newer team that won the MLS Cup in 2022, and Angel City FC, a women's soccer team with celebrity owners.",
                    "LA also hosts amazing college sports. USC and UCLA both play in Los Angeles and have legendary football and basketball programs. The Rose Bowl in Pasadena hosts the famous Rose Bowl Game every New Year's Day and was the site of many World Cup and Olympic soccer matches. With so many teams and world-class stadiums, Los Angeles truly is a sports paradise!"
                ]
            }
        ],
        images: [
            {
                src: 'https://images.pexels.com/photos/270071/pexels-photo-270071.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Football stadium filled with fans under bright lights',
                caption: 'SoFi Stadium - Home of the LA Rams'
            },
            {
                src: 'https://images.pexels.com/photos/1374546/pexels-photo-1374546.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Baseball player swinging bat at night game',
                caption: 'Legendary Dodger Stadium action'
            },
            {
                src: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Basketball going through the hoop',
                caption: 'Lakers basketball action'
            },
            {
                src: 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Basketball player dunking during a game',
                caption: 'High-flying basketball action'
            },
            {
                src: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Soccer ball on green grass field',
                caption: 'LA Galaxy and LAFC soccer'
            },
            {
                src: 'https://images.pexels.com/photos/2466407/pexels-photo-2466407.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Excited fans cheering at sports stadium',
                caption: 'LA fans are the best!'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'SoFi Stadium\'s giant video screen is called the "Infinity Screen" and has over 70,000 square feet of LED lights - it\'s the largest video board in sports!'
            },
            {
                title: 'Did You Know?',
                content: 'The Dodgers have retired 11 jersey numbers, including #42 for Jackie Robinson. His number was retired across ALL of Major League Baseball - the only player to ever have that honor!'
            },
            {
                title: 'Did You Know?',
                content: 'The LA Rams\' Super Bowl LVI win in 2022 was the second time a team won the Super Bowl in their own home stadium. The first was the Tampa Bay Buccaneers just one year earlier!'
            }
        ],
        quiz: [
            {
                question: 'When did the LA Rams win their most recent Super Bowl?',
                options: ['2018', '2020', '2022', '2024'],
                correctIndex: 2,
                explanation: 'The Rams won Super Bowl LVI in February 2022, beating the Cincinnati Bengals 23-20 at SoFi Stadium!'
            },
            {
                question: 'What is special about Dodger Stadium?',
                options: ['It\'s the newest stadium', 'It\'s the largest baseball stadium in the world', 'It\'s indoors', 'It\'s the smallest stadium'],
                correctIndex: 1,
                explanation: 'Dodger Stadium is the largest baseball stadium in the world by seating capacity, holding over 56,000 fans!'
            },
            {
                question: 'Who broke baseball\'s color barrier playing for the Dodgers in 1947?',
                options: ['Sandy Koufax', 'Shohei Ohtani', 'Jackie Robinson', 'Mookie Betts'],
                correctIndex: 2,
                explanation: 'Jackie Robinson became the first African American to play in MLB in the modern era, showing incredible courage and becoming an American hero.'
            },
            {
                question: 'How much did SoFi Stadium cost to build?',
                options: ['$1 billion', '$3 billion', '$5 billion', '$10 billion'],
                correctIndex: 2,
                explanation: 'SoFi Stadium cost about $5 billion to build, making it the most expensive stadium ever constructed in the world!'
            },
            {
                question: 'Who was the MVP of the Rams\' Super Bowl LVI victory?',
                options: ['Matthew Stafford', 'Aaron Donald', 'Cooper Kupp', 'Odell Beckham Jr.'],
                correctIndex: 2,
                explanation: 'Wide receiver Cooper Kupp caught 8 passes for 92 yards and 2 touchdowns, including the game-winning score, earning Super Bowl MVP!'
            }
        ]
    },

    // ========================================
    // SESSION 4: LA Food & Flavors
    // ========================================
    {
        id: 'session-4',
        number: 4,
        title: 'LA Food & Flavors',
        subtitle: 'Tacos, In-N-Out, and world cuisines',
        duration: 7,
        icon: '🌮',
        heroImage: {
            src: 'https://images.pexels.com/photos/4958641/pexels-photo-4958641.jpeg?auto=compress&cs=tinysrgb&w=1400',
            alt: 'Delicious authentic street tacos with fresh toppings',
            credit: 'LA Street Tacos'
        },
        sections: [
            {
                heading: 'Taco Paradise',
                icon: '🌮',
                paragraphs: [
                    "If you love tacos, Los Angeles might just be the best city in the world for you! LA has an incredible Mexican food scene, with thousands of taco trucks, taco stands, and Mexican restaurants throughout the city. Many people say LA has the best tacos outside of Mexico itself!",
                    "Street tacos are a huge part of LA culture. You'll find taco trucks parked on street corners all over the city, especially at night. The most popular types include carne asada (grilled beef), carnitas (slow-cooked pork), al pastor (marinated pork with pineapple), and chicken. Most tacos come on small corn tortillas with onions, cilantro, and different salsas.",
                    "The reason LA has such amazing Mexican food is because of its close connection to Mexico. LA is only about 120 miles from the Mexican border, and millions of Mexican-Americans call LA home. They brought their delicious recipes and cooking traditions with them, making LA a true taco paradise!"
                ]
            },
            {
                heading: 'In-N-Out & California Classics',
                icon: '🍔',
                paragraphs: [
                    "No trip to California is complete without trying In-N-Out Burger! This famous fast-food chain started right here in Southern California in 1948 and has become legendary. What makes In-N-Out special is that they use fresh ingredients - their beef is never frozen, and they cut their fries fresh every day right in the restaurant!",
                    "In-N-Out has a \"secret menu\" that everyone knows about. You can order your burger \"Animal Style\" (with extra sauce, grilled onions, and pickles), get a \"Protein Style\" burger wrapped in lettuce instead of a bun, or try a \"4x4\" with four beef patties! The simple menu of burgers, fries, and shakes has kept customers coming back for over 75 years."
                ]
            },
            {
                heading: 'World Flavors in LA',
                icon: '🌍',
                paragraphs: [
                    "Because LA is so diverse, you can find amazing food from almost every country in the world! Koreatown has incredible Korean BBQ restaurants where you grill your own meat at the table. Thai Town on Hollywood Boulevard serves authentic Thai food. Little Ethiopia offers delicious Ethiopian cuisine that you eat with your hands using spongy bread called injera.",
                    "Grand Central Market in downtown LA is a food lover's dream. This historic market has been open since 1917 and features dozens of food stalls serving everything from pupusas to ramen to fresh fruit. Food trucks are also a huge part of LA food culture - there are over 4,000 food trucks in the city serving cuisines from around the globe!",
                    "LA also has amazing farmers markets where you can buy fresh California produce. The state grows so many fruits and vegetables that the markets are always full of strawberries, avocados, oranges, and more. The Hollywood Farmers Market and Santa Monica Farmers Market are two of the most popular ones!"
                ]
            }
        ],
        images: [
            {
                src: 'https://images.pexels.com/photos/7613568/pexels-photo-7613568.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Authentic street tacos with fresh cilantro and onions',
                caption: 'LA\'s famous street tacos'
            },
            {
                src: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Juicy cheeseburger with crispy fries',
                caption: 'Classic California burger and fries'
            },
            {
                src: 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Korean BBQ meat sizzling on the grill',
                caption: 'Sizzling Korean BBQ in Koreatown'
            },
            {
                src: 'https://images.pexels.com/photos/1766686/pexels-photo-1766686.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Colorful food truck serving customers',
                caption: 'LA\'s famous food trucks'
            },
            {
                src: 'https://images.pexels.com/photos/3184188/pexels-photo-3184188.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Fresh produce at a farmers market stall',
                caption: 'Fresh food at LA farmers markets'
            },
            {
                src: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Fresh sushi rolls beautifully arranged',
                caption: 'LA\'s world-class sushi'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'Los Angeles has over 4,000 food trucks - more than any other city in the United States! The food truck movement actually started here in LA.'
            },
            {
                title: 'Did You Know?',
                content: 'The French Dip sandwich was invented in LA! Two restaurants in downtown LA - Philippe\'s and Cole\'s - both claim to have invented it around 1908.'
            },
            {
                title: 'Did You Know?',
                content: 'In-N-Out\'s menu has secret Bible verses printed on their cups and burger wrappers. The company was started by a Christian family and continues this tradition today.'
            }
        ],
        quiz: [
            {
                question: 'What makes In-N-Out Burger special?',
                options: ['They have the most locations', 'They use fresh, never-frozen ingredients', 'They only sell chicken', 'They\'re open 24 hours'],
                correctIndex: 1,
                explanation: 'In-N-Out uses fresh ingredients - their beef is never frozen and they cut their fries fresh daily!'
            },
            {
                question: 'What is "Animal Style" at In-N-Out?',
                options: ['A burger shaped like an animal', 'A burger with extra sauce, grilled onions, and pickles', 'A vegetarian option', 'A kids meal'],
                correctIndex: 1,
                explanation: 'Animal Style means your burger comes with extra sauce, grilled onions, and pickles - it\'s from their famous secret menu!'
            },
            {
                question: 'Where can you find amazing Korean BBQ in LA?',
                options: ['Malibu', 'Koreatown', 'Santa Monica', 'Venice Beach'],
                correctIndex: 1,
                explanation: 'Koreatown (also called K-Town) has incredible Korean BBQ restaurants where you grill your own meat at the table!'
            },
            {
                question: 'What is Grand Central Market?',
                options: ['A grocery store', 'A historic food hall with many food stalls', 'A sports arena', 'A farmers market'],
                correctIndex: 1,
                explanation: 'Grand Central Market is a historic food hall in downtown LA that has been open since 1917, featuring dozens of food stalls!'
            },
            {
                question: 'Why does LA have such great Mexican food?',
                options: ['It\'s far from Mexico', 'It has no Mexican residents', 'It\'s close to Mexico with millions of Mexican-Americans', 'Mexican food was invented in LA'],
                correctIndex: 2,
                explanation: 'LA is only 120 miles from Mexico, and millions of Mexican-Americans live there, bringing authentic recipes and traditions!'
            }
        ]
    },

    // ========================================
    // SESSION 5: Entertainment Capital of the World
    // ========================================
    {
        id: 'session-5',
        number: 5,
        title: 'Entertainment Capital of the World',
        subtitle: 'Hollywood, movies, and theme parks',
        duration: 8,
        icon: '🎬',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1400&q=80',
            alt: 'Vintage movie projector with dramatic lighting in a cinema',
            credit: 'Hollywood Magic'
        },
        sections: [
            {
                heading: 'Hollywood & The Movie Industry',
                icon: '🎬',
                paragraphs: [
                    "Los Angeles is called the \"Entertainment Capital of the World\" because it's where most movies and TV shows are made! The movie industry came to LA in the early 1900s because of the sunny weather (perfect for filming), diverse landscapes (beaches, mountains, deserts all nearby), and cheap land. By the 1920s, Hollywood had become the center of the film world.",
                    "Today, LA is home to the biggest movie studios in the world. Warner Bros. in Burbank is where Harry Potter, Batman, and Friends were made. Universal Studios created Jurassic Park, E.T., and the Fast & Furious movies. Paramount Pictures is the only major studio still located in Hollywood itself, and they've made movies for over 100 years!",
                    "The Oscars, also called the Academy Awards, are held in Hollywood every year. This is the most famous award show for movies, where actors, directors, and filmmakers celebrate the best films. The ceremony takes place at the Dolby Theatre on Hollywood Boulevard, and celebrities walk the famous red carpet while millions of people watch around the world!"
                ]
            },
            {
                heading: 'Theme Parks & Fun',
                icon: '🎢',
                paragraphs: [
                    "Universal Studios Hollywood isn't just a movie studio - it's also an amazing theme park! You can go on rides based on popular movies like Harry Potter, Jurassic World, and Super Mario. The famous Studio Tour takes you behind the scenes where real movies and TV shows are filmed. You might even see a production happening!",
                    "Just about 30 miles south of LA is Disneyland, the original Disney theme park! Walt Disney opened Disneyland in 1955 in Anaheim, and it's been called \"The Happiest Place on Earth\" ever since. Disneyland and Disney California Adventure have classic rides like Space Mountain, the Matterhorn, and newer attractions like Star Wars: Galaxy's Edge and Avengers Campus.",
                    "Six Flags Magic Mountain, north of LA, is perfect for thrill-seekers with some of the tallest and fastest roller coasters in the world. Knott's Berry Farm, near Disneyland, is America's oldest theme park and is famous for its boysenberries and Old West theme!"
                ]
            },
            {
                heading: 'Music & Live Entertainment',
                icon: '🎵',
                paragraphs: [
                    "LA isn't just about movies - it's also a huge center for music! Many of the world's biggest musicians live in LA or come here to record their albums. Famous recording studios like Capitol Records (the round building in Hollywood) have recorded artists from Frank Sinatra to Katy Perry.",
                    "The city has incredible venues for live music and concerts. The Hollywood Bowl is an outdoor amphitheater that can hold 17,500 people, and it's been hosting concerts since 1922. The Grammy Awards, which honor the best music of the year, are usually held in LA. Whether you love pop, rock, hip-hop, or classical music, LA has it all!",
                    "Thousands of people move to LA every year hoping to become actors, musicians, directors, or other entertainment professionals. It's a city where dreams come true, and you never know when you might spot a celebrity walking down the street or see a movie being filmed right in front of you!"
                ]
            }
        ],
        images: [
            {
                src: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1000&q=80',
                alt: 'The iconic Hollywood Sign on Mount Lee',
                caption: 'The iconic Hollywood Sign'
            },
            {
                src: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1000&q=80',
                alt: 'Film camera and crew on a movie set',
                caption: 'Behind the scenes in Hollywood'
            },
            {
                src: 'https://images.pexels.com/photos/2507025/pexels-photo-2507025.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Theme park roller coaster against blue sky',
                caption: 'Thrilling theme park rides'
            },
            {
                src: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1000&q=80',
                alt: 'Ferris wheel at amusement park at night',
                caption: 'Theme park magic at night'
            },
            {
                src: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Concert crowd with hands up and colorful lights',
                caption: 'Live music in LA'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'The Hollywood Sign was originally built in 1923 and said "Hollywoodland" - it was just an advertisement for a housing development! The "land" part was removed in 1949.'
            },
            {
                title: 'Did You Know?',
                content: 'Disneyland was built in just one year! Walt Disney purchased the land in 1954 and opened the park on July 17, 1955. Opening day was so chaotic it was nicknamed "Black Sunday."'
            },
            {
                title: 'Did You Know?',
                content: 'The first movie theater in the US opened in LA in 1902. Today, LA County has over 400 movie theaters with thousands of screens!'
            }
        ],
        quiz: [
            {
                question: 'Why did the movie industry come to Los Angeles?',
                options: ['Because of cold weather', 'Because of sunny weather, diverse landscapes, and cheap land', 'Because there were no other cities', 'Because of the ocean'],
                correctIndex: 1,
                explanation: 'Filmmakers chose LA for its sunny weather (great for filming), diverse nearby landscapes, and affordable land in the early 1900s.'
            },
            {
                question: 'Where are the Academy Awards (Oscars) held?',
                options: ['Universal Studios', 'Disneyland', 'Dolby Theatre', 'Hollywood Bowl'],
                correctIndex: 2,
                explanation: 'The Academy Awards ceremony is held at the Dolby Theatre on Hollywood Boulevard in Hollywood!'
            },
            {
                question: 'When did Disneyland open?',
                options: ['1945', '1955', '1965', '1975'],
                correctIndex: 1,
                explanation: 'Walt Disney opened Disneyland on July 17, 1955, and it\'s been called "The Happiest Place on Earth" ever since!'
            },
            {
                question: 'Which studio made Harry Potter and Batman movies?',
                options: ['Universal Studios', 'Paramount Pictures', 'Warner Bros.', 'Disney'],
                correctIndex: 2,
                explanation: 'Warner Bros. Studios in Burbank made the Harry Potter and Batman movies, along with many other famous films!'
            },
            {
                question: 'What is the Hollywood Bowl?',
                options: ['A bowling alley', 'An outdoor music amphitheater', 'A football stadium', 'A restaurant'],
                correctIndex: 1,
                explanation: 'The Hollywood Bowl is a famous outdoor amphitheater that can hold 17,500 people and has been hosting concerts since 1922!'
            }
        ]
    },

    // ========================================
    // SESSION 6: LA's Amazing Beaches
    // ========================================
    {
        id: 'session-6',
        number: 6,
        title: 'LA\'s Amazing Beaches',
        subtitle: 'Santa Monica, Venice, Malibu and more',
        duration: 7,
        icon: '🏖️',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=1400&q=80',
            alt: 'Santa Monica Pier with Ferris wheel at golden hour',
            credit: 'Santa Monica Pier'
        },
        sections: [
            {
                heading: 'Santa Monica - The Classic Beach',
                icon: '🎡',
                paragraphs: [
                    "Santa Monica Beach is probably the most famous beach in Los Angeles! It's known for the Santa Monica Pier, which has been standing since 1909. The pier has a Ferris wheel, roller coaster, carousel, and an aquarium. At night, the pier lights up beautifully and you can see it from miles away along the coast.",
                    "The beach itself is huge - about 3.5 miles long with soft, golden sand. It's perfect for swimming, sunbathing, volleyball, and building sandcastles. Behind the beach is the Third Street Promenade, a pedestrian street full of shops, restaurants, and street performers. Santa Monica also marks the official end of the famous Route 66, the historic highway that stretches all the way from Chicago!",
                    "Santa Monica has a year-round sunny climate that makes it perfect for beach activities almost every day. The water can be a bit chilly (usually around 60-68°F), but that doesn't stop millions of visitors from enjoying this beautiful beach every year!"
                ]
            },
            {
                heading: 'Venice Beach - Weird & Wonderful',
                icon: '🛹',
                paragraphs: [
                    "Just south of Santa Monica is Venice Beach, one of the most unique and colorful places in all of Los Angeles! Venice Beach is famous for its boardwalk (called the Ocean Front Walk), where you'll see street performers, artists selling their work, fortune tellers, and people showing off all kinds of talents.",
                    "Venice Beach has one of the most famous outdoor gyms in the world called Muscle Beach, where bodybuilders have been working out since the 1930s. The Venice Skate Park is a legendary spot for skateboarders. You'll also see the beautiful Venice Canals nearby - actual canals with water and bridges, built in 1905 to look like Venice, Italy!",
                    "The neighborhood of Venice is known for being artsy, creative, and a little bit eccentric. Artists, musicians, and surfers have always been drawn to this area. Today, it's also home to many tech companies (nicknamed \"Silicon Beach\"), but it still keeps its fun, bohemian spirit!"
                ]
            },
            {
                heading: 'Malibu & More Beaches',
                icon: '🌊',
                paragraphs: [
                    "Malibu is a beach city stretching 27 miles along the coast, famous for its beautiful scenery and celebrity homes! The beaches here are some of the best for surfing - Surfrider Beach near the Malibu Pier is a legendary surf spot. The water is cleaner here, and the mountains come right down to meet the ocean, creating stunning views.",
                    "Manhattan Beach and Hermosa Beach are part of the South Bay, known for their laid-back beach-town feel. These beaches are popular with families and have great beach volleyball - Manhattan Beach actually hosts a famous professional volleyball tournament every year. El Segundo Beach, near LAX airport, is a quieter spot where you can watch planes take off over the ocean!",
                    "LA County has 75 miles of coastline with many different beaches to explore. Each one has its own personality - from busy and exciting Santa Monica to peaceful Malibu coves. Surfing is a huge part of LA beach culture, and you'll see surfers catching waves at almost every beach. Many consider LA to be one of the best places in the world to learn to surf!"
                ]
            }
        ],
        images: [
            {
                src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
                alt: 'Beautiful golden sand beach with turquoise waves',
                caption: 'LA\'s stunning beaches'
            },
            {
                src: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1000&q=80',
                alt: 'Venice Beach boardwalk with palm trees',
                caption: 'Colorful Venice Beach'
            },
            {
                src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1000&q=80',
                alt: 'Surfer riding a wave at sunset',
                caption: 'Surfing is huge in LA!'
            },
            {
                src: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Beach volleyball players diving for the ball',
                caption: 'Beach volleyball on the sand'
            },
            {
                src: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Silhouette of people on beach at sunset',
                caption: 'Sunset at the beach'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'Santa Monica Pier is the only pier on the West Coast that has an amusement park on it! The Ferris wheel is solar-powered and has 174,000 LED lights.'
            },
            {
                title: 'Did You Know?',
                content: 'Venice Beach was created by a man named Abbot Kinney in 1905. He wanted to bring the culture of Venice, Italy to California, complete with Italian-style buildings and real canals!'
            },
            {
                title: 'Did You Know?',
                content: 'The beach volleyball scene in the movie Top Gun was filmed at Manhattan Beach. Beach volleyball actually started in Santa Monica in the 1920s!'
            }
        ],
        quiz: [
            {
                question: 'What famous historic highway ends at Santa Monica Pier?',
                options: ['Highway 1', 'Route 66', 'Interstate 5', 'Pacific Coast Highway'],
                correctIndex: 1,
                explanation: 'Route 66, the famous highway that runs from Chicago to the Pacific Ocean, officially ends at Santa Monica Pier!'
            },
            {
                question: 'What is Venice Beach famous for?',
                options: ['Mountains', 'Its colorful boardwalk and street performers', 'Snow skiing', 'Desert landscapes'],
                correctIndex: 1,
                explanation: 'Venice Beach is famous for its unique boardwalk with street performers, artists, Muscle Beach, and the skate park!'
            },
            {
                question: 'Why is Malibu a great place for surfing?',
                options: ['No waves', 'Surfrider Beach is a legendary surf spot', 'Too many sharks', 'Water is too cold'],
                correctIndex: 1,
                explanation: 'Malibu\'s Surfrider Beach is a legendary surf spot with great waves, attracting surfers from around the world!'
            },
            {
                question: 'What makes Venice, California unique?',
                options: ['It has no beaches', 'It has real canals like Venice, Italy', 'It snows there', 'It\'s in the desert'],
                correctIndex: 1,
                explanation: 'Venice has actual canals with water and bridges, built in 1905 to look like Venice, Italy!'
            },
            {
                question: 'How many miles of coastline does LA County have?',
                options: ['25 miles', '50 miles', '75 miles', '100 miles'],
                correctIndex: 2,
                explanation: 'LA County has 75 miles of beautiful coastline with many different beaches to explore!'
            }
        ]
    },

    // ========================================
    // SESSION 7: Arts, Nature & Cool Neighborhoods
    // ========================================
    {
        id: 'session-7',
        number: 7,
        title: 'Arts, Nature & Cool Neighborhoods',
        subtitle: 'Griffith Observatory, museums, and artsy areas',
        duration: 8,
        icon: '🎨',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1566232392379-afd9298e6a46?w=1400&q=80',
            alt: 'Griffith Observatory at dusk with LA city lights in the background',
            credit: 'Griffith Observatory'
        },
        sections: [
            {
                heading: 'Griffith Observatory & Park',
                icon: '🔭',
                paragraphs: [
                    "High in the Hollywood Hills sits one of LA's most iconic landmarks: the Griffith Observatory! This beautiful white building has been inspiring people to explore the universe since 1935. Best of all, it's completely FREE to visit! The observatory has amazing telescopes that you can look through at night to see the moon, planets, and stars.",
                    "Inside the observatory, you'll find exhibits about space, a planetarium with incredible star shows, and the famous Foucault pendulum that proves Earth is spinning. From the outside terraces, you get breathtaking views of the entire LA basin - you can see from downtown to the ocean on a clear day. It's also one of the best places to see the Hollywood Sign up close!",
                    "Griffith Park is the largest urban park in the United States, covering over 4,300 acres! That's five times bigger than Central Park in New York. The park has hiking trails, the LA Zoo, a merry-go-round, pony rides, a train museum, and even an old Western town. It's a perfect escape from the busy city."
                ]
            },
            {
                heading: 'World-Class Museums',
                icon: '🏛️',
                paragraphs: [
                    "Los Angeles has some of the best museums in the world! The Getty Center sits on a hill in Brentwood with stunning architecture and incredible art - and admission is free! You take a cool tram up the hill to reach it. The museum has paintings by famous artists like Van Gogh, Monet, and Rembrandt, plus beautiful gardens with views of the city and ocean.",
                    "LACMA (the Los Angeles County Museum of Art) is the largest art museum in the western United States. Its most famous feature is \"Urban Light\" - a forest of 202 vintage street lamps that light up at night and have appeared in many movies. The Natural History Museum has dinosaur fossils, a butterfly pavilion, and exhibits about LA's history from prehistoric times to today.",
                    "The California Science Center is another free museum where you can see the Space Shuttle Endeavour - a real spacecraft that flew 25 missions into space! Kids love the hands-on exhibits where you can learn about science by doing experiments."
                ]
            },
            {
                heading: 'Hip Neighborhoods: Silver Lake & Los Feliz',
                icon: '🎨',
                paragraphs: [
                    "Silver Lake and Los Feliz are two of LA's coolest neighborhoods, known for their artsy, creative vibe. These hilly areas near Griffith Park are full of indie coffee shops, vintage clothing stores, quirky restaurants, and beautiful old houses from the 1920s-1940s. Many artists, musicians, and creative types live here.",
                    "The streets are lined with colorful murals and street art. The Silver Lake Reservoir has a walking path where locals jog and walk their dogs. Sunset Junction, where two streets cross in Silver Lake, is a popular spot with interesting shops and cafes. Los Feliz is right at the base of Griffith Park and has a charming small-town feel despite being in the middle of a huge city.",
                    "These neighborhoods show how LA isn't just about Hollywood glamour - there are many unique communities with their own character. Walking around Silver Lake or Los Feliz feels completely different from being on Hollywood Boulevard or at the beach!"
                ]
            }
        ],
        images: [
            {
                src: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1000&q=80',
                alt: 'The Getty Center museum with stunning modern architecture',
                caption: 'The stunning Getty Center'
            },
            {
                src: 'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Row of vintage street lamps glowing at dusk',
                caption: 'LACMA\'s famous Urban Light'
            },
            {
                src: 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Colorful street art mural on building wall',
                caption: 'Street art in the Arts District'
            },
            {
                src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1000&q=80',
                alt: 'Hiker on trail with scenic mountain view',
                caption: 'Hiking in Griffith Park'
            },
            {
                src: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Cozy hipster coffee shop interior',
                caption: 'Silver Lake coffee culture'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'Griffith Observatory was donated by Griffith J. Griffith, who also gave the land for Griffith Park. He wanted everyone to be able to look at the stars, which is why admission is still free today!'
            },
            {
                title: 'Did You Know?',
                content: 'LACMA\'s "Urban Light" installation uses 202 cast-iron street lamps from the 1920s and 1930s that once lit the streets of Los Angeles. Each lamp is different!'
            },
            {
                title: 'Did You Know?',
                content: 'The Space Shuttle Endeavour at the California Science Center traveled through the streets of LA on a special 12-mile journey from LAX airport. It took 2 days because it was so big!'
            }
        ],
        quiz: [
            {
                question: 'What can you see at Griffith Observatory for FREE?',
                options: ['Movies', 'Telescopes and space exhibits', 'Live music', 'Sports games'],
                correctIndex: 1,
                explanation: 'Griffith Observatory is free to visit and has telescopes, space exhibits, and a planetarium with star shows!'
            },
            {
                question: 'What is special about the Getty Center?',
                options: ['It\'s underground', 'It\'s free and has amazing art with great views', 'It\'s only open at night', 'It\'s the oldest building in LA'],
                correctIndex: 1,
                explanation: 'The Getty Center offers free admission, incredible art collections, beautiful architecture, and stunning views of LA!'
            },
            {
                question: 'What can you see at the California Science Center?',
                options: ['The Titanic', 'The Space Shuttle Endeavour', 'The Statue of Liberty', 'The Liberty Bell'],
                correctIndex: 1,
                explanation: 'The California Science Center is home to the Space Shuttle Endeavour, a real spacecraft that flew 25 missions!'
            },
            {
                question: 'What is "Urban Light" at LACMA?',
                options: ['A light show', '202 vintage street lamps', 'A movie theater', 'A flashlight exhibit'],
                correctIndex: 1,
                explanation: 'Urban Light is a famous art installation made of 202 vintage street lamps from 1920s-1930s Los Angeles!'
            },
            {
                question: 'What type of neighborhoods are Silver Lake and Los Feliz?',
                options: ['Beach towns', 'Artsy, creative neighborhoods', 'Industrial areas', 'Desert communities'],
                correctIndex: 1,
                explanation: 'Silver Lake and Los Feliz are known as artsy, creative neighborhoods with indie shops, street art, and a unique vibe!'
            }
        ]
    },

    // ========================================
    // SESSION 8: Downtown LA - Past & Present
    // ========================================
    {
        id: 'session-8',
        number: 8,
        title: 'Downtown LA - Past & Present',
        subtitle: 'Historic Olvera Street to modern skyscrapers',
        duration: 7,
        icon: '🏛️',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?w=1400&q=80',
            alt: 'Walt Disney Concert Hall silver architecture against blue sky',
            credit: 'Disney Concert Hall'
        },
        sections: [
            {
                heading: 'Where LA Began: Olvera Street',
                icon: '🏛️',
                paragraphs: [
                    "Downtown Los Angeles is where the city was born! In 1781, a group of 44 settlers from Mexico founded a small village here, and that tiny settlement grew into the huge city we know today. Olvera Street, the oldest part of LA, still exists and is now a colorful Mexican marketplace.",
                    "Walking down Olvera Street feels like stepping back in time and into Mexico! The narrow brick street is lined with stalls selling traditional Mexican crafts, pottery, leather goods, and clothing. You can eat delicious tacos, churros, and other Mexican treats. Mariachi musicians often play, and there are always fun festivals and celebrations throughout the year.",
                    "Right next to Olvera Street is the Avila Adobe, the oldest house still standing in Los Angeles. It was built in 1818! You can walk through it for free and imagine what life was like over 200 years ago when LA was just a tiny village of adobe buildings."
                ]
            },
            {
                heading: 'Modern Downtown Skyline',
                icon: '🏙️',
                paragraphs: [
                    "Today's downtown LA looks very different from 1781! The skyline is filled with tall, shiny skyscrapers. The US Bank Tower was the tallest building west of the Mississippi River for many years at 1,018 feet. From the observation deck called Skyspace LA, you can see 360-degree views and even ride a glass slide on the outside of the building!",
                    "LA City Hall is one of the most recognizable buildings in downtown. Built in 1928, it was the tallest building in LA for decades and has appeared in countless movies and TV shows. You might recognize it from Superman or Dragnet! Union Station, LA's beautiful train station, opened in 1939 and combines Spanish Colonial and Art Deco architecture. It's still a working train station and is considered one of the most beautiful in America.",
                    "The Walt Disney Concert Hall, designed by famous architect Frank Gehry, looks like it's made of crumpled silver paper! This stunning building is home to the LA Philharmonic orchestra and is a masterpiece of modern architecture. You can take free tours to see inside."
                ]
            },
            {
                heading: 'Arts District & Grand Central Market',
                icon: '🎨',
                paragraphs: [
                    "The Arts District is one of the coolest parts of downtown LA. This former industrial area with old warehouses has been transformed into a creative hub full of art galleries, hip restaurants, and amazing street art. Almost every building has colorful murals painted on it, making the whole neighborhood feel like an outdoor art museum.",
                    "Grand Central Market, which we mentioned in the food session, is a must-visit in downtown. This historic food hall has been serving hungry Angelenos since 1917. You can find food from all over the world here - tacos, Thai food, ramen, sandwiches, ice cream, and much more, all under one roof!",
                    "Downtown LA has changed a lot in recent years. Once a place that emptied out after work hours, it's now a vibrant neighborhood where thousands of people live. There are new apartments, rooftop bars, and entertainment venues everywhere. The transformation shows how cities can reinvent themselves while still honoring their history!"
                ]
            }
        ],
        images: [
            {
                src: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Colorful Mexican marketplace with pinatas and crafts',
                caption: 'Historic Olvera Street'
            },
            {
                src: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1000&q=80',
                alt: 'Downtown LA skyscrapers at sunset with palm trees',
                caption: 'Modern downtown LA skyline'
            },
            {
                src: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?w=1000&q=80',
                alt: 'Walt Disney Concert Hall dramatic silver curves',
                caption: 'The stunning Disney Concert Hall'
            },
            {
                src: 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Large colorful street art mural',
                caption: 'Arts District street murals'
            },
            {
                src: 'https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Los Angeles palm trees lining a street',
                caption: 'LA\'s iconic palm tree streets'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'Los Angeles was founded with a population of just 44 people - 11 families who traveled from Mexico. Today, LA has almost 4 million people!'
            },
            {
                title: 'Did You Know?',
                content: 'The Walt Disney Concert Hall took 16 years to build and cost $274 million. The building uses 12,500 pieces of stainless steel on its exterior!'
            },
            {
                title: 'Did You Know?',
                content: 'LA City Hall appeared in the Adventures of Superman TV show as the Daily Planet building. For many years, no building in LA was allowed to be taller than City Hall!'
            }
        ],
        quiz: [
            {
                question: 'What is Olvera Street?',
                options: ['A new shopping mall', 'The oldest part of LA with a Mexican marketplace', 'An airport', 'A beach'],
                correctIndex: 1,
                explanation: 'Olvera Street is the oldest part of Los Angeles, now a colorful Mexican marketplace with shops, food, and history!'
            },
            {
                question: 'When was Los Angeles founded?',
                options: ['1681', '1781', '1881', '1981'],
                correctIndex: 1,
                explanation: 'Los Angeles was founded in 1781 by 44 settlers from Mexico who started a small village that grew into a huge city!'
            },
            {
                question: 'Who designed the Walt Disney Concert Hall?',
                options: ['Walt Disney', 'Frank Gehry', 'Frank Lloyd Wright', 'Mickey Mouse'],
                correctIndex: 1,
                explanation: 'Famous architect Frank Gehry designed the Walt Disney Concert Hall with its unique crumpled metal exterior!'
            },
            {
                question: 'What is the Arts District known for?',
                options: ['Beaches', 'Street art and murals on old warehouses', 'Mountains', 'Amusement parks'],
                correctIndex: 1,
                explanation: 'The Arts District is known for its amazing street art, murals, galleries, and creative atmosphere in converted warehouses!'
            },
            {
                question: 'What is Union Station?',
                options: ['A gas station', 'A beautiful historic train station', 'A union headquarters', 'A space station'],
                correctIndex: 1,
                explanation: 'Union Station is LA\'s beautiful historic train station, opened in 1939, and is considered one of the most gorgeous in America!'
            }
        ]
    },

    // ========================================
    // SESSION 9: Hollywood & Beverly Hills
    // ========================================
    {
        id: 'session-9',
        number: 9,
        title: 'Hollywood & Beverly Hills',
        subtitle: 'Walk of Fame, Rodeo Drive, and celebrity culture',
        duration: 8,
        icon: '⭐',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1400&q=80',
            alt: 'Hollywood Walk of Fame stars embedded in the sidewalk',
            credit: 'Walk of Fame'
        },
        sections: [
            {
                heading: 'Hollywood Boulevard & Walk of Fame',
                icon: '⭐',
                paragraphs: [
                    "Hollywood Boulevard is one of the most famous streets in the world! The Hollywood Walk of Fame stretches for 15 blocks along the sidewalk, featuring more than 2,700 five-pointed stars embedded in the ground. Each star honors a celebrity from movies, TV, music, radio, or theater. Finding your favorite celebrity's star is like a treasure hunt!",
                    "New stars are added every year in special ceremonies where celebrities come to see their star unveiled. Some of the most visited stars include Michael Jackson, Marilyn Monroe, and the Beatles. There are even stars for fictional characters like Mickey Mouse, Bugs Bunny, and Shrek! Look down as you walk - you never know whose star you might step on.",
                    "The TCL Chinese Theatre (originally called Grauman's Chinese Theatre) is a must-see landmark on Hollywood Boulevard. Built in 1927, this ornate movie palace is famous for the handprints and footprints of movie stars in the cement courtyard. You can compare your hands to those of famous actors! The theater still shows movies today, including many premieres."
                ]
            },
            {
                heading: 'The Sunset Strip & West Hollywood',
                icon: '🎸',
                paragraphs: [
                    "The Sunset Strip is a 1.5-mile stretch of Sunset Boulevard running through West Hollywood. Since the 1960s, it's been the heart of LA's rock music scene. Famous clubs like the Whisky a Go Go, The Roxy, and The Viper Room have launched the careers of bands like The Doors, Guns N' Roses, and many more.",
                    "West Hollywood (often called WeHo) is its own small city surrounded by Los Angeles. It's known for being a welcoming, diverse community and hosts one of the largest Pride celebrations in the world. The area has trendy restaurants, boutiques, and a vibrant nightlife scene. Giant billboards advertising movies and TV shows line Sunset Boulevard, creating the famous \"Billboard Row.\"",
                    "The Comedy Store on the Sunset Strip has been making people laugh since 1972. Almost every famous comedian has performed there, from Robin Williams to Eddie Murphy to Kevin Hart. It's a legendary spot in comedy history!"
                ]
            },
            {
                heading: 'Beverly Hills & Rodeo Drive',
                icon: '💎',
                paragraphs: [
                    "Beverly Hills is one of the most famous and wealthy cities in the world. This small city (only about 5.7 square miles) is surrounded by Los Angeles and is home to many celebrities and business leaders. The tree-lined streets feature beautiful mansions, manicured lawns, and fancy cars.",
                    "Rodeo Drive is the most famous shopping street in Beverly Hills - maybe in all of America! This three-block stretch features the most luxurious stores in the world, including Gucci, Chanel, Louis Vuitton, and many more. Even if you can't afford to shop there, it's fun to walk around and window shop. You might even spot a celebrity!",
                    "The Beverly Hills Hotel, nicknamed \"The Pink Palace,\" has been hosting Hollywood royalty since 1912. The Beverly Wilshire Hotel, seen in the movie Pretty Woman, is another famous landmark. Celebrity tour buses drive through Beverly Hills so tourists can try to spot where famous people live. The famous Beverly Hills sign welcomes visitors to this glamorous city."
                ]
            }
        ],
        images: [
            {
                src: 'https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Tall palm trees against blue sky in Hollywood',
                caption: 'Hollywood palm trees'
            },
            {
                src: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Neon signs lit up on a night street',
                caption: 'The Sunset Strip at night'
            },
            {
                src: 'https://images.pexels.com/photos/1722183/pexels-photo-1722183.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Elegant shopping street with designer stores',
                caption: 'Luxurious Rodeo Drive'
            },
            {
                src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1000&q=80',
                alt: 'Beautiful modern luxury home with pool',
                caption: 'Beverly Hills mansions'
            },
            {
                src: 'https://images.pexels.com/photos/2507025/pexels-photo-2507025.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Hollywood hills at sunset with city views',
                caption: 'Views from Beverly Hills'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'The first star on the Hollywood Walk of Fame was awarded to actress Joanne Woodward in 1960. The Walk of Fame now has over 2,700 stars and grows by about 20-30 new stars each year!'
            },
            {
                title: 'Did You Know?',
                content: 'To get a star on the Walk of Fame, someone must be nominated, approved by a committee, AND pay a $75,000 fee! The fee covers the star creation and the ceremony.'
            },
            {
                title: 'Did You Know?',
                content: 'The Beverly Hills zip code 90210 became so famous from the TV show "Beverly Hills, 90210" that it\'s now recognized around the world as a symbol of wealth and glamour!'
            }
        ],
        quiz: [
            {
                question: 'How many stars are on the Hollywood Walk of Fame?',
                options: ['About 500', 'About 1,000', 'More than 2,700', 'Exactly 100'],
                correctIndex: 2,
                explanation: 'The Hollywood Walk of Fame has more than 2,700 stars honoring celebrities from movies, TV, music, radio, and theater!'
            },
            {
                question: 'What can you see at the TCL Chinese Theatre?',
                options: ['Chinese food', 'Handprints and footprints of movie stars', 'A zoo', 'The Hollywood Sign'],
                correctIndex: 1,
                explanation: 'The TCL Chinese Theatre is famous for its cement courtyard with handprints and footprints of movie stars!'
            },
            {
                question: 'What is the Sunset Strip known for?',
                options: ['Beaches', 'Famous rock music clubs', 'Theme parks', 'Sports stadiums'],
                correctIndex: 1,
                explanation: 'The Sunset Strip is famous for legendary rock music clubs like the Whisky a Go Go and The Roxy!'
            },
            {
                question: 'What is Rodeo Drive?',
                options: ['A horse racing track', 'A famous luxury shopping street', 'A highway', 'A beach'],
                correctIndex: 1,
                explanation: 'Rodeo Drive is the most famous luxury shopping street in Beverly Hills, featuring designer stores like Gucci and Chanel!'
            },
            {
                question: 'What is Beverly Hills famous for?',
                options: ['Mountains', 'Beaches', 'Wealthy homes and celebrity residents', 'Factories'],
                correctIndex: 2,
                explanation: 'Beverly Hills is famous for its beautiful mansions, wealthy residents, and celebrity homes!'
            }
        ]
    },

    // ========================================
    // SESSION 10: More LA Treasures
    // ========================================
    {
        id: 'session-10',
        number: 10,
        title: 'More LA Treasures',
        subtitle: 'Pasadena, The Valley, and continued exploration',
        duration: 7,
        icon: '💎',
        heroImage: {
            src: 'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=1400&q=80',
            alt: 'Aerial view of Los Angeles with mountains and city stretching to the horizon',
            credit: 'LA Aerial View'
        },
        sections: [
            {
                heading: 'Pasadena: Rose Bowl & More',
                icon: '🌹',
                paragraphs: [
                    "Pasadena is a charming city just northeast of downtown LA, famous around the world for the Tournament of Roses Parade and Rose Bowl football game every New Year's Day! The parade features incredible floats completely covered in flowers, roses, and natural materials. Over 700,000 people line the streets to watch, and millions more watch on TV.",
                    "The Rose Bowl stadium is one of the most famous sports venues in America. Built in 1922, it has hosted five Super Bowls, the World Cup, Olympics soccer, and countless college football games. The stadium is nicknamed \"The Granddaddy of Them All\" and can hold over 90,000 fans! There's also a huge flea market at the Rose Bowl on the second Sunday of every month.",
                    "Old Town Pasadena is a wonderful place to walk around, with historic buildings now filled with shops, restaurants, and entertainment. The Huntington Library has incredible art, rare books (including a Gutenberg Bible!), and beautiful gardens. Caltech, one of the world's top science universities, is also in Pasadena - it's where NASA's Jet Propulsion Laboratory scientists work!"
                ]
            },
            {
                heading: 'The San Fernando Valley',
                icon: '🎬',
                paragraphs: [
                    "The San Fernando Valley (often just called \"The Valley\") is a huge area north of the Hollywood Hills where millions of people live. The Valley is where many of the big movie and TV studios are located. Warner Bros., Disney, Universal, and NBC are all in or near the Valley, in cities like Burbank and Studio City.",
                    "The Valley has its own unique culture and even its own accent (\"Valley Girl\" speak became famous in the 1980s). It's home to many shopping malls, including the famous Sherman Oaks Galleria. The weather in the Valley is usually hotter than coastal LA because it's separated from the ocean by the mountains.",
                    "Studio City and Burbank are great places to spot filming in action. You might see streets blocked off for movie shoots or celebrities grabbing coffee. The Valley also has great hiking in places like Runyon Canyon and Fryman Canyon, where you can escape the city and enjoy nature."
                ]
            },
            {
                heading: 'So Much More to Explore!',
                icon: '🎉',
                paragraphs: [
                    "Congratulations - you've completed all 10 sessions and learned so much about California and Los Angeles! But remember, we've only scratched the surface. LA has over 100 neighborhoods, and each one has its own special character, food, and attractions waiting to be discovered.",
                    "Some other amazing places you might explore someday include: Long Beach with its aquarium and the Queen Mary ship, Catalina Island just off the coast, Little Tokyo's Japanese culture, Chinatown, the LA River bike path, Exposition Park with its rose garden, and so many more amazing spots!",
                    "Los Angeles is a city of dreamers - people who come from all over the world to chase their dreams in entertainment, technology, business, and the arts. Now that you know so much about LA, maybe one day you'll visit and explore these amazing places yourself. Who knows? Maybe you'll even live here someday and discover your own favorite LA treasures!"
                ]
            }
        ],
        images: [
            {
                src: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Beautiful red and pink roses in full bloom',
                caption: 'The Rose Parade features millions of flowers'
            },
            {
                src: 'https://images.pexels.com/photos/270071/pexels-photo-270071.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Large football stadium packed with fans',
                caption: 'The legendary Rose Bowl'
            },
            {
                src: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Historic shopping district with neon signs',
                caption: 'Charming Old Town Pasadena'
            },
            {
                src: 'https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=1000',
                alt: 'Professional film camera on a movie set',
                caption: 'The Valley is home to major film studios'
            },
            {
                src: 'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=1000&q=80',
                alt: 'Panoramic aerial view of Los Angeles skyline',
                caption: 'Beautiful Los Angeles awaits!'
            }
        ],
        facts: [
            {
                title: 'Did You Know?',
                content: 'The Rose Parade floats must be completely covered in flowers, seeds, bark, or other natural materials. Some floats use over 400,000 flowers! Volunteers spend thousands of hours decorating them.'
            },
            {
                title: 'Did You Know?',
                content: 'The San Fernando Valley is so big that if it were its own city, it would be the 6th largest city in the United States! Over 1.8 million people live there.'
            },
            {
                title: 'Did You Know?',
                content: 'More movies and TV shows are filmed in the LA area than anywhere else in the world. On any given day, there are about 50-100 productions filming somewhere in the city!'
            }
        ],
        quiz: [
            {
                question: 'What is the Tournament of Roses famous for?',
                options: ['Car racing', 'A parade with flower-covered floats on New Year\'s Day', 'A cooking competition', 'A music festival'],
                correctIndex: 1,
                explanation: 'The Tournament of Roses features a spectacular parade with floats completely covered in flowers, held every New Year\'s Day in Pasadena!'
            },
            {
                question: 'What is the Rose Bowl?',
                options: ['A flower shop', 'A famous football stadium', 'A bowling alley', 'A restaurant'],
                correctIndex: 1,
                explanation: 'The Rose Bowl is one of the most famous football stadiums in America, hosting the Rose Bowl Game, Super Bowls, and more!'
            },
            {
                question: 'What is special about the San Fernando Valley?',
                options: ['It\'s an island', 'Many movie studios are located there', 'It\'s always cold', 'It has no people'],
                correctIndex: 1,
                explanation: 'The San Fernando Valley is home to major studios like Warner Bros., Disney, Universal, and NBC!'
            },
            {
                question: 'How many neighborhoods does Los Angeles have?',
                options: ['About 10', 'About 25', 'About 50', 'Over 100'],
                correctIndex: 3,
                explanation: 'LA has over 100 different neighborhoods, each with its own unique character and attractions!'
            },
            {
                question: 'What do Rose Parade floats have to be covered with?',
                options: ['Plastic', 'Metal', 'Flowers and natural materials', 'Paint'],
                correctIndex: 2,
                explanation: 'Rose Parade floats must be completely covered in flowers, seeds, bark, or other natural materials - no artificial materials allowed!'
            }
        ]
    }
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SESSIONS_DATA;
}

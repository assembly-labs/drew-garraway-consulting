// 97 Sports Quotes Categorized by Emotions
// Emotions: sad, mad, happy, confused, lonely, tired, bored

const quotes = [
    // AMERICAN FOOTBALL
    {
        quote: "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack of will.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "Winners aren't always the strongest or smartest. They're the ones who want it the most and never give up.",
        reflection: "What's one thing you really want to get better at? How can you show you really want it today by trying your hardest?",
        emotions: ["tired", "sad", "confused"]
    },
    {
        quote: "Perfection is not attainable, but if we chase perfection we can catch excellence.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "Nobody is perfect, but when you try to be perfect, you become really, really good.",
        reflection: "Think about your homework or practice today. What would it look like if you tried to make it perfect?",
        emotions: ["confused", "sad"]
    },
    {
        quote: "It's not whether you get knocked down, it's whether you get up.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "Everyone falls down or makes mistakes. What matters is that you stand back up and keep going.",
        reflection: "When was the last time something didn't go your way? Did you keep trying or did you give up? What will you do next time?",
        emotions: ["sad", "tired"]
    },
    {
        quote: "The only place success comes before work is in the dictionary.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "You can't be successful without working hard first. Hard work always comes before winning.",
        reflection: "What's something you want to be good at? What hard work can you do today to get closer to that goal?",
        emotions: ["tired", "bored", "confused"]
    },
    {
        quote: "Winning isn't everything, but wanting to win is.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "It's okay if you don't win every time, but you should always want to do your best and try to win.",
        reflection: "Do you always try your hardest, even when things are difficult? How does it feel when you give your best effort?",
        emotions: ["sad", "tired"]
    },
    {
        quote: "The harder you work, the harder it is to surrender.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "When you work really hard at something, it's much harder to quit because you don't want to waste all that effort.",
        reflection: "Think of something you've worked hard on. Was it easier or harder to keep going? Why?",
        emotions: ["tired", "sad"]
    },
    {
        quote: "Individual commitment to a group effort—that is what makes a team work.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "Teams win when every person does their job and helps each other, not just when one person is great.",
        reflection: "How can you help your team today? What's one thing you can do to make your teammates better?",
        emotions: ["lonely", "confused"]
    },
    {
        quote: "Set your goals high, and don't stop till you get there.",
        author: "Bo Jackson",
        title: "Raiders & Royals - Football & Baseball",
        simplified: "Dream big and keep working until you reach your dreams. Don't stop halfway.",
        reflection: "What's a big goal you have? What's one small step you can take today to get closer to it?",
        emotions: ["bored", "confused", "tired"]
    },
    {
        quote: "The principle is competing against yourself. It's about self-improvement, about being better than you were the day before.",
        author: "Steve Young",
        title: "San Francisco 49ers Quarterback - Football",
        simplified: "Don't worry about being better than others. Focus on being better than you were yesterday.",
        reflection: "What's one thing you did better today than you did yesterday? What can you improve tomorrow?",
        emotions: ["confused", "sad", "mad"]
    },
    {
        quote: "If you're not in the parade, you watch the parade. That's life.",
        author: "Mike Ditka",
        title: "Chicago Bears Coach - Football",
        simplified: "You can either be part of something exciting or just watch others do it. It's your choice.",
        reflection: "Do you like to participate and be part of the action, or watch from the sidelines? How does each one feel different?",
        emotions: ["bored", "lonely", "tired"]
    },
    {
        quote: "Success isn't owned. It's leased, and rent is due every day.",
        author: "J.J. Watt",
        title: "Houston Texans Defensive End - Football",
        simplified: "Being successful isn't something you earn once and keep forever. You have to work hard every single day.",
        reflection: "What's something you're good at now? What do you need to do today to stay good at it?",
        emotions: ["tired", "bored"]
    },
    {
        quote: "The road to Easy Street goes through the sewer.",
        author: "John Madden",
        title: "Oakland Raiders Coach - Football",
        simplified: "If you want life to be easy later, you have to do hard, messy work now.",
        reflection: "What's something hard you're doing now that will make things easier for you later?",
        emotions: ["tired", "mad"]
    },
    {
        quote: "You fail all the time, but you aren't a failure until you start blaming someone else.",
        author: "Bum Phillips",
        title: "Houston Oilers Coach - Football",
        simplified: "Everyone makes mistakes. You only become a failure when you blame others instead of taking responsibility.",
        reflection: "When something goes wrong, do you blame others or do you think about what you can do differently next time?",
        emotions: ["sad", "mad"]
    },
    {
        quote: "The mind is the limit. As long as the mind can envision the fact that you can do something, you can do it.",
        author: "Walter Payton",
        title: "Chicago Bears Running Back - Football",
        simplified: "If you can imagine yourself doing something in your mind, then you can actually do it in real life.",
        reflection: "Close your eyes and picture yourself doing something amazing. What do you see? How can you start working toward that?",
        emotions: ["confused", "sad"]
    },
    {
        quote: "I've failed over and over and over again in my life. And that is why I succeed.",
        author: "Jerry Rice",
        title: "San Francisco 49ers Wide Receiver - Football",
        simplified: "Making mistakes and failing is how you learn to succeed. Every failure teaches you something new.",
        reflection: "What's a mistake you made recently? What did you learn from it that will help you do better next time?",
        emotions: ["sad"]
    },
    {
        quote: "Don't complain. Just work harder.",
        author: "Randy Moss",
        title: "Minnesota Vikings Wide Receiver - Football",
        simplified: "Complaining doesn't solve problems. Working harder does.",
        reflection: "When things get tough, do you complain or do you work harder? Which one makes you feel better about yourself?",
        emotions: ["mad", "tired"]
    },
    {
        quote: "I don't believe in team motivation. I believe in getting a team prepared.",
        author: "Tom Landry",
        title: "Dallas Cowboys Coach - Football",
        simplified: "Being excited isn't enough. You need to practice and prepare to be ready when it's time to perform.",
        reflection: "How do you prepare for tests, games, or performances? What can you do to be more prepared tomorrow?",
        emotions: ["confused", "tired"]
    },
    {
        quote: "Champions aren't made in gyms. Champions are made from something they have deep inside them.",
        author: "Muhammad Ali",
        title: "Heavyweight Champion - Boxing",
        simplified: "Being a champion comes from what's inside your heart—your courage, determination, and desire to be great.",
        reflection: "What's inside your heart that makes you special? What makes you want to keep trying when things are hard?",
        emotions: ["sad", "tired", "confused"]
    },
    {
        quote: "Nobody who ever gave his best regretted it.",
        author: "George Halas",
        title: "Chicago Bears Founder & Coach - Football",
        simplified: "You'll never feel bad about trying your hardest, even if you don't win.",
        reflection: "How does it feel when you give something your best effort? Is that feeling worth it even if you don't win?",
        emotions: ["happy", "sad"]
    },
    {
        quote: "Leadership is a matter of having people look at you and gain confidence.",
        author: "Tom Landry",
        title: "Dallas Cowboys Coach - Football",
        simplified: "A good leader makes other people feel brave and confident just by watching them.",
        reflection: "How can you act today so that others feel more confident when they're around you?",
        emotions: ["lonely", "confused"]
    },
    {
        quote: "The will to win is important, but the will to prepare is vital.",
        author: "Joe Paterno",
        title: "Penn State Coach - Football",
        simplified: "Wanting to win is good, but being willing to practice and prepare is even more important.",
        reflection: "Do you spend more time wishing you were good at something, or actually practicing it? What can you practice today?",
        emotions: ["tired", "bored", "confused"]
    },
    {
        quote: "Football doesn't build character. It eliminates the weak ones.",
        author: "Darrell Royal",
        title: "Texas Longhorns Coach - Football",
        simplified: "Hard challenges don't make you tough—they show who was already tough inside.",
        reflection: "When something is really hard, do you quit or do you find the toughness inside you to keep going?",
        emotions: ["sad", "tired"]
    },
    {
        quote: "Today I will do what others won't, so tomorrow I can accomplish what others can't.",
        author: "Jerry Rice",
        title: "San Francisco 49ers Wide Receiver - Football",
        simplified: "If you do extra work that others don't want to do today, you'll be able to do amazing things they can't do tomorrow.",
        reflection: "What's something extra you can do today that most people won't do? How will that help you in the future?",
        emotions: ["tired", "bored"]
    },
    {
        quote: "Pressure is something you feel when you don't know what you're doing.",
        author: "Peyton Manning",
        title: "Indianapolis Colts Quarterback - Football",
        simplified: "When you're prepared and know what to do, you won't feel as nervous or scared.",
        reflection: "Think of a time you felt really nervous. Would you have felt better if you had prepared more? How can you prepare better?",
        emotions: ["confused", "sad"]
    },
    {
        quote: "The strength of the team is each individual member. The strength of each member is the team.",
        author: "Phil Jackson",
        title: "Chicago Bulls Coach - Basketball",
        simplified: "Good teams need strong individuals, and individuals become stronger when they have a good team.",
        reflection: "How does your team make you better? How do you make your team better?",
        emotions: ["lonely"]
    },
    {
        quote: "Do you know what my favorite part of the game is? The opportunity to play.",
        author: "Mike Singletary",
        title: "Chicago Bears Linebacker - Football",
        simplified: "The best part isn't winning—it's getting the chance to play and compete in the first place.",
        reflection: "Do you appreciate the chance to play, learn, and compete? How can you show more gratitude for these opportunities?",
        emotions: ["happy", "bored"]
    },
    {
        quote: "Without self-discipline, success is impossible, period.",
        author: "Lou Holtz",
        title: "Notre Dame Coach - Football",
        simplified: "If you can't control yourself and make yourself do hard things, you will never be successful.",
        reflection: "What's something you need to make yourself do even when you don't feel like it? Can you do it today?",
        emotions: ["tired", "bored"]
    },
    {
        quote: "The harder the battle, the sweeter the victory.",
        author: "Les Brown",
        title: "Motivational Speaker",
        simplified: "When something is really hard to achieve, it feels even more amazing when you finally do it.",
        reflection: "What's the hardest thing you've ever accomplished? How did it feel when you finally did it?",
        emotions: ["happy", "tired"]
    },
    {
        quote: "You were born to be a player. You were meant to be here. This moment is yours.",
        author: "Herb Brooks",
        title: "USA Olympic Hockey Coach - Hockey",
        simplified: "You belong here. You have a special purpose. Right now is your time to shine.",
        reflection: "Do you believe you belong and that you're meant to do great things? How does believing in yourself change how you act?",
        emotions: ["sad", "confused", "lonely"]
    },
    {
        quote: "The only discipline that lasts is self-discipline.",
        author: "Bum Phillips",
        title: "Houston Oilers Coach - Football",
        simplified: "Real discipline comes from inside you, not from someone else telling you what to do.",
        reflection: "Can you make yourself do the right thing even when no one is watching? What does that say about your character?",
        emotions: ["tired", "confused"]
    },
    {
        quote: "Excellence is the gradual result of always striving to do better.",
        author: "Pat Riley",
        title: "Los Angeles Lakers Coach - Basketball",
        simplified: "Being excellent doesn't happen overnight. It comes from trying to improve a little bit every single day.",
        reflection: "What's one small way you can be better today than you were yesterday?",
        emotions: ["tired", "confused"]
    },
    {
        quote: "If you want to win, do the ordinary things better than anyone else does them day in and day out.",
        author: "Chuck Noll",
        title: "Pittsburgh Steelers Coach - Football",
        simplified: "Winners don't do special tricks. They just do the basic things better than everyone else, every single day.",
        reflection: "What are the basic things you need to do every day? Are you doing them as well as you possibly can?",
        emotions: ["bored", "tired"]
    },
    {
        quote: "Don't let what you cannot do interfere with what you can do.",
        author: "John Wooden",
        title: "UCLA Bruins Coach - Basketball",
        simplified: "Don't worry about what you're not good at. Focus on what you CAN do and do it well.",
        reflection: "What are you really good at? Are you spending more time worrying about your weaknesses or building your strengths?",
        emotions: ["sad", "confused"]
    },
    {
        quote: "Ability is what you're capable of doing. Motivation determines what you do. Attitude determines how well you do it.",
        author: "Lou Holtz",
        title: "Notre Dame Coach - Football",
        simplified: "Talent shows what you can do. Your desire shows what you will do. Your attitude shows how good you'll be at it.",
        reflection: "Do you have a good attitude when you practice or compete? How does your attitude affect how well you do?",
        emotions: ["mad", "tired", "confused"]
    },
    {
        quote: "The only way to overcome is to hang in.",
        author: "Dan O'Brien",
        title: "Olympic Decathlete - Track & Field",
        simplified: "The only way to beat something hard is to refuse to quit and keep going.",
        reflection: "What's something hard you're facing right now? How can you 'hang in' and keep trying?",
        emotions: ["tired", "sad"]
    },
    {
        quote: "Great moments are born from great opportunities.",
        author: "Herb Brooks",
        title: "USA Olympic Hockey Coach - Hockey",
        simplified: "Amazing things happen when you take advantage of your chances and give your best effort.",
        reflection: "What opportunities do you have today to do something great? Will you take them or let them pass by?",
        emotions: ["bored", "confused"]
    },
    {
        quote: "I've learned that something constructive comes from every defeat.",
        author: "Tom Landry",
        title: "Dallas Cowboys Coach - Football",
        simplified: "Every time you lose or fail, you can learn something valuable that helps you in the future.",
        reflection: "What did you learn the last time you failed or lost? How can you use that lesson to do better next time?",
        emotions: ["sad"]
    },
    {
        quote: "Most people give up just when they're about to achieve success. They quit on the one yard line.",
        author: "Ross Perot",
        title: "Businessman & Leader",
        simplified: "Many people stop trying right before they're about to succeed. Don't quit when you're almost there!",
        reflection: "When things get really hard, are you close to giving up or close to succeeding? How can you tell the difference?",
        emotions: ["tired", "sad"]
    },
    {
        quote: "The price of success is hard work, dedication to the job, and determination that whether we win or lose, we have applied the best of ourselves.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "Success costs something—it requires hard work and giving your absolute best, no matter what the outcome is.",
        reflection: "Are you willing to pay the price of success by working hard and staying dedicated? What will you do today to pay that price?",
        emotions: ["tired", "confused"]
    },
    {
        quote: "Football is like life—it requires perseverance, self-denial, hard work, sacrifice, dedication, and respect for authority.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "Sports and life both need you to keep trying, work hard, make sacrifices, and respect others.",
        reflection: "Which of these qualities (perseverance, hard work, sacrifice, dedication, respect) do you need to work on most? How can you practice it today?",
        emotions: ["tired", "confused", "mad"]
    },
    {
        quote: "Winners never quit and quitters never win.",
        author: "Vince Lombardi",
        title: "Green Bay Packers Coach - Football",
        simplified: "People who succeed never give up. People who give up never succeed.",
        reflection: "Are you a winner who keeps going, or someone who quits when things get hard? What will you choose to be today?",
        emotions: ["sad", "tired"]
    },
    {
        quote: "The difference between the impossible and the possible lies in a person's determination.",
        author: "Tommy Lasorda",
        title: "Los Angeles Dodgers Manager - Baseball",
        simplified: "Whether something is impossible or possible depends on how determined you are to do it.",
        reflection: "What seems impossible to you right now? How determined are you to make it possible?",
        emotions: ["sad", "confused"]
    },
    {
        quote: "Good is not good when better is expected.",
        author: "Vin Scully",
        title: "Los Angeles Dodgers Broadcaster - Baseball",
        simplified: "Doing something well isn't enough if you know you can do it even better.",
        reflection: "Are you doing just enough to get by, or are you pushing yourself to be the best you can be?",
        emotions: ["bored", "tired"]
    },
    {
        quote: "Luck is what happens when preparation meets opportunity.",
        author: "Darrell Royal",
        title: "Texas Longhorns Coach - Football",
        simplified: "People call it luck, but it's really what happens when you're prepared and ready when a chance comes along.",
        reflection: "How can you prepare yourself today so that when an opportunity comes, you'll be ready to take it?",
        emotions: ["confused"]
    },
    {
        quote: "It's not the will to win that matters—everyone has that. It's the will to prepare to win that matters.",
        author: "Paul 'Bear' Bryant",
        title: "Alabama Crimson Tide Coach - Football",
        simplified: "Everyone wants to win, but only winners are willing to do all the boring, hard preparation work.",
        reflection: "Do you just want to win, or are you willing to do all the practice and preparation it takes to win?",
        emotions: ["tired", "bored"]
    },
    {
        quote: "A champion is someone who gets up when they can't.",
        author: "Jack Dempsey",
        title: "Heavyweight Champion - Boxing",
        simplified: "True champions find a way to keep going even when they feel like they have nothing left to give.",
        reflection: "When you feel completely tired or discouraged, where do you find the strength to keep going?",
        emotions: ["tired", "sad"]
    },
    {
        quote: "The only way to prove that you're a good sport is to lose.",
        author: "Ernie Banks",
        title: "Chicago Cubs - Baseball",
        simplified: "Anyone can be happy when they win. Being a good sport when you lose shows your true character.",
        reflection: "How do you act when you lose? Do you make excuses or do you congratulate the winner and try to learn?",
        emotions: ["sad", "mad"]
    },
    {
        quote: "The greatest gap in sports is between the winner and the loser.",
        author: "Bobby Knight",
        title: "Indiana Hoosiers Coach - Basketball",
        simplified: "The biggest difference between winning and losing is usually very small—just a little more effort or focus.",
        reflection: "What's one small thing you can do better that might make a big difference in your success?",
        emotions: ["sad", "confused"]
    },
    {
        quote: "A winner is someone who recognizes his God-given talents, works his tail off to develop them, and uses them to accomplish his goals.",
        author: "Larry Bird",
        title: "Boston Celtics - Basketball",
        simplified: "Winners know what they're good at, practice it a lot, and use it to achieve their dreams.",
        reflection: "What are you naturally good at? How hard are you working to get even better at it?",
        emotions: ["confused", "bored"]
    },

    // MARTIAL ARTS & JIU-JITSU
    {
        quote: "A black belt is a white belt who never gave up.",
        author: "Carlos Gracie Jr.",
        title: "Brazilian Jiu-Jitsu Master",
        simplified: "A master is just a beginner who never quit, no matter how hard it got.",
        reflection: "When you start something new and it's hard, do you want to quit or do you want to keep going until you're a master?",
        emotions: ["tired", "sad"]
    },
    {
        quote: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
        author: "Bruce Lee",
        title: "Martial Arts Legend & Actor",
        simplified: "Someone who practices one thing over and over is better than someone who tries everything once.",
        reflection: "Are you trying to do too many things, or are you focusing on getting really good at a few important things?",
        emotions: ["confused", "bored"]
    },
    {
        quote: "A brave man, a real fighter is not measured by how many times he falls, but by how many times he stands up.",
        author: "Rickson Gracie",
        title: "Brazilian Jiu-Jitsu Legend",
        simplified: "True courage isn't never falling down. It's getting back up every time you do fall.",
        reflection: "When you fall or fail, how quickly do you get back up? What helps you find the courage to try again?",
        emotions: ["sad", "tired"]
    },
    {
        quote: "The ultimate aim of martial arts is not having to use them.",
        author: "Miyamoto Musashi",
        title: "Legendary Samurai",
        simplified: "The real goal of learning to be strong is to be so confident that you don't need to prove it.",
        reflection: "How can being strong and prepared help you avoid problems instead of creating them?",
        emotions: ["mad", "confused"]
    },
    {
        quote: "In the beginner's mind there are many possibilities, but in the expert's mind there are few.",
        author: "Shunryu Suzuki",
        title: "Zen Master",
        simplified: "When you're learning something new, you're open to many ideas. Don't lose that openness as you get better.",
        reflection: "When you think you know everything, do you stop learning? How can you keep your mind open to new ideas?",
        emotions: ["confused", "bored"]
    },
    {
        quote: "Fall down seven times, stand up eight.",
        author: "Japanese Proverb",
        title: "Ancient Wisdom",
        simplified: "No matter how many times you fail, always get up one more time than you fall down.",
        reflection: "What does it mean to stand up one more time than you fall? Can you do that today with something you're struggling with?",
        emotions: ["sad", "tired"]
    },
    {
        quote: "Water is fluid, soft, and yielding. But water will wear away rock, which is rigid and cannot yield.",
        author: "Bruce Lee",
        title: "Martial Arts Legend & Actor",
        simplified: "Being flexible and adaptable is sometimes stronger than being hard and stubborn.",
        reflection: "When things don't go your way, do you stay stubborn or do you adapt? Which way works better?",
        emotions: ["mad", "confused"]
    },
    {
        quote: "The fight is won or lost far away from witnesses—behind the lines, in the gym, and out there on the road, long before I dance under those lights.",
        author: "Muhammad Ali",
        title: "Heavyweight Champion - Boxing",
        simplified: "Winners are made during practice when nobody is watching, not during the competition when everyone is watching.",
        reflection: "How hard do you work when no one is watching? Does your effort in private match your effort in public?",
        emotions: ["tired", "bored"]
    },
    {
        quote: "It's not the size of the dog in the fight, it's the size of the fight in the dog.",
        author: "Mark Twain",
        title: "Author & Humorist",
        simplified: "Being big and strong doesn't matter as much as having courage and never giving up.",
        reflection: "Do you let being smaller or younger stop you from trying? How can you show that you have a big heart instead?",
        emotions: ["sad", "lonely"]
    },
    {
        quote: "The more you know yourself, the more patience you have for what you see in others.",
        author: "Erik Erikson",
        title: "Psychologist",
        simplified: "When you understand yourself and your own struggles, you become more patient and kind with other people.",
        reflection: "Do you get frustrated with others easily? How can understanding your own challenges help you be more patient with them?",
        emotions: ["mad", "lonely"]
    },
    {
        quote: "The ultimate victory in competition is derived from the inner satisfaction of knowing that you have done your best.",
        author: "Howard Cosell",
        title: "Sports Broadcaster",
        simplified: "The real win isn't the trophy—it's knowing in your heart that you gave everything you had.",
        reflection: "How does it feel when you know you truly did your best? Is that feeling better than any trophy?",
        emotions: ["happy", "sad"]
    },
    {
        quote: "Position before submission.",
        author: "Brazilian Jiu-Jitsu Principle",
        title: "Martial Arts Strategy",
        simplified: "Get yourself in the right position first, then you can finish strong. Don't rush to the end.",
        reflection: "Do you try to skip steps and rush to the finish? How can taking your time and doing things in order help you succeed?",
        emotions: ["confused", "mad"]
    },
    {
        quote: "Jiu-jitsu puts you completely in the moment, where you must have a complete focus on finding a solution to the problem.",
        author: "Rickson Gracie",
        title: "Brazilian Jiu-Jitsu Legend",
        simplified: "When you're facing a challenge, focus completely on solving it right now, not on anything else.",
        reflection: "When you have a problem, do you focus on solving it, or do you let your mind wander? How can better focus help you?",
        emotions: ["confused"]
    },
    {
        quote: "The best fighter is never angry.",
        author: "Lao Tzu",
        title: "Ancient Philosopher",
        simplified: "Getting angry makes you sloppy and weak. Staying calm makes you strong and smart.",
        reflection: "When you get angry, does it help you or hurt you? How can staying calm help you think better and do better?",
        emotions: ["mad"]
    },
    {
        quote: "Discipline is doing what you hate to do but doing it like you love it.",
        author: "Mike Tyson",
        title: "Heavyweight Champion - Boxing",
        simplified: "Real discipline is doing hard things you don't want to do, but doing them with a good attitude anyway.",
        reflection: "What's something you need to do but don't want to? Can you do it today with a positive attitude?",
        emotions: ["tired", "bored", "mad"]
    },
    {
        quote: "Karate is not about winning over others. It is about winning over yourself.",
        author: "Gichin Funakoshi",
        title: "Father of Modern Karate",
        simplified: "The real competition is against yourself—can you be better than you were yesterday?",
        reflection: "Are you more focused on beating other people, or on improving yourself? Which one will make you better in the long run?",
        emotions: ["mad", "confused"]
    },
    {
        quote: "There is no finish line. When you reach one goal, find a new one.",
        author: "Chuck Norris",
        title: "Martial Arts Champion & Actor",
        simplified: "Success isn't a place where you stop. When you achieve something, find a new goal and keep growing.",
        reflection: "When you accomplish something, do you celebrate and then find a new challenge, or do you just stop trying?",
        emotions: ["bored", "happy"]
    },
    {
        quote: "The more difficult the victory, the greater the happiness in winning.",
        author: "Pelé",
        title: "Brazilian National Team - Soccer",
        simplified: "Beating an easy opponent doesn't feel as good as beating a really tough one.",
        reflection: "Do you look for easy wins or do you challenge yourself against tough competition? Which one makes you feel more proud?",
        emotions: ["bored", "happy"]
    },

    // SOCCER/FOOTBALL
    {
        quote: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice, and most of all, love of what you are doing.",
        author: "Pelé",
        title: "Brazilian National Team - Soccer",
        simplified: "Being successful doesn't just happen by chance. It takes hard work, never giving up, learning, and loving what you do.",
        reflection: "Do you love what you're working on? How does loving it make the hard work feel different?",
        emotions: ["happy", "tired"]
    },
    {
        quote: "The more difficult the victory, the greater the happiness in winning.",
        author: "Pelé",
        title: "Brazilian National Team - Soccer",
        simplified: "When you beat something really hard, the feeling of winning is so much better.",
        reflection: "Would you rather have an easy win or work really hard for a difficult win? Why?",
        emotions: ["happy", "tired"]
    },
    {
        quote: "I am constantly being asked about individuals. The only way to win is as a team.",
        author: "Pelé",
        title: "Brazilian National Team - Soccer",
        simplified: "People always talk about star players, but you can only win when everyone works together as a team.",
        reflection: "Are you trying to be the star, or are you trying to help your whole team succeed? Which is more important?",
        emotions: ["lonely"]
    },
    {
        quote: "Your love makes you strong. Your hate makes you weak.",
        author: "Cristiano Ronaldo",
        title: "Real Madrid & Portugal - Soccer",
        simplified: "Loving what you do and who you play with gives you strength. Hating things makes you weaker.",
        reflection: "Do you focus on what you love about your sport/activity, or what you hate? How does that focus change your performance?",
        emotions: ["mad", "happy"]
    },
    {
        quote: "Talent without working hard is nothing.",
        author: "Cristiano Ronaldo",
        title: "Real Madrid & Portugal - Soccer",
        simplified: "Being naturally talented doesn't matter if you don't work hard to develop that talent.",
        reflection: "Are you relying on your natural ability, or are you working hard to get even better? What would happen if you did both?",
        emotions: ["bored", "tired"]
    },
    {
        quote: "I don't have time for hobbies. At the end of the day, I treat my job as a hobby. It's something I love doing.",
        author: "David Beckham",
        title: "Manchester United & England - Soccer",
        simplified: "When you love what you do so much that it feels like fun, you don't need other hobbies.",
        reflection: "What do you love so much that it doesn't feel like work? How can you bring that same love to other things you do?",
        emotions: ["happy", "bored"]
    },
    {
        quote: "You have to fight to reach your dream. You have to sacrifice and work hard for it.",
        author: "Lionel Messi",
        title: "Barcelona & Argentina - Soccer",
        simplified: "Your dreams won't just come to you. You have to work hard and give up some things to make them happen.",
        reflection: "What dream do you have? What are you willing to sacrifice or work hard for to make that dream come true?",
        emotions: ["tired", "confused"]
    },
    {
        quote: "There are more important things in life than winning or losing a game.",
        author: "Lionel Messi",
        title: "Barcelona & Argentina - Soccer",
        simplified: "Sports are important, but things like family, friendship, and being a good person matter more.",
        reflection: "What matters more to you than winning? How do you show that through your actions?",
        emotions: ["sad", "happy"]
    },
    {
        quote: "The backbone of success is hard work, determination, good planning, and perseverance.",
        author: "Mia Hamm",
        title: "USA Women's National Team - Soccer",
        simplified: "If you want to succeed, you need to work hard, never quit, make good plans, and keep going when things are tough.",
        reflection: "Which of these four things (hard work, determination, planning, perseverance) do you need to work on most?",
        emotions: ["tired", "confused"]
    },
    {
        quote: "I am building a fire, and every day I train, I add more fuel. At just the right moment, I light the match.",
        author: "Mia Hamm",
        title: "USA Women's National Team - Soccer",
        simplified: "Every day you practice, you're getting ready for your big moment. When it comes, you'll be ready to shine.",
        reflection: "How is your daily practice preparing you for your big moment? What fuel are you adding to your fire today?",
        emotions: ["tired", "bored"]
    },

    // AMERICAN SPORTS - Baseball, Basketball, Hockey
    {
        quote: "It ain't over 'til it's over.",
        author: "Yogi Berra",
        title: "New York Yankees - Baseball",
        simplified: "Never give up until the game is completely finished, because anything can happen.",
        reflection: "Have you ever given up too early? What would happen if you always played hard until the very end?",
        emotions: ["tired", "sad"]
    },
    {
        quote: "You can't steal second base and keep one foot on first.",
        author: "Frederick Wilcox",
        title: "Author",
        simplified: "If you want to move forward and take chances, you can't play it safe. You have to take risks.",
        reflection: "What's something you want to try but you're too scared? What would happen if you took the risk?",
        emotions: ["confused", "sad"]
    },
    {
        quote: "Baseball is 90% mental. The other half is physical.",
        author: "Yogi Berra",
        title: "New York Yankees - Baseball",
        simplified: "Sports are as much about thinking smart and staying mentally tough as they are about physical skills.",
        reflection: "Do you work as hard on your mental toughness and thinking as you do on your physical skills? How can you improve your mind?",
        emotions: ["confused"]
    },
    {
        quote: "You miss 100% of the shots you don't take.",
        author: "Wayne Gretzky",
        title: "Edmonton Oilers - Hockey",
        simplified: "If you don't even try, you'll definitely fail. You have to take chances to succeed.",
        reflection: "What chances are you not taking because you're afraid to fail? What could you achieve if you just tried?",
        emotions: ["sad", "confused"]
    },
    {
        quote: "Hard work beats talent when talent doesn't work hard.",
        author: "Tim Notke",
        title: "Basketball Coach",
        simplified: "Someone who works really hard can beat someone with more natural talent if that talented person is lazy.",
        reflection: "Are you working as hard as you can, or are you relying on natural ability? What happens when you face someone who's talented AND works hard?",
        emotions: ["tired", "bored"]
    },
    {
        quote: "The only way to prove you are a good sport is to lose.",
        author: "Ernie Banks",
        title: "Chicago Cubs - Baseball",
        simplified: "Anyone can be happy when they win. Being positive and respectful when you lose shows your true character.",
        reflection: "How do you act when you lose? Do you make excuses, or do you shake hands and learn from it?",
        emotions: ["sad", "mad"]
    },
    {
        quote: "Champions keep playing until they get it right.",
        author: "Billie Jean King",
        title: "Tennis Champion",
        simplified: "Winners don't stop when they fail. They keep practicing until they succeed.",
        reflection: "When you don't get something right, do you quit or do you keep trying? What would a champion do?",
        emotions: ["tired", "sad"]
    },
    {
        quote: "I've missed more than 9,000 shots in my career. I've lost almost 300 games. I've failed over and over. And that is why I succeed.",
        author: "Michael Jordan",
        title: "Chicago Bulls - Basketball",
        simplified: "The most successful people fail more than anyone else because they keep trying. Failure is part of success.",
        reflection: "Are you afraid of failing? How can you see failure as a good thing that helps you learn?",
        emotions: ["sad"]
    },
    {
        quote: "You can't get much done in life if you only work on the days when you feel good.",
        author: "Jerry West",
        title: "Los Angeles Lakers - Basketball",
        simplified: "You have to work hard even on days when you don't feel like it, not just when you're in a good mood.",
        reflection: "Do you only try hard when you feel like it? What would happen if you gave your best effort even on bad days?",
        emotions: ["tired"]
    },
    {
        quote: "I never looked at the consequences of missing a big shot. Why? Because when you think about the consequences you always think of a negative result.",
        author: "Michael Jordan",
        title: "Chicago Bulls - Basketball",
        simplified: "Don't think about what will happen if you fail. Focus on what you need to do to succeed.",
        reflection: "When you're about to do something hard, do you think about failing or succeeding? How does that thought change your performance?",
        emotions: ["confused", "sad"]
    },

    // OTHER SPORTS
    {
        quote: "You have to believe in yourself when no one else does. That's what makes you a winner.",
        author: "Serena Williams",
        title: "Tennis Champion",
        simplified: "Even when everyone doubts you, you need to believe in yourself. That belief is what makes champions.",
        reflection: "Do you believe in yourself even when others don't? Where does that belief come from?",
        emotions: ["sad", "lonely"]
    },
    {
        quote: "I really think a champion is defined not by their wins but by how they can recover when they fall.",
        author: "Serena Williams",
        title: "Tennis Champion",
        simplified: "True champions aren't made by winning all the time. They're made by how they get back up after losing.",
        reflection: "When you lose or fail, how do you respond? Do you get back up quickly or do you stay down?",
        emotions: ["sad", "tired"]
    },
    {
        quote: "The difference between the impossible and the possible lies in a person's determination.",
        author: "Tommy Lasorda",
        title: "Los Angeles Dodgers Manager - Baseball",
        simplified: "What seems impossible can become possible if you're determined enough to make it happen.",
        reflection: "What seems impossible to you right now? How determined are you to make it possible?",
        emotions: ["sad", "confused"]
    },
    {
        quote: "Gold medals aren't really made of gold. They're made of sweat, determination, and a hard-to-find alloy called guts.",
        author: "Dan Gable",
        title: "Olympic Wrestling Champion",
        simplified: "Winning isn't about the prize. It's about all the hard work, courage, and determination it took to get there.",
        reflection: "What are you working toward? Is the journey of working hard as important to you as the final goal?",
        emotions: ["tired", "happy"]
    },
    {
        quote: "The five S's of sports training are: stamina, speed, strength, skill, and spirit; but the greatest of these is spirit.",
        author: "Ken Doherty",
        title: "Olympic Decathlete - Track & Field",
        simplified: "Physical skills are important, but having heart and spirit is the most important thing of all.",
        reflection: "Do you have spirit and heart when you compete? How does your spirit help you when your body gets tired?",
        emotions: ["tired", "happy"]
    },
    {
        quote: "It's not the will to win that matters—everyone has that. It's the will to prepare to win that matters.",
        author: "Paul 'Bear' Bryant",
        title: "Alabama Crimson Tide Coach - Football",
        simplified: "Everyone wants to win, but only winners are willing to do all the hard work and preparation it takes.",
        reflection: "Do you want to win, or are you willing to do the boring, hard preparation work that winning requires?",
        emotions: ["tired", "bored"]
    },
    {
        quote: "Somewhere behind the athlete you've become, the hours of practice, and the coaches who pushed you, is a little kid who fell in love with the game and never looked back. Play for them.",
        author: "Mia Hamm",
        title: "USA Women's National Team - Soccer",
        simplified: "Remember when you first started and loved playing just for fun? Keep that love alive even as you get better.",
        reflection: "Why did you start playing your sport or doing your activity? Do you still have that same love for it?",
        emotions: ["happy", "bored"]
    },
    {
        quote: "Never give up, never give in, and when the upper hand is ours, may we have the ability to handle the win with the dignity that we absorbed the loss.",
        author: "Doug Williams",
        title: "Washington Redskins Quarterback - Football",
        simplified: "Never quit, and when you do win, be humble and respectful just like you were when you lost.",
        reflection: "When you win, do you brag or do you stay humble? How can you be a gracious winner?",
        emotions: ["happy", "sad"]
    },
    {
        quote: "What makes something special is not just what you have to gain, but what you feel there is to lose.",
        author: "Andre Agassi",
        title: "Tennis Champion",
        simplified: "Something becomes really important when you realize how much it means to you and how bad it would feel to lose it.",
        reflection: "What do you have that you would hate to lose? How does that feeling make you work harder to keep it?",
        emotions: ["sad", "happy"]
    },
    {
        quote: "The road to success is not easy to navigate, but with hard work, drive, and passion, it's possible to achieve your dreams.",
        author: "Tommy Hilfiger",
        title: "Designer & Entrepreneur",
        simplified: "Success isn't easy, but if you work hard, stay motivated, and love what you do, you can achieve your dreams.",
        reflection: "What's your dream? Do you have the hard work, drive, and passion you need to make it real?",
        emotions: ["tired", "happy", "confused"]
    }
];

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = quotes;
}

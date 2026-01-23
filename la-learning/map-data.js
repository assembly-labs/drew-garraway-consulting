/**
 * DISCOVER LA - Interactive Map Data
 * Location data for all sessions with coordinates, icons, and metadata
 *
 * Each location includes:
 * - id: unique identifier
 * - name: display name
 * - coords: [latitude, longitude]
 * - session: which session unlocks this location (0-9)
 * - category: for grouping and icon selection
 * - icon: emoji icon
 * - description: short description for popup
 * - image: optional image URL
 */

const MAP_LOCATIONS = [
    // ========================================
    // SESSION 1: Welcome to California
    // ========================================
    {
        id: 'sacramento',
        name: 'Sacramento',
        coords: [38.5816, -121.4944],
        session: 0,
        category: 'city',
        icon: '🏛️',
        description: 'California\'s capital city where the state government works.',
        image: 'https://images.unsplash.com/photo-1583471670868-ecb7fee6aeea?w=600&q=80',
        zoom: 10
    },
    {
        id: 'san-francisco',
        name: 'San Francisco',
        coords: [37.7749, -122.4194],
        session: 0,
        category: 'city',
        icon: '🌉',
        description: 'Famous for the Golden Gate Bridge, cable cars, and beautiful bay.',
        image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80',
        zoom: 11
    },
    {
        id: 'san-diego',
        name: 'San Diego',
        coords: [32.7157, -117.1611],
        session: 0,
        category: 'city',
        icon: '🦭',
        description: 'Beautiful beaches and a world-famous zoo near the Mexican border.',
        image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80',
        zoom: 10
    },
    {
        id: 'death-valley',
        name: 'Death Valley',
        coords: [36.5054, -117.0794],
        session: 0,
        category: 'nature',
        icon: '🏜️',
        description: 'The hottest and lowest place in North America! Once hit 134°F.',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80',
        zoom: 9
    },
    {
        id: 'redwood-forest',
        name: 'Redwood National Park',
        coords: [41.2132, -124.0046],
        session: 0,
        category: 'nature',
        icon: '🌲',
        description: 'Home to the tallest trees on Earth - California\'s state tree!',
        image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=80',
        zoom: 9
    },

    // ========================================
    // SESSION 2: Los Angeles - City of Angels
    // ========================================
    {
        id: 'downtown-la',
        name: 'Downtown Los Angeles',
        coords: [34.0407, -118.2468],
        session: 1,
        category: 'neighborhood',
        icon: '🏙️',
        description: 'The heart of LA with skyscrapers, museums, and over 4 million people!',
        image: 'https://images.pexels.com/photos/29276388/pexels-photo-29276388.jpeg?w=600&q=80',
        zoom: 13
    },
    {
        id: 'hollywood-sign',
        name: 'Hollywood Sign',
        coords: [34.1341, -118.3215],
        session: 1,
        category: 'landmark',
        icon: '🎬',
        description: 'The iconic 45-foot tall letters overlooking Los Angeles since 1923.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Hollywood_Sign_%28Zuschnitt%29.jpg/400px-Hollywood_Sign_%28Zuschnitt%29.jpg',
        zoom: 14
    },
    {
        id: 'griffith-observatory',
        name: 'Griffith Observatory',
        coords: [34.1184, -118.3004],
        session: 1,
        category: 'landmark',
        icon: '🔭',
        description: 'Free observatory with telescopes, planetarium, and stunning LA views!',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Griffith_Observatory_entrance_lawn_with_Hollywood_sign.jpg/400px-Griffith_Observatory_entrance_lawn_with_Hollywood_sign.jpg',
        zoom: 15
    },
    {
        id: 'la-city-hall',
        name: 'Los Angeles City Hall',
        coords: [34.0537, -118.2427],
        session: 1,
        category: 'landmark',
        icon: '🏛️',
        description: 'Historic 1928 building that appeared in Superman and many movies!',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Los_Angeles_City_Hall_%28color%29_edit1.jpg/400px-Los_Angeles_City_Hall_%28color%29_edit1.jpg',
        zoom: 16
    },

    // ========================================
    // SESSION 3: LA Sports Teams
    // ========================================
    {
        id: 'crypto-arena',
        name: 'Crypto.com Arena',
        coords: [34.0430, -118.2673],
        session: 2,
        category: 'sports',
        icon: '🏀',
        description: 'Home of the Lakers, Clippers, and Kings! Formerly called Staples Center.',
        image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?w=600&q=80',
        zoom: 16
    },
    {
        id: 'dodger-stadium',
        name: 'Dodger Stadium',
        coords: [34.0739, -118.2400],
        session: 2,
        category: 'sports',
        icon: '⚾',
        description: 'The largest baseball stadium in the world! Go Dodgers!',
        image: 'https://images.pexels.com/photos/269948/pexels-photo-269948.jpeg?w=600&q=80',
        zoom: 15
    },
    {
        id: 'sofi-stadium',
        name: 'SoFi Stadium',
        coords: [33.9535, -118.3392],
        session: 2,
        category: 'sports',
        icon: '🏈',
        description: 'The most expensive stadium ever built ($5 billion)! Home of the Rams and Chargers.',
        image: 'https://images.pexels.com/photos/270071/pexels-photo-270071.jpeg?w=600&q=80',
        zoom: 15
    },
    {
        id: 'dignity-health',
        name: 'Dignity Health Sports Park',
        coords: [33.8644, -118.2611],
        session: 2,
        category: 'sports',
        icon: '⚽',
        description: 'Home of the LA Galaxy soccer team - 5-time MLS Cup champions!',
        image: 'https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg?w=600&q=80',
        zoom: 15
    },

    // ========================================
    // SESSION 4: LA Food & Flavors
    // ========================================
    {
        id: 'koreatown',
        name: 'Koreatown',
        coords: [34.0578, -118.3009],
        session: 3,
        category: 'food',
        icon: '🍖',
        description: 'Amazing Korean BBQ where you grill meat right at your table!',
        image: 'https://images.pexels.com/photos/5774145/pexels-photo-5774145.jpeg?w=600&q=80',
        zoom: 14
    },
    {
        id: 'grand-central-market',
        name: 'Grand Central Market',
        coords: [34.0508, -118.2494],
        session: 3,
        category: 'food',
        icon: '🥘',
        description: 'Historic food hall since 1917 with dozens of amazing food stalls!',
        image: 'https://images.pexels.com/photos/15426317/pexels-photo-15426317.jpeg?w=600&q=80',
        zoom: 17
    },
    {
        id: 'thai-town',
        name: 'Thai Town',
        coords: [34.1016, -118.3044],
        session: 3,
        category: 'food',
        icon: '🍜',
        description: 'Authentic Thai restaurants on Hollywood Boulevard!',
        image: 'https://images.pexels.com/photos/11176614/pexels-photo-11176614.jpeg?w=600&q=80',
        zoom: 15
    },
    {
        id: 'original-in-n-out',
        name: 'In-N-Out (First Location)',
        coords: [34.1365, -117.9067],
        session: 3,
        category: 'food',
        icon: '🍔',
        description: 'The first In-N-Out opened in Baldwin Park in 1948!',
        image: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?w=600&q=80',
        zoom: 16
    },

    // ========================================
    // SESSION 5: Entertainment Capital
    // ========================================
    {
        id: 'universal-studios',
        name: 'Universal Studios Hollywood',
        coords: [34.1381, -118.3534],
        session: 4,
        category: 'entertainment',
        icon: '🎢',
        description: 'Theme park AND real movie studio! Ride Harry Potter and Jurassic World!',
        image: 'https://images.unsplash.com/photo-1581351123004-757df051db8e?w=600&q=80',
        zoom: 15
    },
    {
        id: 'disneyland',
        name: 'Disneyland Resort',
        coords: [33.8121, -117.9190],
        session: 4,
        category: 'entertainment',
        icon: '🏰',
        description: 'The Happiest Place on Earth! Opened by Walt Disney in 1955.',
        image: 'https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=600&q=80',
        zoom: 15
    },
    {
        id: 'warner-bros',
        name: 'Warner Bros. Studios',
        coords: [34.1496, -118.3385],
        session: 4,
        category: 'entertainment',
        icon: '🎥',
        description: 'Where Harry Potter, Batman, and Friends were made!',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80',
        zoom: 15
    },
    {
        id: 'hollywood-bowl',
        name: 'Hollywood Bowl',
        coords: [34.1122, -118.3391],
        session: 4,
        category: 'entertainment',
        icon: '🎵',
        description: 'Famous outdoor concert venue holding 17,500 people since 1922!',
        image: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=600&q=80',
        zoom: 16
    },
    {
        id: 'dolby-theatre',
        name: 'Dolby Theatre',
        coords: [34.1022, -118.3418],
        session: 4,
        category: 'entertainment',
        icon: '🏆',
        description: 'Home of the Academy Awards (Oscars) ceremony!',
        image: 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48?w=600&q=80',
        zoom: 17
    },

    // ========================================
    // SESSION 6: LA's Amazing Beaches
    // ========================================
    {
        id: 'santa-monica-pier',
        name: 'Santa Monica Pier',
        coords: [34.0083, -118.4987],
        session: 5,
        category: 'beach',
        icon: '🎡',
        description: 'Famous pier with Ferris wheel, roller coaster, and end of Route 66!',
        image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80',
        zoom: 16
    },
    {
        id: 'venice-beach',
        name: 'Venice Beach',
        coords: [33.9850, -118.4695],
        session: 5,
        category: 'beach',
        icon: '🛹',
        description: 'Colorful boardwalk, street performers, Muscle Beach, and legendary skate park!',
        image: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=600&q=80',
        zoom: 15
    },
    {
        id: 'venice-canals',
        name: 'Venice Canals',
        coords: [33.9803, -118.4644],
        session: 5,
        category: 'neighborhood',
        icon: '🌴',
        description: 'Real canals built in 1905 to look like Venice, Italy!',
        image: 'https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=600',
        zoom: 16
    },
    {
        id: 'malibu',
        name: 'Malibu Beach',
        coords: [34.0259, -118.7798],
        session: 5,
        category: 'beach',
        icon: '🏄',
        description: '27 miles of beautiful coastline, celebrity homes, and legendary surfing!',
        image: 'https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=600',
        zoom: 12
    },
    {
        id: 'manhattan-beach',
        name: 'Manhattan Beach',
        coords: [33.8847, -118.4109],
        session: 5,
        category: 'beach',
        icon: '🏐',
        description: 'Famous for beach volleyball - hosts professional tournaments!',
        image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&q=80',
        zoom: 14
    },

    // ========================================
    // SESSION 7: Arts, Nature & Neighborhoods
    // ========================================
    {
        id: 'griffith-park',
        name: 'Griffith Park',
        coords: [34.1365, -118.2943],
        session: 6,
        category: 'nature',
        icon: '🥾',
        description: 'Largest urban park in the US - 5x bigger than Central Park!',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
        zoom: 13
    },
    {
        id: 'getty-center',
        name: 'The Getty Center',
        coords: [34.0780, -118.4741],
        session: 6,
        category: 'museum',
        icon: '🎨',
        description: 'FREE museum with Van Gogh, Monet, and stunning hilltop views!',
        image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&q=80',
        zoom: 15
    },
    {
        id: 'lacma',
        name: 'LACMA',
        coords: [34.0639, -118.3592],
        session: 6,
        category: 'museum',
        icon: '💡',
        description: 'Largest art museum in the West! Famous for Urban Light lamps.',
        image: 'https://images.unsplash.com/photo-1494023070108-9d731ed6f0da?w=600&q=80',
        zoom: 16
    },
    {
        id: 'science-center',
        name: 'California Science Center',
        coords: [34.0147, -118.2866],
        session: 6,
        category: 'museum',
        icon: '🚀',
        description: 'FREE museum with the real Space Shuttle Endeavour!',
        image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80',
        zoom: 15
    },
    {
        id: 'silver-lake',
        name: 'Silver Lake',
        coords: [34.0869, -118.2702],
        session: 6,
        category: 'neighborhood',
        icon: '🎨',
        description: 'Hip, artsy neighborhood with street murals and indie coffee shops!',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&q=80',
        zoom: 14
    },

    // ========================================
    // SESSION 8: Downtown LA - Past & Present
    // ========================================
    {
        id: 'olvera-street',
        name: 'Olvera Street',
        coords: [34.0576, -118.2383],
        session: 7,
        category: 'historic',
        icon: '🇲🇽',
        description: 'The birthplace of LA! Mexican marketplace where the city started in 1781.',
        image: 'https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=600&q=80',
        zoom: 17
    },
    {
        id: 'union-station',
        name: 'Union Station',
        coords: [34.0561, -118.2365],
        session: 7,
        category: 'historic',
        icon: '🚂',
        description: 'Beautiful 1939 train station - one of the prettiest in America!',
        image: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=600&q=80',
        zoom: 17
    },
    {
        id: 'disney-concert-hall',
        name: 'Walt Disney Concert Hall',
        coords: [34.0553, -118.2498],
        session: 7,
        category: 'landmark',
        icon: '🎻',
        description: 'Stunning silver building designed by Frank Gehry. Took 16 years to build!',
        image: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad?w=600&q=80',
        zoom: 17
    },
    {
        id: 'arts-district',
        name: 'Arts District',
        coords: [34.0396, -118.2331],
        session: 7,
        category: 'neighborhood',
        icon: '🖼️',
        description: 'Former warehouses now covered in amazing street art murals!',
        image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80',
        zoom: 15
    },
    {
        id: 'us-bank-tower',
        name: 'US Bank Tower',
        coords: [34.0512, -118.2544],
        session: 7,
        category: 'landmark',
        icon: '🏢',
        description: '1,018 feet tall with a glass slide on the outside!',
        image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&q=80',
        zoom: 16
    },

    // ========================================
    // SESSION 9: Hollywood & Beverly Hills
    // ========================================
    {
        id: 'walk-of-fame',
        name: 'Hollywood Walk of Fame',
        coords: [34.1017, -118.3405],
        session: 8,
        category: 'landmark',
        icon: '⭐',
        description: 'Over 2,700 celebrity stars embedded in the sidewalk!',
        image: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=600&q=80',
        zoom: 16
    },
    {
        id: 'chinese-theatre',
        name: 'TCL Chinese Theatre',
        coords: [34.1022, -118.3409],
        session: 8,
        category: 'landmark',
        icon: '🎭',
        description: 'Historic 1927 theater with celebrity hand and footprints in cement!',
        image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=600&q=80',
        zoom: 17
    },
    {
        id: 'sunset-strip',
        name: 'Sunset Strip',
        coords: [34.0909, -118.3859],
        session: 8,
        category: 'neighborhood',
        icon: '🎸',
        description: 'Legendary rock music clubs where The Doors and Guns N\' Roses started!',
        image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&q=80',
        zoom: 15
    },
    {
        id: 'rodeo-drive',
        name: 'Rodeo Drive',
        coords: [34.0674, -118.4003],
        session: 8,
        category: 'neighborhood',
        icon: '💎',
        description: 'The most famous luxury shopping street in America!',
        image: 'https://images.unsplash.com/photo-1597411216673-01c1de06087e?w=600&q=80',
        zoom: 17
    },
    {
        id: 'beverly-hills-sign',
        name: 'Beverly Hills',
        coords: [34.0736, -118.4004],
        session: 8,
        category: 'neighborhood',
        icon: '🌴',
        description: 'Famous wealthy city with celebrity mansions and the iconic 90210 zip code!',
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
        zoom: 14
    },

    // ========================================
    // SESSION 10: More LA Treasures
    // ========================================
    {
        id: 'rose-bowl',
        name: 'Rose Bowl Stadium',
        coords: [34.1613, -118.1676],
        session: 9,
        category: 'sports',
        icon: '🏟️',
        description: 'Legendary stadium hosting the Rose Bowl Game, Super Bowls, and more!',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
        zoom: 15
    },
    {
        id: 'old-town-pasadena',
        name: 'Old Town Pasadena',
        coords: [34.1459, -118.1505],
        session: 9,
        category: 'neighborhood',
        icon: '🛍️',
        description: 'Charming historic district with shops, restaurants, and entertainment!',
        image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?w=600&q=80',
        zoom: 16
    },
    {
        id: 'huntington-library',
        name: 'The Huntington',
        coords: [34.1292, -118.1151],
        session: 9,
        category: 'museum',
        icon: '📚',
        description: 'Art, rare books (including a Gutenberg Bible!), and stunning gardens.',
        image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600',
        zoom: 15
    },
    {
        id: 'san-fernando-valley',
        name: 'San Fernando Valley',
        coords: [34.2011, -118.4755],
        session: 9,
        category: 'neighborhood',
        icon: '🎬',
        description: 'Home to Warner Bros, Disney, Universal, and NBC studios!',
        image: 'https://images.pexels.com/photos/6447217/pexels-photo-6447217.jpeg?auto=compress&cs=tinysrgb&w=600',
        zoom: 11
    },
    {
        id: 'catalina-island',
        name: 'Catalina Island',
        coords: [33.3428, -118.3287],
        session: 9,
        category: 'nature',
        icon: '🏝️',
        description: 'Beautiful island 22 miles off the coast - a perfect day trip!',
        image: 'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=600&q=80',
        zoom: 12
    }
];

// Category styling for map markers
const CATEGORY_STYLES = {
    city: { color: '#0077B6', icon: '🏙️' },
    nature: { color: '#2D6A4F', icon: '🌲' },
    landmark: { color: '#E63946', icon: '📍' },
    neighborhood: { color: '#9B59B6', icon: '🏘️' },
    sports: { color: '#FB8500', icon: '🏟️' },
    food: { color: '#D35400', icon: '🍽️' },
    entertainment: { color: '#FFB703', icon: '🎬' },
    beach: { color: '#00B4D8', icon: '🏖️' },
    museum: { color: '#6C5CE7', icon: '🏛️' },
    historic: { color: '#A0522D', icon: '🏛️' }
};

// Session names for the map legend
const SESSION_NAMES = [
    'Welcome to California',
    'Los Angeles - City of Angels',
    'LA Sports Teams',
    'LA Food & Flavors',
    'Entertainment Capital',
    'LA\'s Amazing Beaches',
    'Arts, Nature & Neighborhoods',
    'Downtown LA - Past & Present',
    'Hollywood & Beverly Hills',
    'More LA Treasures'
];

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAP_LOCATIONS, CATEGORY_STYLES, SESSION_NAMES };
}

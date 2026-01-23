/**
 * DISCOVER LA - Image Manifest
 * Comprehensive documentation of all images used in the application
 *
 * This manifest provides:
 * - Centralized image management
 * - Consistent quality settings
 * - Alternative sources for fallback
 * - Accessibility descriptions
 *
 * Image Quality Guidelines:
 * - Hero images: 1200px width, q=80
 * - Gallery images: 1000px width, q=85
 * - Map popup images: 600px width, q=80
 * - Thumbnails: 400px width, q=75
 */

const IMAGE_MANIFEST = {
    // Image quality presets
    presets: {
        hero: { width: 1200, quality: 80 },
        gallery: { width: 1000, quality: 85 },
        mapPopup: { width: 600, quality: 80 },
        thumbnail: { width: 400, quality: 75 },
        card: { width: 500, quality: 80 }
    },

    // Session hero images - high impact, full-width images
    heroImages: {
        session1: {
            primary: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad',
            fallback: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
            alt: 'Stunning California coastline with golden sunset over the Pacific Ocean',
            theme: 'California overview - vast, majestic',
            colorPalette: ['#FFB703', '#0096C7', '#22863A']
        },
        session2: {
            primary: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da',
            fallback: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0',
            alt: 'Downtown Los Angeles skyline with palm trees at golden hour',
            theme: 'LA introduction - vibrant, diverse',
            colorPalette: ['#FB8500', '#90E0EF', '#74C69D']
        },
        session3: {
            primary: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390',
            fallback: 'https://images.unsplash.com/photo-1461896836934- voices-of-la',
            alt: 'Football stadium at night with bright lights illuminating the field',
            theme: 'Sports - energetic, exciting',
            colorPalette: ['#FFB703', '#005A8C', '#DC2626']
        },
        session4: {
            primary: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
            fallback: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b',
            alt: 'Colorful street tacos with fresh cilantro and lime on a plate',
            theme: 'Food - warm, appetizing',
            colorPalette: ['#D97706', '#22863A', '#DC2626']
        },
        session5: {
            primary: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
            fallback: 'https://images.unsplash.com/photo-1542204637-e67bc7d41e48',
            alt: 'Movie camera and film equipment in a Hollywood studio setting',
            theme: 'Entertainment - magical, glamorous',
            colorPalette: ['#FFB703', '#F472B6', '#0096C7']
        },
        session6: {
            primary: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
            fallback: 'https://images.unsplash.com/photo-1534430480872-3498386e7856',
            alt: 'Beautiful California beach with turquoise waves and golden sand',
            theme: 'Beaches - relaxed, sunny',
            colorPalette: ['#00B4D8', '#FFB703', '#90E0EF']
        },
        session7: {
            primary: 'https://images.unsplash.com/photo-1566232392379-afd9298e6a46',
            fallback: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0',
            alt: 'Griffith Observatory at dusk with LA city lights in the background',
            theme: 'Arts & Nature - inspiring, creative',
            colorPalette: ['#6C5CE7', '#22863A', '#FFB703']
        },
        session8: {
            primary: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad',
            fallback: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da',
            alt: 'Walt Disney Concert Hall silver architecture against blue sky',
            theme: 'Downtown - historic, modern',
            colorPalette: ['#CBD5E1', '#005A8C', '#A0522D']
        },
        session9: {
            primary: 'https://images.unsplash.com/photo-1568454537842-d933259bb258',
            fallback: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f',
            alt: 'Hollywood Walk of Fame stars embedded in the sidewalk',
            theme: 'Hollywood - glamorous, starry',
            colorPalette: ['#FFB703', '#DC2626', '#F472B6']
        },
        session10: {
            primary: 'https://images.unsplash.com/photo-1515896769750-31548aa180ed',
            fallback: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da',
            alt: 'Aerial view of Los Angeles with mountains and city stretching to the horizon',
            theme: 'More LA - celebratory, complete',
            colorPalette: ['#0096C7', '#FFB703', '#22863A']
        }
    },

    // Landmark images for map and galleries
    landmarks: {
        goldenGateBridge: {
            url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
            alt: 'Golden Gate Bridge spanning San Francisco Bay at sunset with fog rolling through',
            location: 'San Francisco, CA'
        },
        hollywoodSign: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Hollywood_Sign_%28Zuschnitt%29.jpg/1280px-Hollywood_Sign_%28Zuschnitt%29.jpg',
            alt: 'The famous Hollywood Sign on Mount Lee in Los Angeles',
            location: 'Hollywood, LA'
        },
        griffithObservatory: {
            url: 'https://images.unsplash.com/photo-1566232392379-afd9298e6a46',
            alt: 'Art Deco Griffith Observatory building at twilight',
            location: 'Griffith Park, LA'
        },
        santaMonicaPier: {
            url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856',
            alt: 'Santa Monica Pier with iconic Ferris wheel and Pacific Park',
            location: 'Santa Monica, LA'
        },
        disneyHall: {
            url: 'https://images.unsplash.com/photo-1534438097545-a2c22c57f2ad',
            alt: 'Walt Disney Concert Hall with its distinctive stainless steel exterior',
            location: 'Downtown LA'
        },
        lacmaUrbanLight: {
            url: 'https://images.unsplash.com/photo-1494023070108-9d731ed6f0da',
            alt: 'LACMA Urban Light installation with 202 vintage street lamps at night',
            location: 'Mid-Wilshire, LA'
        },
        gettyCenter: {
            url: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0',
            alt: 'The Getty Center museum perched on a hilltop in Brentwood',
            location: 'Brentwood, LA'
        },
        veniceBeach: {
            url: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140',
            alt: 'Colorful Venice Beach boardwalk with street performers and palm trees',
            location: 'Venice, LA'
        },
        roseBowl: {
            url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e',
            alt: 'Rose Bowl Stadium in Pasadena during an evening event',
            location: 'Pasadena, CA'
        },
        dodgerStadium: {
            url: 'https://images.pexels.com/photos/269948/pexels-photo-269948.jpeg',
            alt: 'Dodger Stadium filled with fans during a night game',
            location: 'Elysian Park, LA'
        }
    },

    // Nature and scenic images
    nature: {
        redwoods: {
            url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d',
            alt: 'Towering coast redwood trees in Northern California forest',
            location: 'Redwood National Park, CA'
        },
        deathValley: {
            url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
            alt: 'Cracked desert floor in Death Valley with distant mountains',
            location: 'Death Valley, CA'
        },
        malibuCoast: {
            url: 'https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg',
            alt: 'Malibu coastline with dramatic cliffs meeting the Pacific Ocean',
            location: 'Malibu, CA'
        },
        griffithPark: {
            url: 'https://images.unsplash.com/photo-1551632811-561732d1e306',
            alt: 'Hiking trail in Griffith Park with views of the LA basin',
            location: 'Griffith Park, LA'
        },
        catalinaIsland: {
            url: 'https://images.unsplash.com/photo-1515896769750-31548aa180ed',
            alt: 'Aerial view of Catalina Island off the California coast',
            location: 'Catalina Island, CA'
        }
    },

    // Food and culture images
    foodCulture: {
        streetTacos: {
            url: 'https://images.pexels.com/photos/7613568/pexels-photo-7613568.jpeg',
            alt: 'Authentic LA street tacos with fresh cilantro and lime',
            cuisine: 'Mexican'
        },
        koreanBBQ: {
            url: 'https://images.pexels.com/photos/5774145/pexels-photo-5774145.jpeg',
            alt: 'Korean BBQ grill with marinated meats and side dishes',
            cuisine: 'Korean'
        },
        grandCentralMarket: {
            url: 'https://images.pexels.com/photos/15426317/pexels-photo-15426317.jpeg',
            alt: 'Bustling Grand Central Market food hall in downtown LA',
            location: 'Downtown LA'
        },
        foodTruck: {
            url: 'https://images.pexels.com/photos/5531005/pexels-photo-5531005.jpeg',
            alt: 'Colorful food truck on an LA street corner',
            type: 'Food Truck'
        },
        burgerFries: {
            url: 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg',
            alt: 'Classic California cheeseburger with crispy fries',
            cuisine: 'American'
        }
    },

    // Sports venues
    sports: {
        sofiStadium: {
            url: 'https://images.pexels.com/photos/270071/pexels-photo-270071.jpeg',
            alt: 'SoFi Stadium in Inglewood, home of the LA Rams and Chargers',
            teams: ['LA Rams', 'LA Chargers']
        },
        cryptoArena: {
            url: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg',
            alt: 'Basketball action at Crypto.com Arena',
            teams: ['LA Lakers', 'LA Clippers', 'LA Kings']
        },
        dignityHealth: {
            url: 'https://images.pexels.com/photos/46798/pexels-photo-46798.jpeg',
            alt: 'Soccer stadium with green pitch and packed stands',
            teams: ['LA Galaxy']
        }
    },

    // Helper function to build image URL with quality parameters
    buildUrl(baseUrl, preset = 'gallery') {
        const settings = this.presets[preset] || this.presets.gallery;

        // Handle Unsplash URLs
        if (baseUrl.includes('unsplash.com')) {
            return `${baseUrl}?w=${settings.width}&q=${settings.quality}`;
        }

        // Handle Pexels URLs
        if (baseUrl.includes('pexels.com')) {
            return `${baseUrl}?auto=compress&cs=tinysrgb&w=${settings.width}`;
        }

        // Return as-is for other sources
        return baseUrl;
    },

    // Get image with fallback support
    getImage(category, key, preset = 'gallery') {
        const categoryData = this[category];
        if (!categoryData || !categoryData[key]) {
            console.warn(`Image not found: ${category}.${key}`);
            return null;
        }

        const imageData = categoryData[key];
        const url = imageData.primary || imageData.url;

        return {
            src: this.buildUrl(url, preset),
            alt: imageData.alt,
            fallback: imageData.fallback ? this.buildUrl(imageData.fallback, preset) : null
        };
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IMAGE_MANIFEST;
}

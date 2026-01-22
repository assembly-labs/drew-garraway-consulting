/**
 * DISCOVER LA - Video Clips Data
 *
 * VIDEO FEATURE TEMPORARILY DISABLED
 *
 * The video IDs need to be manually curated and verified for:
 * 1. Child-appropriate content
 * 2. Accuracy to the educational topic
 * 3. Video availability/not deleted
 *
 * To re-enable videos:
 * 1. Find appropriate YouTube videos for each session
 * 2. Manually verify each video is child-safe
 * 3. Add verified IDs to this file
 * 4. The app will automatically show videos when this data is populated
 *
 * IMPORTANT: Never use randomly generated or unverified video IDs.
 * Each video must be manually watched and approved before adding.
 */

const SESSION_VIDEOS = {
    // All sessions empty until videos are properly curated
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: []
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SESSION_VIDEOS;
}

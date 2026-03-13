/**
 * Image Helper Functions
 * Provides fallback images and utilities for vocabulary items
 */

/**
 * Unsplash Source API - Free to use without API key
 * Generate image URL based on query
 */
export const getUnsplashImage = (query: string, width: number = 400, height: number = 400): string => {
    const encodedQuery = encodeURIComponent(query);
    return `https://source.unsplash.com/${width}x${height}/?${encodedQuery}`;
};

/**
 * Educational placeholder with text
 */
export const getPlaceholderImage = (text: string, bgColor: string = '4A90E2', textColor: string = 'FFFFFF'): string => {
    return `https://via.placeholder.com/400x400/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
};

/**
 * Vocabulary image mapping - fallback to Unsplash or generated images
 */
export const VOCABULARY_IMAGES: Record<string, string> = {
    // Grade 1 - Greetings
    'hello': '/vocab_hello.png',
    'goodbye': '/vocab_goodbye.png',
    'thanks': '/vocab_thanks.png',
    'please': getUnsplashImage('polite child please'),
    'sorry': getUnsplashImage('apologetic child'),

    // Colors
    'red': getUnsplashImage('red apple'),
    'blue': getUnsplashImage('blue ball'),
    'yellow': getUnsplashImage('yellow sun'),
    'green': getUnsplashImage('green tree'),
    'orange': getUnsplashImage('orange fruit'),

    // Animals
    'cat': getUnsplashImage('cute cat'),
    'dog': getUnsplashImage('cute dog'),
    'bird': getUnsplashImage('cute bird'),
    'fish': getUnsplashImage('colorful fish'),
    'rabbit': getUnsplashImage('cute rabbit'),

    // Numbers (use illustrations)
    'one': getPlaceholderImage('1', '66BB6A', 'FFFFFF'),
    'two': getPlaceholderImage('2', '42A5F5', 'FFFFFF'),
    'three': getPlaceholderImage('3', 'FFA726', 'FFFFFF'),
    'four': getPlaceholderImage('4', 'AB47BC', 'FFFFFF'),
    'five': getPlaceholderImage('5', 'EF5350', 'FFFFFF'),

    // Grade 2 - Family
    'mother': getUnsplashImage('mother mom'),
    'father': getUnsplashImage('father dad'),
    'sister': getUnsplashImage('sister girl'),
    'brother': getUnsplashImage('brother boy'),
    'grandmother': getUnsplashImage('grandmother grandma'),

    // School supplies
    'book': getUnsplashImage('book reading'),
    'pencil': getUnsplashImage('pencil writing'),
    'eraser': getUnsplashImage('eraser'),
    'ruler': getUnsplashImage('ruler measure'),
    'backpack': getUnsplashImage('school backpack'),

    // House
    'bedroom': getUnsplashImage('bedroom'),
    'kitchen': getUnsplashImage('kitchen'),
    'living room': getUnsplashImage('living room cozy'),
    'bathroom': getUnsplashImage('bathroom'),
    'garden': getUnsplashImage('garden flowers'),

    // Grade 3 - Subjects
    'math': getUnsplashImage('mathematics numbers'),
    'science': getUnsplashImage('science experiment'),
    'art': getUnsplashImage('art painting'),
    'music': getUnsplashImage('music instruments'),
    'PE': getUnsplashImage('physical education sports'),

    // Time
    'morning': getUnsplashImage('morning sunrise'),
    'afternoon': getUnsplashImage('afternoon'),
    'evening': getUnsplashImage('evening sunset'),
    'night': getUnsplashImage('night stars'),
    'clock': getUnsplashImage('clock time'),

    // Weather
    'sunny': getUnsplashImage('sunny weather'),
    'rainy': getUnsplashImage('rain drops'),
    'cloudy': getUnsplashImage('cloudy sky'),
    'windy': getUnsplashImage('windy trees'),
    'snowy': getUnsplashImage('snow winter'),

    // Grade 4 - Daily routine
    'wake up': getUnsplashImage('wake up morning'),
    'brush teeth': getUnsplashImage('brush teeth'),
    'eat breakfast': getUnsplashImage('breakfast'),
    'go to school': getUnsplashImage('school bus'),
    'do homework': getUnsplashImage('homework studying'),

    // Hobbies
    'reading': getUnsplashImage('reading book'),
    'drawing': getUnsplashImage('drawing art'),
    'swimming': getUnsplashImage('swimming pool'),
    'dancing': getUnsplashImage('dancing'),
    'playing soccer': getUnsplashImage('soccer football'),

    // Food
    'apple': getUnsplashImage('red apple'),
    'banana': getUnsplashImage('banana'),
    'rice': getUnsplashImage('rice bowl'),
    'chicken': getUnsplashImage('chicken food'),
    'milk': getUnsplashImage('milk glass'),

    // Grade 5 - Places
    'hometown': getUnsplashImage('hometown city'),
    'pretty': getUnsplashImage('pretty place'),
    'quiet': getUnsplashImage('quiet peaceful'),
    'crowded': getUnsplashImage('crowded street'),
    'modern': getUnsplashImage('modern city'),

    // Address
    'address': getUnsplashImage('house address'),
    'street': getUnsplashImage('street road'),
    'village': getUnsplashImage('village countryside'),
    'city': getUnsplashImage('city skyline'),
    'country': getUnsplashImage('country map'),

    // Frequency
    'always': getPlaceholderImage('100%', '4CAF50', 'FFFFFF'),
    'usually': getPlaceholderImage('80%', '8BC34A', 'FFFFFF'),
    'often': getPlaceholderImage('60%', 'FFEB3B', '333333'),
    'sometimes': getPlaceholderImage('40%', 'FF9800', 'FFFFFF'),
    'never': getPlaceholderImage('0%', 'F44336', 'FFFFFF'),

    // Activities
    'watch TV': getUnsplashImage('watching TV'),
    'go to bed': getUnsplashImage('bed sleep'),
    'have breakfast': getUnsplashImage('breakfast meal'),
};

/**
 * Get image for vocabulary word with fallback
 */
export const getVocabularyImage = (word: string): string => {
    const lowercaseWord = word.toLowerCase();

    // Check if we have a specific image
    if (VOCABULARY_IMAGES[lowercaseWord]) {
        return VOCABULARY_IMAGES[lowercaseWord];
    }

    // Fallback to Unsplash with the word query
    return getUnsplashImage(word);
};

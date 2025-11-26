// Local Bible data storage
let bibleData = {
    kjv: null,
    rst: null
};

// Bible book names and chapter counts (matching JSON file abbreviations)
const BIBLE_BOOKS = [
    { name: 'Genesis', id: 'gn', chapters: 50 },
    { name: 'Exodus', id: 'ex', chapters: 40 },
    { name: 'Leviticus', id: 'lv', chapters: 27 },
    { name: 'Numbers', id: 'nm', chapters: 36 },
    { name: 'Deuteronomy', id: 'dt', chapters: 34 },
    { name: 'Joshua', id: 'js', chapters: 24 },
    { name: 'Judges', id: 'jud', chapters: 21 },
    { name: 'Ruth', id: 'rt', chapters: 4 },
    { name: '1 Samuel', id: '1sm', chapters: 31 },
    { name: '2 Samuel', id: '2sm', chapters: 24 },
    { name: '1 Kings', id: '1kgs', chapters: 22 },
    { name: '2 Kings', id: '2kgs', chapters: 25 },
    { name: '1 Chronicles', id: '1ch', chapters: 29 },
    { name: '2 Chronicles', id: '2ch', chapters: 36 },
    { name: 'Ezra', id: 'ezr', chapters: 10 },
    { name: 'Nehemiah', id: 'ne', chapters: 13 },
    { name: 'Esther', id: 'et', chapters: 10 },
    { name: 'Job', id: 'job', chapters: 42 },
    { name: 'Psalms', id: 'ps', chapters: 150 },
    { name: 'Proverbs', id: 'prv', chapters: 31 },
    { name: 'Ecclesiastes', id: 'ec', chapters: 12 },
    { name: 'Song of Solomon', id: 'so', chapters: 8 },
    { name: 'Isaiah', id: 'is', chapters: 66 },
    { name: 'Jeremiah', id: 'jr', chapters: 52 },
    { name: 'Lamentations', id: 'lm', chapters: 5 },
    { name: 'Ezekiel', id: 'ez', chapters: 48 },
    { name: 'Daniel', id: 'dn', chapters: 12 },
    { name: 'Hosea', id: 'ho', chapters: 14 },
    { name: 'Joel', id: 'jl', chapters: 3 },
    { name: 'Amos', id: 'am', chapters: 9 },
    { name: 'Obadiah', id: 'ob', chapters: 1 },
    { name: 'Jonah', id: 'jn', chapters: 4 },
    { name: 'Micah', id: 'mi', chapters: 7 },
    { name: 'Nahum', id: 'na', chapters: 3 },
    { name: 'Habakkuk', id: 'hk', chapters: 3 },
    { name: 'Zephaniah', id: 'zp', chapters: 3 },
    { name: 'Haggai', id: 'hg', chapters: 2 },
    { name: 'Zechariah', id: 'zc', chapters: 14 },
    { name: 'Malachi', id: 'ml', chapters: 4 },
    { name: 'Matthew', id: 'mt', chapters: 28 },
    { name: 'Mark', id: 'mk', chapters: 16 },
    { name: 'Luke', id: 'lk', chapters: 24 },
    { name: 'John', id: 'jo', chapters: 21 },
    { name: 'Acts', id: 'act', chapters: 28 },
    { name: 'Romans', id: 'rm', chapters: 16 },
    { name: '1 Corinthians', id: '1co', chapters: 16 },
    { name: '2 Corinthians', id: '2co', chapters: 13 },
    { name: 'Galatians', id: 'gl', chapters: 6 },
    { name: 'Ephesians', id: 'eph', chapters: 6 },
    { name: 'Philippians', id: 'ph', chapters: 4 },
    { name: 'Colossians', id: 'cl', chapters: 4 },
    { name: '1 Thessalonians', id: '1ts', chapters: 5 },
    { name: '2 Thessalonians', id: '2ts', chapters: 3 },
    { name: '1 Timothy', id: '1tm', chapters: 6 },
    { name: '2 Timothy', id: '2tm', chapters: 4 },
    { name: 'Titus', id: 'tt', chapters: 3 },
    { name: 'Philemon', id: 'phm', chapters: 1 },
    { name: 'Hebrews', id: 'hb', chapters: 13 },
    { name: 'James', id: 'jm', chapters: 5 },
    { name: '1 Peter', id: '1pe', chapters: 5 },
    { name: '2 Peter', id: '2pe', chapters: 3 },
    { name: '1 John', id: '1jo', chapters: 5 },
    { name: '2 John', id: '2jo', chapters: 1 },
    { name: '3 John', id: '3jo', chapters: 1 },
    { name: 'Jude', id: 'jd', chapters: 1 },
    { name: 'Revelation', id: 're', chapters: 22 }
];

// Translation info
const TRANSLATIONS = {
    kjv: 'King James Version (KJV)',
    rst: 'Russian Synodal Translation (RST)'
};

// Map of translation IDs to file paths
const TRANSLATION_FILES = {
    kjv: '/data/kjv.json',
    rst: '/data/rst.json'
};

// DOM Elements
const bookSelect = document.getElementById('book-select');
const chapterSelect = document.getElementById('chapter-select');
const contentDiv = document.getElementById('content');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const pageTitle = document.getElementById('page-title');
const prevChapterBtn = document.getElementById('prev-chapter');
const nextChapterBtn = document.getElementById('next-chapter');

// Parse URL path to get book, chapter, and optional verse/verse range
function parseURL() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);
    
    if (parts.length >= 2) {
        const bookName = parts[0].toLowerCase();
        const chapterPart = parts[1];
        
        let chapterNum, verseStart, verseEnd;
        
        // Check if using colon format (e.g., "3:16" or "3:16-20")
        if (chapterPart.includes(':')) {
            const [chapterStr, verseStr] = chapterPart.split(':');
            chapterNum = parseInt(chapterStr);
            
            // Check for verse range (e.g., "16-20")
            if (verseStr && verseStr.includes('-')) {
                const [startStr, endStr] = verseStr.split('-');
                verseStart = parseInt(startStr);
                verseEnd = parseInt(endStr);
            } else {
                verseStart = verseStr ? parseInt(verseStr) : null;
            }
        } else if (chapterPart.includes('-')) {
            // Using dash format (e.g., "3-16"), only single verse
            const [chapterStr, verseStr] = chapterPart.split('-');
            chapterNum = parseInt(chapterStr);
            verseStart = verseStr ? parseInt(verseStr) : null;
        } else {
            // Just chapter number
            chapterNum = parseInt(chapterPart);
        }
        
        // Find book by name (case-insensitive match)
        const book = BIBLE_BOOKS.find(b => 
            b.name.toLowerCase().replace(/\s+/g, '') === bookName.replace(/\s+/g, '') ||
            b.name.toLowerCase().replace(/\s/g, '') === bookName.replace(/\s/g, '') ||
            b.name.toLowerCase() === bookName ||
            b.id === bookName
        );
        
        // Validate chapter number
        if (book && chapterNum && chapterNum >= 1 && chapterNum <= book.chapters) {
            const result = { bookId: book.id, chapter: chapterNum.toString() };
            
            if (verseStart && verseStart >= 1) {
                result.verseStart = verseStart.toString();
                if (verseEnd && verseEnd >= verseStart) {
                    result.verseEnd = verseEnd.toString();
                }
            }
            
            console.log('Parsed URL:', result);
            return result;
        } else {
            console.log('Invalid URL - book:', bookName, 'found:', book, 'chapter:', chapterNum);
        }
    }
    
    return null;
}

// Update URL path based on current selection (optionally with verse)
function updateURL(verse = null) {
    const selectedBookId = bookSelect.value;
    const book = BIBLE_BOOKS.find(b => b.id === selectedBookId);
    const chapter = chapterSelect.value;
    
    if (book && chapter) {
        const bookName = book.name.toLowerCase().replace(/\s+/g, '');
        const url = verse ? `/${bookName}/${chapter}-${verse}` : `/${bookName}/${chapter}`;
        window.history.pushState(null, '', url);
    }
}

// Save translation order to localStorage
function saveTranslationOrder() {
    const translationLabels = document.querySelectorAll('.translation-checkbox');
    const order = Array.from(translationLabels).map(label => 
        label.getAttribute('data-translation')
    );
    localStorage.setItem('translationOrder', JSON.stringify(order));
    console.log('Saved translation order:', order);
}

// Restore translation order from localStorage
function restoreTranslationOrder() {
    const savedOrder = localStorage.getItem('translationOrder');
    if (!savedOrder) return;
    
    try {
        const order = JSON.parse(savedOrder);
        const translationOptions = document.getElementById('translation-options');
        const translationLabels = Array.from(document.querySelectorAll('.translation-checkbox'));
        
        // Create a map of translation ID to element
        const elementMap = {};
        translationLabels.forEach(label => {
            const transId = label.getAttribute('data-translation');
            elementMap[transId] = label;
        });
        
        // Reorder based on saved order
        order.forEach(transId => {
            if (elementMap[transId]) {
                translationOptions.appendChild(elementMap[transId]);
            }
        });
        
        console.log('Restored translation order:', order);
    } catch (e) {
        console.error('Failed to restore translation order:', e);
    }
}

// Save translation selections to localStorage
function saveTranslationSelections() {
    const checkboxes = document.querySelectorAll('.translation-checkbox input[type="checkbox"]');
    const selections = {};
    
    checkboxes.forEach(checkbox => {
        selections[checkbox.value] = checkbox.checked;
    });
    
    localStorage.setItem('translationSelections', JSON.stringify(selections));
    console.log('Saved translation selections:', selections);
}

// Restore translation selections from localStorage
function restoreTranslationSelections() {
    const savedSelections = localStorage.getItem('translationSelections');
    if (!savedSelections) return;
    
    try {
        const selections = JSON.parse(savedSelections);
        const checkboxes = document.querySelectorAll('.translation-checkbox input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            if (selections.hasOwnProperty(checkbox.value)) {
                checkbox.checked = selections[checkbox.value];
            }
        });
        
        console.log('Restored translation selections:', selections);
    } catch (e) {
        console.error('Failed to restore translation selections:', e);
    }
}

// Initialize the app
async function init() {
    populateBookSelect();
    
    // Restore translation order and selections before loading anything
    restoreTranslationOrder();
    restoreTranslationSelections();
    
    // Load Bible data
    showLoading();
    await loadBibleData();
    hideLoading();
    
    // Check if URL has a specific book/chapter
    const urlParams = parseURL();
    console.log('URL params on init:', urlParams);
    
    // Set book and chapter based on URL or defaults (BEFORE setting up event listeners)
    if (urlParams && urlParams.bookId && urlParams.chapter) {
        // Load from URL - verify the book exists in our select
        const bookExists = Array.from(bookSelect.options).some(opt => opt.value === urlParams.bookId);
        if (bookExists) {
            console.log('Loading from URL:', urlParams.bookId, 'chapter', urlParams.chapter);
            bookSelect.value = urlParams.bookId;
            updateChapterSelect();
            chapterSelect.value = urlParams.chapter;
        } else {
            // Fall back to default if URL has invalid book
            console.warn('Invalid book in URL:', urlParams.bookId);
            bookSelect.value = 'jo';
            updateChapterSelect();
            chapterSelect.value = '3';
        }
    } else {
        // Load John 3 by default
        console.log('Loading default: John 3');
        bookSelect.value = 'jo';
        updateChapterSelect();
        chapterSelect.value = '3';
    }
    
    // Update title and load the chapter
    updatePageTitle();
    await loadChapter();
    
    // If URL has a verse or verse range, highlight and scroll to it
    if (urlParams && urlParams.verseStart) {
        setTimeout(() => {
            const start = parseInt(urlParams.verseStart);
            const end = urlParams.verseEnd ? parseInt(urlParams.verseEnd) : start;
            highlightAndScrollToVerse(start, end);
        }, 100);
    }
    
    // Set up event listeners AFTER initial load to avoid triggering them during init
    setupEventListeners();
}

// Load Bible JSON files
async function loadBibleData() {
    const loadPromises = Object.entries(TRANSLATION_FILES).map(async ([transId, filePath]) => {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${transId}`);
            }
            const data = await response.json();
            bibleData[transId] = data;
            console.log(`Loaded ${transId} translation (${data.length} books)`);
        } catch (error) {
            console.error(`Error loading ${transId}:`, error);
            showError(`Failed to load ${TRANSLATIONS[transId]}. Please refresh the page.`);
        }
    });
    
    await Promise.all(loadPromises);
}

// Populate book dropdown
function populateBookSelect() {
    bookSelect.innerHTML = BIBLE_BOOKS.map(book => 
        `<option value="${book.id}">${book.name}</option>`
    ).join('');
    updateChapterSelect();
}

// Update chapter dropdown based on selected book
function updateChapterSelect() {
    const selectedBookId = bookSelect.value;
    const book = BIBLE_BOOKS.find(b => b.id === selectedBookId);
    
    if (book) {
        chapterSelect.innerHTML = '';
        for (let i = 1; i <= book.chapters; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            chapterSelect.appendChild(option);
        }
    }
}

// Update page title with current book and chapter
function updatePageTitle() {
    const selectedBookId = bookSelect.value;
    const book = BIBLE_BOOKS.find(b => b.id === selectedBookId);
    const chapter = chapterSelect.value;
    
    if (book && chapter) {
        pageTitle.textContent = `${book.name} ${chapter}`;
    } else {
        pageTitle.textContent = 'Bible Study';
    }
    
    updateNavigationArrows();
}

// Update navigation arrow states
function updateNavigationArrows() {
    const selectedBookId = bookSelect.value;
    const book = BIBLE_BOOKS.find(b => b.id === selectedBookId);
    const chapter = parseInt(chapterSelect.value);
    
    if (!book || !chapter) {
        prevChapterBtn.disabled = true;
        nextChapterBtn.disabled = true;
        return;
    }
    
    // Disable prev if at first chapter of first book
    const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === selectedBookId);
    prevChapterBtn.disabled = (bookIndex === 0 && chapter === 1);
    
    // Disable next if at last chapter of last book
    nextChapterBtn.disabled = (bookIndex === BIBLE_BOOKS.length - 1 && chapter === book.chapters);
}

// Navigate to previous chapter
function navigateToPreviousChapter() {
    const selectedBookId = bookSelect.value;
    const book = BIBLE_BOOKS.find(b => b.id === selectedBookId);
    const chapter = parseInt(chapterSelect.value);
    
    if (!book) return;
    
    if (chapter > 1) {
        // Go to previous chapter in same book
        chapterSelect.value = chapter - 1;
        updatePageTitle();
        updateURL();
        loadChapter();
    } else {
        // Go to last chapter of previous book
        const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === selectedBookId);
        if (bookIndex > 0) {
            const prevBook = BIBLE_BOOKS[bookIndex - 1];
            bookSelect.value = prevBook.id;
            updateChapterSelect();
            chapterSelect.value = prevBook.chapters;
            updatePageTitle();
            updateURL();
            loadChapter();
        }
    }
}

// Navigate to next chapter
function navigateToNextChapter() {
    const selectedBookId = bookSelect.value;
    const book = BIBLE_BOOKS.find(b => b.id === selectedBookId);
    const chapter = parseInt(chapterSelect.value);
    
    if (!book) return;
    
    if (chapter < book.chapters) {
        // Go to next chapter in same book
        chapterSelect.value = chapter + 1;
        updatePageTitle();
        updateURL();
        loadChapter();
    } else {
        // Go to first chapter of next book
        const bookIndex = BIBLE_BOOKS.findIndex(b => b.id === selectedBookId);
        if (bookIndex < BIBLE_BOOKS.length - 1) {
            const nextBook = BIBLE_BOOKS[bookIndex + 1];
            bookSelect.value = nextBook.id;
            updateChapterSelect();
            chapterSelect.value = 1;
            updatePageTitle();
            updateURL();
            loadChapter();
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    bookSelect.addEventListener('change', () => {
        updateChapterSelect();
        updatePageTitle();
        updateURL();
        loadChapter();
    });
    
    chapterSelect.addEventListener('change', () => {
        updatePageTitle();
        updateURL();
        loadChapter();
    });
    
    // Navigation arrows
    prevChapterBtn.addEventListener('click', navigateToPreviousChapter);
    nextChapterBtn.addEventListener('click', navigateToNextChapter);
    
    // Auto-reload when translation selection changes
    const translationCheckboxes = document.querySelectorAll('.translation-checkbox input');
    translationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Save the selection state
            saveTranslationSelections();
            
            // Only reload if there's content already displayed
            if (contentDiv.querySelector('.parallel-view')) {
                loadChapter();
            }
        });
    });
    
    // Setup drag and drop for translation reordering
    setupDragAndDrop();
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => {
        const urlParams = parseURL();
        if (urlParams) {
            bookSelect.value = urlParams.bookId;
            updateChapterSelect();
            chapterSelect.value = urlParams.chapter;
            updatePageTitle();
            loadChapter().then(() => {
                if (urlParams.verseStart) {
                    setTimeout(() => {
                        const start = parseInt(urlParams.verseStart);
                        const end = urlParams.verseEnd ? parseInt(urlParams.verseEnd) : start;
                        highlightAndScrollToVerse(start, end);
                    }, 100);
                }
            });
        }
    });
}

// Get selected translations in their current display order
function getSelectedTranslations() {
    const translationLabels = document.querySelectorAll('.translation-checkbox');
    const selected = [];
    
    translationLabels.forEach(label => {
        const checkbox = label.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            selected.push(checkbox.value);
        }
    });
    
    return selected;
}

// Setup drag and drop for translation reordering
function setupDragAndDrop() {
    const translationOptions = document.getElementById('translation-options');
    const translationLabels = document.querySelectorAll('.translation-checkbox');
    
    let draggedElement = null;
    
    translationLabels.forEach(label => {
        // Drag start
        label.addEventListener('dragstart', (e) => {
            draggedElement = label;
            label.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', label.innerHTML);
        });
        
        // Drag end
        label.addEventListener('dragend', () => {
            label.classList.remove('dragging');
            // Remove drag-over class from all elements
            document.querySelectorAll('.translation-checkbox').forEach(el => {
                el.classList.remove('drag-over');
            });
        });
        
        // Drag over
        label.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (draggedElement !== label) {
                label.classList.add('drag-over');
            }
        });
        
        // Drag leave
        label.addEventListener('dragleave', () => {
            label.classList.remove('drag-over');
        });
        
        // Drop
        label.addEventListener('drop', (e) => {
            e.preventDefault();
            label.classList.remove('drag-over');
            
            if (draggedElement !== label) {
                // Get all labels
                const allLabels = Array.from(translationOptions.querySelectorAll('.translation-checkbox'));
                const draggedIndex = allLabels.indexOf(draggedElement);
                const targetIndex = allLabels.indexOf(label);
                
                // Reorder in DOM
                if (draggedIndex < targetIndex) {
                    label.parentNode.insertBefore(draggedElement, label.nextSibling);
                } else {
                    label.parentNode.insertBefore(draggedElement, label);
                }
                
                // Save the new order to localStorage
                saveTranslationOrder();
                
                // Reload chapter with new order
                if (contentDiv.querySelector('.parallel-view')) {
                    loadChapter();
                }
            }
        });
    });
}

// Load and display chapter
async function loadChapter() {
    const bookId = bookSelect.value;
    const chapter = parseInt(chapterSelect.value);
    const translations = getSelectedTranslations();
    
    if (translations.length === 0) {
        showError('Please select at least one translation');
        return;
    }
    
    showLoading();
    hideError();
    
    try {
        // Get verses from local data
        const parallelData = {};
        
        for (const transId of translations) {
            if (!bibleData[transId]) {
                throw new Error(`${TRANSLATIONS[transId]} not loaded`);
            }
            
            // Find the book in the translation data
            const book = bibleData[transId].find(b => b.abbrev === bookId);
            
            if (!book) {
                throw new Error(`Book ${bookId} not found in ${transId}`);
            }
            
            // Get the chapter (chapters are 0-indexed in array)
            const chapterVerses = book.chapters[chapter - 1];
            
            if (!chapterVerses) {
                throw new Error(`Chapter ${chapter} not found in ${bookId}`);
            }
            
            // Format verses as objects with text property
            parallelData[transId] = chapterVerses.map(text => ({ text }));
        }
        
        displayParallelText(parallelData, translations);
        
    } catch (error) {
        console.error('Error loading Bible text:', error);
        showError(`Error loading Bible text: ${error.message}. Please try again.`);
    } finally {
        hideLoading();
    }
}

// Display parallel translations
function displayParallelText(data, translations) {
    contentDiv.innerHTML = '';
    
    const parallelView = document.createElement('div');
    parallelView.className = 'parallel-view';
    
    // Get the maximum number of verses across all translations
    const maxVerses = Math.max(...translations.map(transId => 
        (data[transId] && data[transId].length) || 0
    ));
    
    // Create a row for each verse
    for (let verseIndex = 0; verseIndex < maxVerses; verseIndex++) {
        const verseNumber = verseIndex + 1;
        const verseRow = document.createElement('div');
        verseRow.className = 'verse-row';
        verseRow.id = `verse-${verseNumber}`;
        verseRow.style.gridTemplateColumns = `repeat(${translations.length}, 1fr)`;
        
        translations.forEach(transId => {
            const verseCell = document.createElement('div');
            verseCell.className = 'verse-cell';
            
            const verses = data[transId];
            if (verses && verses[verseIndex]) {
                const verseNum = document.createElement('span');
                verseNum.className = 'verse-number';
                verseNum.textContent = verseNumber;
                verseNum.style.cursor = 'pointer';
                verseNum.title = `Link to verse ${verseNumber}`;
                
                // Make verse number clickable
                verseNum.addEventListener('click', (e) => {
                    e.preventDefault();
                    updateURL(verseNumber);
                    highlightAndScrollToVerse(verseNumber, verseNumber);
                });
                
                const verseText = document.createElement('span');
                verseText.className = 'verse-text';
                verseText.textContent = verses[verseIndex].text || verses[verseIndex];
                
                verseCell.appendChild(verseNum);
                verseCell.appendChild(verseText);
            } else {
                // Empty cell if this translation doesn't have this verse
                verseCell.innerHTML = '&nbsp;';
            }
            
            verseRow.appendChild(verseCell);
        });
        
        parallelView.appendChild(verseRow);
    }
    
    contentDiv.appendChild(parallelView);
}

// Highlight and scroll to a specific verse or verse range
function highlightAndScrollToVerse(verseStart, verseEnd = null) {
    // Remove previous highlights and special classes
    document.querySelectorAll('.verse-row.highlighted').forEach(row => {
        row.classList.remove('highlighted', 'highlight-first', 'highlight-last');
    });
    
    // If no end verse specified, just highlight one verse
    const endVerse = verseEnd || verseStart;
    
    let firstVerse = null;
    
    // Highlight all verses in the range
    for (let verseNum = verseStart; verseNum <= endVerse; verseNum++) {
        const verseRow = document.getElementById(`verse-${verseNum}`);
        if (verseRow) {
            verseRow.classList.add('highlighted');
            
            // Add special class for first verse in range
            if (verseNum === verseStart) {
                verseRow.classList.add('highlight-first');
                firstVerse = verseRow;
            }
            
            // Add special class for last verse in range
            if (verseNum === endVerse) {
                verseRow.classList.add('highlight-last');
            }
        }
    }
    
    // Scroll to the first verse in the range
    if (firstVerse) {
        firstVerse.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// UI helper functions
function showLoading() {
    loadingDiv.classList.remove('hidden');
    contentDiv.innerHTML = '';
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


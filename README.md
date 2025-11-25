# Bible Study - Parallel Translations Reader

A modern, beautiful web application for studying the Bible by reading multiple translations in parallel.

## Features

- **Parallel Reading**: View multiple Bible translations side-by-side
- **Multiple Translations**: Supports KJV and Russian Synodal Translation (all public domain)
- **Easy Navigation**: Simple dropdown menus for books and chapters
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean UI**: Modern, user-friendly interface
- **Free & Open Source**: All translations are from public domain sources

## Supported Translations

1. **King James Version (KJV)** - The classic 1611 translation
2. **Russian Synodal Translation (RST)** - Синодальный перевод, the standard Russian translation

*All translations are stored locally - no internet connection required after initial page load!*

## How to Use

1. Open `index.html` in your web browser
2. Select a book from the dropdown menu
3. Choose a chapter
4. Check the translations you want to compare
5. The chapter will load automatically

## Technology

- Pure HTML, CSS, and JavaScript (no frameworks required)
- Bible texts stored locally as JSON files (~10 MB total)
- Fully offline-capable after initial load
- No external API dependencies
- Can be hosted on any static web hosting service

## Installation

### Local Use
Simply download all files and open `index.html` in your browser. No installation needed!

### Web Hosting
Upload all files to any web hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## Data Sources

Bible translations are stored locally in JSON format in the `data/` directory:
- `kjv.json` - King James Version (4.3 MB)
- `rst.json` - Russian Synodal Translation (5.8 MB)

Source: [thiagobodruk/bible](https://github.com/thiagobodruk/bible) on GitHub

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Credits

- Bible texts from public domain sources
- Bible JSON data from [thiagobodruk/bible](https://github.com/thiagobodruk/bible)
- Inspired by [BibleHub.com](https://biblehub.com)

## License

This project is open source. All Bible translations used are in the public domain.

## Future Enhancements

Potential features for future versions:
- Search functionality
- Bookmarking favorite verses
- Notes and highlighting
- Verse-by-verse comparison view
- Additional translations
- Cross-references
- Download chapter as PDF
- Dark mode

## Contributing

Feel free to fork and enhance this project! Some ideas:
- Add more translations
- Improve the UI/UX
- Add study tools (concordance, dictionary, etc.)
- Create a mobile app version

---

Made with ❤️ for Bible study


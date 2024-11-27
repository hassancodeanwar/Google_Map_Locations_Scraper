# Google Maps Location Scraper

## Overview

This Python script is designed to scrape location data for a specific category of places within a given U.S. state using Google Maps. The scraper collects comprehensive information about each location, including name, address, rating, number of reviews, and operating hours.

![img](https://github.com/hassancodeanwar/Google_Map_Locations_Scraper/blob/main/Google%20Maps%20Locations%20Scraper.png?raw=true)

## Dependencies

### Python Libraries
- `logging`: For logging script activities and errors
- `selenium`: Web automation and browser interaction
- `bs4` (BeautifulSoup): HTML parsing
- `pandas`: Data manipulation and CSV export
- `time`: Adding delays between actions
- `random`: Introducing randomness in wait times

### External Dependencies
- Chrome WebDriver
- Selenium WebDriver for Chrome

## Configuration Variables

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `catigory` | The type of places to scrape | "Churchs" |
| `state` | U.S. state for location search | "Kentucky" |
| `stat_shortcut` | State abbreviation | "Ken" |

## Key Functions

### `collect_all_places_data()`

#### Workflow
1. Initialize Chrome WebDriver
2. Navigate to Google Maps
3. Search for places matching category and state
4. Scroll through search results
5. Extract detailed information for each location
6. Save data to CSV file

#### Data Extraction Process
- Name
- Address
- Location Link
- Average Rating
- Number of Raters
- Operating Hours

### Error Handling and Logging

- Comprehensive logging to `{State}_{Category}_scraper.log`
- Handles exceptions for:
  - Element not found
  - Timeout issues
  - Navigation problems

## Scraping Strategies

### Navigation
- Uses WebDriverWait for dynamic element loading
- Implements random delays to mimic human browsing
- Scrolls through search results progressively

### Data Extraction
- BeautifulSoup for robust HTML parsing
- Fallback values for missing information
- Duplicate link prevention

## Output

### CSV File
- Filename: `{State}_{Category}_data001.csv`
- Columns:
  - Name
  - Address
  - Location Link
  - Average Rating
  - Number of Raters
  - Hours

## Logging Levels

- `INFO`: Standard operation steps
- `WARNING`: Potential issues (e.g., close button not found)
- `ERROR`: Element or processing errors
- `CRITICAL`: Unexpected script failures

## Potential Improvements

- Add proxy support
- Implement more robust anti-detection mechanisms
- Support multiple states/categories
- Add command-line argument parsing

## Limitations

- Requires manual Chrome WebDriver setup
- Dependent on Google Maps HTML structure
- Limited by Google's rate limiting and potential anti-scraping measures

## Usage

1. Install required dependencies:
   ```bash
   pip install selenium beautifulsoup4 pandas
   ```
2. Download compatible ChromeDriver
3. Modify `catigory` and `state` variables
4. Run the script

## Disclaimer

Web scraping may violate Google Maps' Terms of Service. Use responsibly and consider official APIs when possible.

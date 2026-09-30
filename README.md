# NASA/JPL Near-Earth Asteroid Explorer

## Overview

Asteroid Explorer is a dashboard for exploring downloaded NASA/JPL asteroid close-approach data. It turns the local JSON records into summaries, charts, searchable results, and a table.

## Problem

NASA/JPL provides useful close-approach data, but the raw JSON can be difficult for a regular user to understand. The fields and measurements are easier to explore when they are presented with plain labels and readable units.

## Solution

The dashboard presents the downloaded records as:

- Summary cards based on the current results
- All, historical, and upcoming record views
- Search and start/end date filters
- A sortable table with pagination
- Charts for closest approaches, fastest objects, and approaches over time
- A detail view for individual records
- Plain-language explanations of close approaches and measurements

## Features

- Historical and upcoming close approaches
- Case-insensitive search by object name or designation
- Start Date and End Date filters, with Reset Filters
- Sorting by approach date, miss distance, and relative speed
- Summary cards that update with the current filters and search
- Distance shown in kilometers, miles, and lunar distances
- Speed shown in km/s and mph
- Closest-approaches chart showing up to 10 records
- Fastest-objects chart showing up to 10 records
- Timeline chart grouped by month for shorter ranges and by year for longer ranges
- Detail dialog with available information for a selected record
- Responsive layout, keyboard-accessible controls, and messages for missing data or failed file loads

## Data Source

Data source: NASA/JPL Small-Body Database Close Approach Data API.

The dashboard uses two local JSON files:

- `historicaldata.json` contains historical close approaches.
- `futuredata.json` contains upcoming close approaches.

## Data Snapshot

This dashboard uses a locally stored snapshot of NASA/JPL data and does not retrieve live data.

The current files cover:

- Historical data: Sep 30, 2016 to Sep 28, 2026
- Upcoming data: Sep 30, 2026 to Sep 28, 2036

These ranges are calculated from the dates in the loaded files and may change when the snapshots are updated.

## Important Disclaimer

Close approach does not mean an asteroid is predicted to impact Earth. This dashboard is for exploring close-approach data, not predicting impacts.

## Technologies Used

- HTML
- CSS
- JavaScript
- Chart.js, loaded from jsDelivr
- GitHub Pages for static hosting

## Project Structure

```text
Asteroid-Tracker/
|-- index.html
|-- historicaldata.json
|-- futuredata.json
|-- css/
|   `-- style.css
`-- js/
    |-- app.js
    |-- charts.js
    |-- data.js
    |-- details.js
    |-- filters.js
    |-- normalize.js
    |-- summary.js
    |-- table.js
    `-- utils.js
```

## Running Locally

Open the project folder in VS Code and use the Live Server extension to open `index.html`. The JSON files are loaded with `fetch()`, so the site needs to run through a local web server rather than directly from a `file://` URL.

Alternatively, run this from the project folder:

```powershell
python -m http.server 5500
```

Then open `http://localhost:5500` in a browser.

## Live Demo
[Asteroid Explorer](https://ppdeshmukh80-create.github.io/Asteroid-Tracker/)

## Repository

[Asteroid Explorer on GitHub](https://github.com/ppdeshmukh80-create/Asteroid-Tracker-)
(develop branch)
## Notes

This is a static dashboard. To update its data, replace the local snapshots with new downloaded files and publish the changes to GitHub Pages.

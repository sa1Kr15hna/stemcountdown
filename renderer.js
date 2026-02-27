const { ipcRenderer } = require('electron');

function getMidnightDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

let globalStartDate, globalEndDate;

function generateGrid(startDateStr, endDateStr) {
    globalStartDate = startDateStr;
    globalEndDate = endDateStr;

    const grid = document.getElementById('grid');
    grid.innerHTML = '';

    // Parse the ISO strings, correcting for local time so standard YYYY-MM-DD strings work as intended
    const startParts = startDateStr.split('-');
    const endParts = endDateStr.split('-');
    const startDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
    const endDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));

    // Total days
    const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Dynamic Title
    const titleOptions = { month: 'short', year: 'numeric' };
    const startStrTitle = startDate.toLocaleDateString(undefined, titleOptions);
    const endStrTitle = endDate.toLocaleDateString(undefined, titleOptions);
    const titleEl = document.getElementById('journey-title');
    if (titleEl) {
        titleEl.textContent = `STEM OPT: ${startStrTitle} - ${endStrTitle}`;
    }

    const todayRaw = new Date();
    const today = getMidnightDate(todayRaw);

    let pastCount = 0;

    for (let i = 0; i < totalDays; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(currentDay.getDate() + i);

        const div = document.createElement('div');
        div.classList.add('day');

        // Formatting for tooltip: e.g. "Feb 5, 2026"
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const dateString = currentDay.toLocaleDateString(undefined, dateOptions);
        div.setAttribute('data-date', dateString);

        // Tooltip logic
        div.addEventListener('mouseenter', (e) => showTooltip(e, dateString));
        div.addEventListener('mouseleave', hideTooltip);

        const checkMidnight = getMidnightDate(currentDay);

        if (checkMidnight.getTime() < today.getTime()) {
            div.classList.add('past');
            pastCount++;
        } else if (checkMidnight.getTime() === today.getTime()) {
            div.classList.add('today');
            // For display purposes we consider today as part of the progress
            pastCount++;
        }

        grid.appendChild(div);
    }

    const statsDisplay = document.getElementById('stats-display');
    // Update the stats: show pastCount out of totalDays
    statsDisplay.innerHTML = `Progress: <span>${pastCount}</span> / ${totalDays} Days`;

    // Calculate window size based on grid
    const columns = 21;
    const paddingX = 48; // 24px * 2
    const paddingY = 40; // 20px * 2
    const gapInGrid = 4;
    const rectSize = 10;
    const containerGap = 12;

    const header = document.querySelector('.header');
    const headerHeight = header ? header.getBoundingClientRect().height : 17;

    const rows = Math.ceil(totalDays / columns);
    const visibleRows = Math.min(rows, 55);

    const gridWidth = columns * rectSize + (columns - 1) * gapInGrid;
    const gridHeight = visibleRows * rectSize + Math.max(0, visibleRows - 1) * gapInGrid;

    const scrollbarWidth = rows > 55 ? 16 : 0; // 12px padding + 4px scrollbar

    // Calculate final size, round up to be safe
    const totalWidth = Math.ceil(paddingX + gridWidth + scrollbarWidth);
    const totalHeight = Math.ceil(paddingY + headerHeight + containerGap + gridHeight) + 1;

    ipcRenderer.send('resize-window', { width: totalWidth, height: totalHeight });
}

ipcRenderer.on('init-config', (event, config) => {
    generateGrid(config.startDate, config.endDate);
});

// Tooltip logic
const tooltipEl = document.getElementById('global-tooltip');

function showTooltip(e, text) {
    if (!tooltipEl) return;

    tooltipEl.textContent = text;
    tooltipEl.classList.add('visible');

    // Calculate position
    const rect = e.target.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();

    // Default: centered above the box
    let top = rect.top - tooltipRect.height - 8;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

    // If it goes off the top edge, put it below the box instead
    if (top < 8) {
        top = rect.bottom + 8;
    }

    // If it goes off the left edge, flush left
    if (left < 8) {
        left = 8;
    }
    // If it goes off the right edge, flush right
    else if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
}

function hideTooltip() {
    if (tooltipEl) {
        tooltipEl.classList.remove('visible');
    }
}

// Initial draw - removed because we wait for init-config from main.js

// Function to check if day changed, to update the grid gracefully
let lastCheckDay = new Date().getDate();

setInterval(() => {
    const currentDay = new Date().getDate();
    if (currentDay !== lastCheckDay) {
        lastCheckDay = currentDay;
        // Only regenerate if we have received dates
        if (globalStartDate && globalEndDate) {
            generateGrid(globalStartDate, globalEndDate);
        }
    }
}, 3600000); // Check every hour if the date changed

// Double click to close the widget
document.addEventListener('dblclick', () => {
    window.close();
});

# Windows Desktop Widget

A sleek, borderless, and transparent Windows desktop widget built with Electron. It displays a visual timeline from February 1st, 2026 to January 31st, 2028, tracking past days, highlighting the current day with a pulsing animation, and showing remaining days. 

## Features
- **Visual Grid**: A grid of days representing the timeframe block by block.
- **Dynamic Updates**: Automatically turns past days green and highlights the current day with a glowing blue effect.
- **Always on Desktop**: Behaves like a true widget—hiding from the taskbar (on Windows) and floating directly on your desktop.
- **Auto-Start**: Automatically starts on system boot (when running as a packaged app).
- **Quick Close**: Double-click anywhere on the widget to quickly close it.
- **Customizable Dates**: Set your own start and end dates via an external `config.json` file.

## Prerequisites
To run or build this widget from the source code, you must have:
- [Node.js](https://nodejs.org/) (which includes npm)
- Git (optional, for cloning the repository)

## Installation & Setup

1. **Clone the repository** (or download the ZIP and extract it):
   ```bash
   git clone https://github.com/sa1Kr15hna/stemcountdown.git
   cd stemcountdown
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Dates (Optional)**:
   By default, the widget runs from `2026-02-01` to `2028-01-31`. To customize this, create or modify a `config.json` file in the project's root directory:
   ```json
   {
       "startDate": "2026-02-01",
       "endDate": "2028-01-31"
   }
   ```

4. **Run the widget in development mode**:
   ```bash
   npm start
   ```

## Building the Executable (Packaging)

If you want to create a standalone `.exe` that you can run without a terminal, or if you want the widget to launch automatically at startup:

1. **Run the build script**:
   ```bash
   npm run build
   ```

2. After the build finishes, a new folder named `dist` will appear.
3. Open `dist/new-project-win32-x64/` (the exact name may vary based on your system).
4. Run `new-project.exe` to launch your widget independently.

*(Note: When running the packaged `.exe`, the application is configured to automatically launch on system startup).*

## Deployment & Custom Configuration
When deploying the packaged widget to other users, they can customize their own dates without modifying the source code.
To do this, simply place a `config.json` file inside the exact same folder as the `.exe` file (i.e., inside `dist/new-project-win32-x64/`). The widget will automatically read the `startDate` and `endDate` from this file upon startup.

## Customization
- **Dates**: Create or edit the `config.json` file next to your executable (or in the root folder during development).
- **UI & Styling**: Modify `index.html`'s CSS block to adjust colors, glassmorphism blur effects, animations, or widget size.
- **Window Properties**: Tweak `main.js` to enable or disable features like dragging, window transparency, drop-shadows, or "always on top" behavior.

## License
ISC

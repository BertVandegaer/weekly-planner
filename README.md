# Weekly Planner App

A drag-and-drop weekly planner with persistent storage.

![Screenshot](screenshot.png)

## Features
- Drag and drop tasks between days
- Adjustable task durations
- Mobile responsive
- Local storage persistence
- Add/delete tasks

## Deployment

### 1. Render.com
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

Or manually:
1. Create new Web Service
2. Connect GitHub repository
3. Set configuration:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Deploy!

### 2. Local Development
```bash
git clone https://github.com/YOUR-USERNAME/weekly-planner.git
cd weekly-planner
npm install
npm start
```
Open http://localhost:3000

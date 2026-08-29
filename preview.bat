@echo off
REM Double-click this to preview the site locally.
REM Pages use clean URLs (/en/services/), which need a server to resolve —
REM opening the .html files straight from the folder shows a file listing.

cd /d "%~dp0"
start "" http://localhost:5500/en/
node preview.mjs
pause

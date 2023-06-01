@echo off
@REM Start Sass watch
start "Git Bash" "G:\Program Files\Git\git-bash.exe" -c "sass --watch 'C:\Zuitt Bootcamp\batch-248\capstone-3-tajos\sass\App.scss' 'C:\Zuitt Bootcamp\batch-248\capstone-3-tajos\src\App.css'"
@REM Start react app
start "Git Bash" "G:\Program Files\Git\git-bash.exe" -c "npm start"
@REM Start local server for the API
start "Git Bash" "G:\Program Files\Git\git-bash.exe" -c "cd 'C:\Zuitt Bootcamp\batch-248\capstone-2-tajos'; npm start"
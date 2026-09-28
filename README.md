# Cybersecurity Training Lab (local)

Instagram-style login UI for **authorized classroom cybersecurity awareness training** only.
Runs entirely on your computer via `start.bat`. No cloud hosting required.

## Requirements

- Windows
- Node.js LTS (https://nodejs.org/)
- Python 3.10+ (with “Add Python to PATH” enabled)

## Start the lab

1. Extract this folder anywhere.
2. Double-click **`start.bat`**.
3. Wait until both backend and frontend have started.
4. Open your browser to: **http://127.0.0.1:5173/**

If something fails, the batch file prints a clear error. Fix it and run `start.bat` again.

## Stop the lab

- Close the terminal windows, or  
- Double-click **`STOP_LAB.bat`** to free ports 5000 and 5173.

## How submissions are recorded

When someone presses **Log in**, the backend:

1. Accepts any non-empty username and password.
2. Appends the values to files on **your computer**:
   - `backend/data/submissions.txt` — plain text (open in Notepad)
   - `backend/data/submissions.csv` — open in Excel
3. Also stores a training event in the local SQLite database (`backend/data/lab.db`).

Example line in `submissions.txt`:

```
[2026-09-28 12:00:00 UTC]  session_id=1  username=student01  password=demo-pass
```

**Authorized training only:**

- Use only with informed participants in a controlled classroom/lab setting.
- Do **not** ask people for real Instagram/Facebook/email passwords.
- Do **not** expose this app to the public internet.
- The lab binds to `127.0.0.1` only.

## After a successful login

The browser redirects to the awareness Reel URL set in `src/config.ts` (`POST_LOGIN_REDIRECT_URL`).

## Project layout

```
qwertyproject_ig3/
├── start.bat                 ← double-click to start
├── STOP_LAB.bat
├── package.json
├── src/                      ← React UI
│   ├── api/labApi.ts         ← talks to http://127.0.0.1:5000/api
│   ├── components/landing/   ← login screen
│   └── context/AuthContext.tsx
├── backend/
│   ├── app.py                ← Flask on 127.0.0.1:5000
│   ├── config.py             ← local SQLite settings
│   ├── models.py
│   ├── init_db.py
│   ├── requirements.txt
│   ├── routes/api.py
│   ├── services/lab_service.py
│   └── data/                 ← created on first run
│       ├── lab.db
│       ├── submissions.txt   ← open in Notepad
│       └── submissions.csv
└── README.md
```

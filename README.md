# 10X CRM

A lightweight customer relationship management app built with **Vanilla JavaScript**, HTML, and CSS. It helps sales teams organize client records, track deal stages, record notes, and review pipeline activity.

## Features

- Sign up and log in with field validation
- Persistent browser session and protected application pages
- Dashboard with sales statistics, pipeline overview, live clock, and recent clients
- Client list loaded from the DummyJSON API
- Add and delete clients through API requests
- Search, status filters, and sorting
- Client detail modal, dated notes, and follow-up reminders
- Profile editing, password changes, and CRM data reset
- Dark and light themes
- Responsive layout for desktop and mobile

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Browser localStorage
- Fetch API and async/await
- [DummyJSON](https://dummyjson.com/docs/users)

## How to Run

1. Download or clone this repository.
2. Open the project folder in a terminal.
3. Start a local static server. For example, with Node.js:

   ```bash
   npx serve .
   ```

   Or use the VS Code Live Server extension.
4. Open the local URL printed by the server.

> Do not open the HTML file directly with `file://`; ES modules and API requests work best through a local HTTP server.

## Data Storage

The application uses these required localStorage keys:

- `crm_users` — registered user records
- `crm_session` — current signed-in session
- `crm_clients` — client records and notes
- `crm_theme` — selected `dark` or `light` theme

DummyJSON is a demo API. Its POST and DELETE endpoints simulate write operations and do not persist changes on the remote server. The app stores the working client list locally so it survives browser refreshes on the same browser and origin.

## Security Note

This is an educational, frontend-only project. Passwords are stored in localStorage in plain text to match the supplied learning specification. **This is not safe for production.** A real application must authenticate on a server, hash passwords with a suitable password-hashing algorithm, and use secure session handling.

## Live Demo

Not deployed yet. Deploy this folder to Netlify or Vercel, then replace this line with the public URL.

## Test Account

Create an account from the Sign Up page, then log in with the email and password you registered.

## Credits

Built as an individual learning project based on the supplied 10X CRM project requirements. DummyJSON provides sample user data.

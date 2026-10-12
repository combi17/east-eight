# East Eight

Website for Premium East8, a Bucharest real estate agency that works mostly with office and retail space and has started listing properties in Dubai. The site is in Romanian, with an English toggle for the main navigation and the About page.

![Home page](docs/home.png)

| Listings | Contact |
| --- | --- |
| ![Listings with filters](docs/properties.png) | ![Contact page](docs/contact.png) |

## Features

- Listings page with filters for property type, transaction type, city and neighbourhood, price, surface, rooms and year built. Filters live in the URL, so a filtered search can be bookmarked or shared.
- List, map and split views. The map uses Mapbox GL and is loaded only when one of the map views is opened, which keeps the main bundle around 380 KB.
- Property page with a photo grid, a fullscreen gallery (keyboard arrows, Escape, scroll-to-zoom), a location map and a link that opens the contact form with the property already filled in.
- Sold and rented listings stay visible with a status badge.
- Contact form sent through Formspree, with a GDPR consent checkbox and a privacy and terms page.
- Romanian and English translations with i18next.
- Light and dark themes, with a switch in the header (details below).

## Light and dark themes

| Light | Dark |
| --- | --- |
| ![Listings in the light theme](docs/properties.png) | ![Listings in the dark theme](docs/properties-dark.png) |

- The site starts in the visitor's system theme. Once they use the switch in the header (or in the mobile menu), their choice is saved in `localStorage` and kept on later visits.
- A small inline script in `index.html` sets the theme before the page renders, so a dark-mode visitor never sees a white flash on load.
- Colors are semantic tokens in `src/index.css` (`--bg`, `--surface`, `--text`, `--accent` and so on), defined once for each theme. Components only use the tokens, so a theme is one block of variables.
- The dark palette is built from the brand navy. Cards and panels get lighter as they sit higher, and text and buttons keep at least 4.5:1 contrast in both themes.
- Switching uses the View Transitions API: the new theme spreads out in a circle from the button. Browsers without that API, and visitors with reduced motion turned on, get an instant switch.
- Maps change to Mapbox's dark style along with the rest of the page.
- `src/lib/theme.js` holds the theme state. It exposes a `useTheme()` hook, built on `useSyncExternalStore`, for components that need to react to the theme (the map uses it).

## Stack

React 19, React Router 7, Vite, Supabase (Postgres) for listings, Mapbox GL, Formspree, i18next, lucide-react.

## Running locally

```bash
npm install
npm run dev
```

The site runs without any configuration. If Supabase isn't set up, it reads the sample listings in `src/data/sampleProperties.js`. The three Bucharest offices there are real listings from east8.ro; the Dubai ones are placeholders.

To connect the real services, copy `.env.example` to `.env` and fill in the keys you need:

| Variable | Used for |
| --- | --- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Reading listings from the `properties` table |
| `VITE_MAPBOX_TOKEN` | Map views on the listings and property pages |
| `VITE_FORMSPREE_FORM_ID` | Contact form submissions |

## Project structure

```
src/
  components/   Header, footer, cards, map, gallery, dropdown
  pages/        Home, listings, property details, about, contact, privacy
  lib/          Supabase client and listing queries (with the local fallback)
  data/         Filter options, agency details, sample listings
public/
  listings/     Photos for the sample listings
  locales/      Translation files
```

## Deployment

`vercel.json` rewrites every route to `index.html`, so client-side routes work on Vercel. Add the same environment variables in the Vercel project settings.

# MindScore — AI Powered Mental Health Prediction (Frontend)

A premium, production-ready SaaS-style frontend for an AI-powered mental
health score predictor. Built with **hand-written HTML5, CSS3, and vanilla
JavaScript (ES6+) only** — no frameworks, no build step, no dependencies
beyond a Google Font.

---

## Project Structure

```
MentalHealthPrediction/
│
├── index.html              # Single-page app: nav, hero, features, form, result, about, footer
│
├── css/
│   ├── style.css            # Design tokens, layout, and all component styling
│   ├── responsive.css        # Media queries (desktop → laptop → tablet → mobile)
│   └── animations.css        # Keyframes and scroll/interaction animation classes
│
├── js/
│   ├── utils.js               # Shared helpers (querying, debounce, number tweening, theme storage)
│   ├── validation.js          # Form validation rules only — no DOM writes, no fetch
│   ├── api.js                  # Talks to the FastAPI /predict endpoint only
│   └── app.js                   # UI wiring: navbar, theme, reveals, form flow, result rendering
│
├── assets/
│   ├── logo.svg
│   ├── hero.svg
│   ├── mental-health.svg
│   └── bg-pattern.svg
│
└── README.md
```

Each JS file has a single responsibility, as requested:
- **`api.js`** — fetch calls and payload shaping, nothing else.
- **`validation.js`** — pure validation functions, nothing else.
- **`utils.js`** — small reusable helpers shared by the other files.
- **`app.js`** — everything UI-related: it imports the above via global
  namespaces (`MindScoreAPI`, `MindScoreValidation`, `MindScoreUtils`) and
  wires them to the DOM.

---

## Features

- Glassmorphic hero, feature cards, and prediction/result cards
- Animated gradient blobs + subtle grain background
- Sticky navbar with scroll-aware background and active-link tracking
- Dark / light mode toggle with `localStorage` persistence
- Typing animation on the hero headline
- Animated counters for hero stats and the final score
- Floating background shapes, custom cursor (desktop only), magnetic buttons
- Ripple effect on primary buttons, 3D tilt on feature cards
- Scroll-triggered reveal animations (`IntersectionObserver`)
- Fully custom prediction form with floating labels, inline validation,
  shake-on-error, and per-field error messages
- Loading button state, skeleton loading state for the result card
- Circular animated progress ring with color-coded score tiers
- Toast notifications for success and error states
- Sticky, custom-styled scrollbar
- Back-to-top button
- Fully responsive: desktop, laptop, tablet, mobile — no horizontal scroll
- Semantic HTML5, ARIA labels, visible focus states, `prefers-reduced-motion`
  support
- SEO meta tags + Open Graph tags

---

## Installation

No build tools, no `npm install`. This is a static site.

1. Download / clone the `MentalHealthPrediction` folder.
2. Open `index.html` directly in a browser, **or** serve it locally
   (recommended, so `fetch()` behaves exactly like production):

   ```bash
   cd MentalHealthPrediction
   python -m http.server 5500
   ```

   Then visit `http://127.0.0.1:5500`.

---

## How to Connect Your FastAPI Backend

The frontend expects a FastAPI server running at:

```
POST http://127.0.0.1:8000/predict
```

**Request body:**

```json
{
  "Age": 20,
  "Gender": "Male",
  "Country": "India",
  "Academic_Level": "Undergraduate",
  "Most_Used_Platform": "Instagram",
  "Purpose_Of_Use": "Entertainment",
  "Avg_Daily_Usage_Hours": 5,
  "Daily_Unlocks": 70,
  "Study_Hours": 6,
  "Physical_Activity_Hours": 2,
  "Sleep_Hours_Per_Night": 7,
  "Stress_Level": "Medium"
}
```

**Expected response:**

```json
{
  "predicted_Mental_Health_Score": 81.46
}
```

### Enable CORS on the FastAPI side

Since the frontend and API run on different origins during local
development, enable CORS in your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # restrict this in production
    allow_methods=["POST"],
    allow_headers=["*"],
)
```

To point the frontend at a different host/port, change the single
`ENDPOINT` constant at the top of **`js/api.js`**:

```js
const ENDPOINT = 'http://127.0.0.1:8000/predict';
```

---

## How to Run

1. Start your FastAPI backend on `127.0.0.1:8000` with the `/predict`
   route described above.
2. Serve or open `index.html` as described in **Installation**.
3. Scroll to the **Predict** section, fill in the 12 fields, and submit.
   The result card will animate in with your predicted score, a color-coded
   tier, and a short interpretation.

---

## Score Interpretation

| Score Range | Tier                     |
|-------------|--------------------------|
| 90+         | Excellent Mental Wellness |
| 75 – 89     | Healthy Lifestyle         |
| 60 – 74     | Moderate Risk             |
| 40 – 59     | Needs Attention           |
| Below 40    | High Risk                 |

These tiers and their colors/messages are defined in the `TIERS` array
near the bottom of `js/app.js` — edit them there to change wording,
thresholds, or colors.

---

## Customization

- **Colors** — all defined as CSS custom properties at the top of
  `css/style.css` under `:root` (and overridden under `[data-theme="dark"]`).
  Change `--color-primary`, `--color-secondary`, etc. to re-theme the whole
  site.
- **Fonts** — swap the Google Fonts `<link>` in `index.html` and update
  `--font-display` / `--font-mono` in `css/style.css`.
- **Dropdown options** — edit the `<option>` lists in the `#predict` form in
  `index.html`. Keep the `value` attributes matching what your backend
  expects.
- **Validation rules** — edit the `RULES` object in `js/validation.js`.
- **Endpoint** — edit `ENDPOINT` in `js/api.js`.

---

## Accessibility

- Semantic landmarks (`header`, `main`, `section`, `footer`)
- Skip-to-content link
- Every form control has an associated `<label>`
- Live regions (`aria-live`) on the result card and toast container
- Visible keyboard focus rings on all interactive elements
- Respects `prefers-reduced-motion` — animations are disabled for users who
  request it

---

## Screenshots

_Add screenshots of the hero section, the prediction form, and the animated
result card here before publishing to your portfolio._

```
screenshots/
├── hero.png
├── predict-form.png
└── result-card.png
```

---

## Disclaimer

MindScore is a data science and frontend **portfolio project**. It is not a
medical device and does not provide a clinical diagnosis.

## License

Free to use and modify for personal, educational, and portfolio purposes.

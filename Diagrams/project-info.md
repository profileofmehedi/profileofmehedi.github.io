# UPAY Bank Loan Origination — Interactive Diagram

Single-file presentation of how a digital loan moves from the UPAY app to a partner bank CBS and back into the customer’s MFS wallet.

**Entry file:** `upay_loan_flow.html`  
**How to run:** open the HTML file in a browser (Chrome / Edge). No build step, no server required. Font Awesome and Google Fonts load from CDN.

---

## Purpose

This is a stakeholder demo, not a live integration. It shows, in one screen:

- what the customer sees on the phone
- which system talks to which system
- which API / CBS call is happening at that moment
- that money is not disbursed until OTP confirmation

Use it in architecture reviews, bank partnership sessions, and product walkthroughs.

---

## Layout

| Panel | Role |
| --- | --- |
| Left — phone mockup | Customer journey (6 screens) |
| Right — sequence diagram | 5 participants, 13 messages |
| Below the diagram | Step story + API inspector |
| Bottom controls | Play / pause / replay, previous / next, progress dots |

Phone and diagram stay in sync. Changing a step updates the screen, highlighted arrows, glowing participants, activation bars, phase chip, inspector payload, and phone glow/loading.

On viewports below ~1180px the layout stacks: phone first, diagram below.

---

## Participants

| Lane | System | Meaning in this demo |
| --- | --- | --- |
| Customer | Person | Mehedi Hasan, UPAY wallet user |
| UPAY App | Mobile channel | UI, OTP, amount / bank selection |
| UPAY Backend | Orchestrator | Eligibility, partner list, footprint, correlation ID |
| Bank Channel | Bank middleware | Receives UPAY initiation, talks to CBS |
| Bank CBS | Core banking | Temp account, final loan account, disbursement |

Role filter (All / Customer / Backend / Bank) dims lanes that are not in that slice. Clicking a participant icon also toggles its role view.

---

## Demo data

| Field | Default | Notes |
| --- | --- | --- |
| Customer | Mehedi Hasan | Wallet starts at **BDT 12,450** |
| MSISDN (masked) | 017***894 | OTP destination |
| Product | Digital Loan | Instant eligibility + partner bank |
| Max limit | BDT 5,00,000 | Score band **A** |
| Default amount | BDT 1,00,000 | Slider range 10,000 – 5,00,000, step 5,000 |
| Correlation ID | `corr_9f2a18` | Written at initiate |
| Temp account | `TEMP-LN-9928341` | Before OTP |
| Demo OTP | `4821` | Autofilled when entering step 5 |
| Final account | `LN-PRIME-0012938` or `LN-CITY-0012938` | Depends on selected bank |

### Partner banks

| Bank | Rate | Max tenure | Code |
| --- | --- | --- | --- |
| Prime Bank | 9.0% | 36 months | `PRIME` |
| City Bank | 9.5% | 24 months | `CITY` |

EMI uses the standard reducing-balance formula:

`EMI = P × r × (1+r)^n / ((1+r)^n − 1)` where `r = annualRate / 12 / 100`.

Selecting a bank updates rate, allowed tenure, EMI, inspector payloads, temp-bank copy, final loan ID, and wallet credit (`12,450 + amount`).

---

## Journey (6 steps)

Phases: **Eligibility** (1–2) → **Bank** (3) → **Footprint** (4–5) → **Disburse** (6).

| Step | Phone screen | Loading overlay | What happens |
| --- | --- | --- | --- |
| 1 | Home — wallet, pre-approval toast, Digital Loan card | — | Customer opens the product |
| 2 | Eligibility — BDT 5,00,000 limit | Checking eligibility… | Backend returns instant limit |
| 3 | Partner banks — Prime / City | Fetching partner banks… | User picks a bank (choice sticks) |
| 4 | Amount slider, tenure chips, live EMI | Creating footprint… | App submits; backend calls bank channel |
| 5 | Temp ID + 4-digit OTP | Talking to the partner bank… | CBS opens a pending account; OTP challenge |
| 6 | Success + confetti | Finalizing with CBS… | Final loan ID; amount credited to wallet |

Going forward shows the loading overlay (~820ms) and a gold/violet glow on the phone. Going backward skips loading. Replay resets bank, amount, tenure, OTP, and wallet to defaults.

---

## Sequence messages

Request arrows are solid. Responses are dashed green. The packet dot animates only on the active step.

| ID | Step | From → To | API shown in inspector | Status |
| --- | --- | --- | --- | --- |
| m1 | 1 | Customer → App | `UI · openProduct("DIGITAL_LOAN")` | SUCCESS |
| m2 | 2 | App → Backend | `GET /v1/loans/eligibility` | SUCCESS |
| m3 | 2 | Backend → App | `200 · EligibilityDecision` | SUCCESS |
| m4 | 3 | App → Backend | `GET /v1/loans/partner-banks` | SUCCESS |
| m5 | 3 | Backend → App | `200 · BankProductList` | SUCCESS |
| m6 | 4 | Customer → App | `UI · submitApplication()` | SUCCESS |
| m7 | 4 | App → Backend | `POST /v1/loans/initiate` | PENDING |
| m8 | 4 | Backend → Channel | `POST /bank/channel/footprint` | PENDING |
| m9 | 5 | Channel → CBS | `CBS · openTempLoanAccount` | PENDING |
| m10 | 5 | CBS → Channel | `CBS · TempAccountCreated` | PENDING |
| m11 | 5 | Channel → App | `200 · InitiationReceipt` | PENDING |
| m12 | 6 | App → CBS | `POST /v1/loans/finalize` | SUCCESS |
| m13 | 6 | CBS → Customer | `CBS · DisbursementComplete` | SUCCESS |

Click a message to jump to its step and load that payload in the inspector. Inspector JSON is live: amount, bank code, OTP, and final account ID follow current UI state.

These paths are **illustrative** for the story. They are not a published UPAY contract.

---

## Interaction

### Playback

- **Play / Pause** — autoplay, ~2.6s dwell after each step (plus loading)
- **Replay** — reset demo state, stay on step 1 (keeps playing if autoplay was on)
- **Previous / Next** — Next is disabled on step 6; Previous is disabled on step 1
- **Progress dots** — jump to any step
- **Phase chips** — jump to the first step of that phase
- Phone **back** chevrons go to the previous step
- Phone CTAs (Digital Loan, Check partner banks, Continue, Submit, Confirm OTP, Back to home) drive the same step machine

Manual phone interaction (slider, bank tap, OTP typing) pauses autoplay so the presenter can talk.

### Keyboard

| Key | Action |
| --- | --- |
| `Space` | Play / pause |
| `←` / `→` | Previous / next |
| `1`–`6` | Jump to step |
| `R` | Replay |
| `F` | Present (fullscreen) |
| `?` | Shortcut overlay |
| `Esc` | Close overlay / exit fullscreen |

Ignored while focus is inside an OTP input.

### Presentation chrome

- **Gold / Violet** — accent theme for UPAY gold vs bank-purple storytelling
- **Present** — fullscreen + tighter header
- Particle canvas + grid overlay on the page background
- `prefers-reduced-motion` turns off animations

---

## How the code is structured

Everything lives in `upay_loan_flow.html` (markup, CSS, script).

Important JS objects:

- `BANKS` — partner product catalog
- `LANES` — diagram columns (`x` is percent position)
- `PHASES` / `STEPS` — story copy, loading text, default inspector message
- `MESSAGES` — sequence rows (`from` / `to` are lane indexes 0–4)
- `state` — `step`, `playing`, `busy`, `bank`, `amount`, `tenure`, `inspect`

Core functions:

- `goToStep(step, opts)` — single source of truth for navigation (`skipLoading`, `fromUser`, `force`)
- `updateMoneyUI()` — EMI, labels, bank cards, loan IDs, wallet
- `payloadFor(msg)` — inspector body for the selected message
- `highlightDiagram()` — arrows, activation bars, participant glow, phase + dots
- `resetJourney(playAfter)` — full demo reset

To add a bank, extend `BANKS` and the two cards on screen 3. To add a sequence hop, append `MESSAGES` and map it to a step in `STEPS`.

---

## Visual language

| Token | Value |
| --- | --- |
| UPAY gold | `#FFC107` |
| Navy | `#12192C` |
| Bank purple | `#7C4DFF` |
| Success | `#00E676` |
| Typeface | Plus Jakarta Sans |
| Phone frame | iPhone-style (dynamic island, status bar, home indicator) |

---

## Out of scope

- Real UPAY / bank APIs, auth, or CBS connectivity
- Credit decisioning logic (limit is a fixed demo value)
- Rejection / retry paths
- Localization (UI copy is English)
- Persistence (refresh resets the demo)

---

## Suggested walkthrough (2–3 minutes)

1. Start on home. Point at the wallet and pre-approval toast, then hit **Play** (or tap Digital Loan).
2. On eligibility, show the inspector `GET /v1/loans/eligibility`.
3. On banks, switch to City Bank and say the rest of the flow follows the choice.
4. Drag the amount slider; EMI and later payloads change.
5. Pause on OTP: temp ID exists, money has **not** moved.
6. Confirm / next: confetti, `LN-…` account, wallet = 12,450 + amount.
7. Optional: role filter **Bank** to isolate channel + CBS, then **Present** for fullscreen.

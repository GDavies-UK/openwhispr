# Private build: meeting notes on your own devices

This fork builds OpenWhispr as a **private meeting note taker** for an iPhone and a laptop.
It records meetings, writes a word-for-word transcript, labels who is speaking, and writes
minutes with decisions and action items, all on your own devices. It is styled to match
Bus Tools.

## What's different from stock OpenWhispr

### iPhone app (`openwhispr-mobile/`)

- **No tracking or payments.** Sentry (crash reports), AppsFlyer (ad attribution), the App
  Tracking Transparency prompt, Superwall (paywall), RevenueCat (in-app purchases) and
  over-the-air updates (expo-updates) are removed, with their packages and config.
- **No account.** Every install is a guest. The app never opens an OpenWhispr server session.
- **Shorter setup.** Welcome → microphone → language → on-device model download →
  notifications. There's no Cloud choice, paywall, account step or tracking prompt.
- **Every feature unlocked.** Paywall checks always let you through.
- **Bus Tools style, light and dark.** Follows the phone's appearance: the Bus Tools dark
  palette or its light one (pale blue-grey page, white cards), always with the Bus Tools red
  accent and teal second accent, in Space Grotesk. The colours are in
  `src/config/colors.ts` (`BUS_TOOLS`, `BUS_TOOLS_LIGHT`) and `global.css`.

The switch is `PRIVATE_BUILD` in `openwhispr-mobile/src/config/privateBuild.ts`.

### Laptop app (repo root)

- **No auto-updates.** The stock updater installs official OpenWhispr releases, which would
  replace this build. Turned off with `PRIVATE_BUILD` in `src/config/privateBuild.js`.
- **No plans or upgrade prompts.** The "Upgrade to Pro" card, the free-trial card and the
  Plan & Billing section are hidden (`PRIVATE_BUILD` in `src/config/privateBuildUi.ts`).
- **Bus Tools style, light and dark.** `src/styles/busTools.css` loads after the stock theme.
  It follows the computer's appearance until you pick Light or Dark in Settings. Bus Tools red
  and teal, Space Grotesk headings, Inter body text, IBM Plex Mono for code.
- Telemetry was already off by default. Don't sign in, and nothing goes to OpenWhispr's servers.

## Install on your iPhone

You need a Mac with **Xcode 26.2 or newer** and a **paid Apple Developer account**
($99/year). A free account can't sign the app's keyboard and Live Activity extensions.

```bash
cd openwhispr-mobile
npm install
cp .env.example .env.local
bundle install
```

In `.env.local`, give the app identifiers that belong to you (any reverse-domain name):

```dotenv
OPENWHISPR_IOS_BUNDLE_IDENTIFIER=uk.co.bustools.meetings
OPENWHISPR_SCHEME=bustools-meetings
OPENWHISPR_DISPLAY_NAME=Meeting Notes
OPENWHISPR_KEYBOARD_DISPLAY_NAME=Meeting Notes
```

Leave the Sentry, AppsFlyer, Superwall and RevenueCat keys empty. Nothing reads them any more.

```bash
npm run prebuild:dev -- --clean
open ios/*.xcworkspace
```

In Xcode, pick your team under *Signing & Capabilities* for the three targets (the app,
`OpenWhisprKeyboard` and `OpenWhisprActivity`). Then plug in the iPhone and run:

```bash
npm run ios -- --device
```

For a copy that stays installed without the Mac, archive it in Xcode
(*Product → Archive*) and send it to TestFlight.

### First run

1. Allow the microphone, pick your language, and let it download the speech model.
2. Notes → **+** → **Record meeting**. The first time, it asks to download the speaker model.
3. Lock the phone if you like. Recording carries on, and the Lock Screen shows a timer and an
   End button.
4. Press Stop. The phone writes the transcript, labels the speakers and writes the minutes.
5. Optional: set up your voice under Notes → **Voice Profiles**, so the transcript uses your name instead of
   "Speaker 1".

Writing the minutes on the phone needs **Apple Intelligence**: an iPhone 15 Pro or later on
iOS 26+. Without it, the transcript and speaker labels still work. For the minutes you can
set **AI Models → note formatting** to **Custom** and point it at a model server on your own
network (not tested on this build yet).

## Build the laptop app

Use Node 24 (`.nvmrc`).

```bash
npm install
npm run pack            # unsigned app in dist/ for this computer
```

On Windows, make an installer with the unsigned config (the stock config requires a
code-signing certificate):

```bash
npm run prebuild:win
npm run build:win -- --publish never --config electron-builder.unsigned-win.json
```

### First run

Skip signing in. Under **Settings → AI Models**, pick **Local** for speech-to-text and for
the AI model, and download one of each. Start a meeting note to record your mic and the
call audio (Teams, Zoom). Afterwards, generate the AI summary for minutes and actions.

## Keeping up with OpenWhispr

Each change is behind a `PRIVATE_BUILD` check or in its own file (`busTools.css`, the
do-nothing replacements in `openwhispr-mobile/src/lib/`). Merging upstream OpenWhispr later
should mostly conflict only in those places.

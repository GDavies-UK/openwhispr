# Ding Ding: private meeting notes on your own devices

This fork builds OpenWhispr as a **private meeting note taker** for an iPhone and a laptop.
It records meetings, writes a word-for-word transcript, labels who is speaking, and writes
minutes with decisions and action items, all on your own devices. It is styled to match
Bus Tools.

## The name and icon

Both apps are called **Ding Ding**, after the conductor's two rings to the driver: all
aboard, safe to go. The icon is a bell push ringing on both sides, on a Bus Tools red tile.

- **Artwork:** `src/assets/logo.svg` is the master. The laptop's `icon.ico`, `icon.png`,
  `icon.icns` and Mac menu-bar `iconTemplate@3x.png`, and the phone's `assets/icon.png`,
  `adaptive-icon.png` and `favicon.png`, are rendered from the same drawing. The in-app
  marks (`BrandMarkIcon` on the laptop, `OpenWhisprMark` on the phone) draw it too.
- **Laptop:** `productName` is Ding Ding, so the window, installer, shortcuts and taskbar
  say Ding Ding. Its data folder stays `%APPDATA%\OpenWhispr`, so an install made before
  the rename keeps its notes, settings and models.
- **Phone:** the name under the icon defaults to Ding Ding (`OPENWHISPR_DISPLAY_NAME`
  overrides it).
- **Text:** the app's own name reads Ding Ding in every language. Mentions of
  OpenWhispr's services (its Cloud, account, API, support and licence credits) still say
  OpenWhispr, because that is who they refer to.

## What's different from stock OpenWhispr

### iPhone app (`openwhispr-mobile/`)

- **No tracking or payments.** Sentry (crash reports), AppsFlyer (ad attribution), the App
  Tracking Transparency prompt, Superwall (paywall), RevenueCat (in-app purchases) and
  over-the-air updates (expo-updates) are removed, with their packages and config.
- **No account.** Every install is a guest. The app never opens an OpenWhispr server session.
- **Shorter setup.** Welcome → microphone → language → on-device model download →
  notifications. There's no Cloud choice, paywall, account step or tracking prompt.
- **Every feature unlocked.** Paywall checks always let you through.
- **The phone records, the laptop does the work.** A meeting recorded on the phone is saved
  as it is, with no transcription on the phone and no model needed. The meeting's note
  offers **Send to laptop** (AirDrop, or Save to Files for iCloud Drive or OneDrive), and
  **Transcribe on this iPhone instead** as a fallback.
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
OPENWHISPR_IOS_BUNDLE_IDENTIFIER=uk.co.bustools.dingding
OPENWHISPR_SCHEME=dingding
```

Leave the Sentry, AppsFlyer, Superwall and RevenueCat keys empty. Nothing reads them any more.

```bash
npm run prebuild:dev -- --clean
open ios/*.xcworkspace
```

In Xcode, pick your team under _Signing & Capabilities_ for the three targets (the app,
`OpenWhisprKeyboard` and `OpenWhisprActivity`). Then plug in the iPhone and run:

```bash
npm run ios -- --device
```

For a copy that stays installed without the Mac, archive it in Xcode
(_Product → Archive_) and send it to TestFlight.

### First run

1. Allow the microphone, pick your language, and let it download the speech model. Meetings
   don't need it; dictation and the on-phone fallback do.
2. Notes → **+** → **Record meeting**. Give the meeting a title if you like (or pick it from
   your calendar). The title travels to the laptop with the recording.
3. Lock the phone if you like. Recording carries on, and the Lock Screen shows a timer and an
   End button.
4. Press Stop. The recording is saved on the phone (about 115 MB an hour) and the meeting's
   note shows **Send to laptop**.

## A meeting, start to finish

1. **Record on the phone** as above, typing notes during the meeting if you want.
2. **Send it to the laptop.** Open the meeting's note → **Send to laptop**:
   - **Mac:** choose AirDrop and your Mac. It lands in Downloads.
   - **Windows:** choose _Save to Files_ → OneDrive (or iCloud Drive), then open it from the
     OneDrive folder on the laptop.

   The file is named `<meeting title> (YYYY-MM-DD HH.MM).wav`. The recording stays on the
   phone, so you can send it again.

3. **On the laptop**, open **Upload** in the sidebar and choose the file. It transcribes
   on the laptop, separates the speakers (on by default in this build; the first time it
   downloads the speaker models) and saves a note named after the meeting.
4. Open the note and choose **Generate AI Summary** for the minutes, decisions and action
   items. With a local AI model selected, this also stays on the laptop.
5. Rename the speakers in the transcript once ("Speaker 1" → a name); the minutes use the
   names from then on.

Notes you typed on the phone stay on the phone. To bring them across, use the note's
**Share** menu to export them as text.

## Build the laptop app

### Windows: the one-button installer (no tools needed)

On GitHub, open your fork → **Actions** → **Private Windows installer** → **Run workflow**.
After about 20 minutes, the run's page has a **windows-installer** download: a zip holding
`OpenWhispr Setup <version>.exe`. Unzip it and run it on the laptop.

- The installer isn't code-signed, so Windows shows "Windows protected your PC" the first
  time: **More info** → **Run anyway**. A work-managed laptop may block it; ask IT.
- If **Actions** shows a notice about workflows on forks, enable them first.
- **Run workflow** only appears once this branch is merged into the fork's default branch.
  Until then, the workflow runs whenever its own file changes on this branch.

### Building it yourself

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
the AI model, and download one of each. Then:

- **Phone recordings:** **Upload** → choose the file (see _A meeting, start to finish_).
- **Calls on the laptop (Teams, Zoom):** start a meeting note there instead. It records your
  mic and the call audio directly.

Either way, **Generate AI Summary** on the note writes the minutes and actions.

## GitHub Actions in this fork

OpenWhispr's own workflows (its signed release build, helper-binary builds, code scanning,
phone checks and AI canaries) no longer run on their own: a push to `main` or a pull request
would otherwise start release builds that fail without OpenWhispr's signing keys and use up
Actions minutes. Each can still be run by hand from **Actions**. Left as they were: the
version-tag release workflow, the two packaging jobs that run when a GitHub release is
published, and the lockfile check on pull requests.

## Keeping up with OpenWhispr

Each change is behind a `PRIVATE_BUILD` check or in its own file (`busTools.css`, the
do-nothing replacements in `openwhispr-mobile/src/lib/`). Merging upstream OpenWhispr later
should mostly conflict only in those places.

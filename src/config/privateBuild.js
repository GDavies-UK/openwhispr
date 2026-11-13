// This is a private build of the desktop app, made from a fork. It must never
// replace itself with an official OpenWhispr release, so the auto-updater is
// off (src/updater.js), and it opens in the Bus Tools dark theme.
//
// Kept as one flag so the places that branch on it are easy to find.
const PRIVATE_BUILD = true;

module.exports = { PRIVATE_BUILD };

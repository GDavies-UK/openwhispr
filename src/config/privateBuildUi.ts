// Renderer side of the private build (main reads src/config/privateBuild.js;
// keep the two in step). No OpenWhispr plan, trial or billing is offered here.
//
// Tests of the stock OpenWhispr behaviour set globalThis.__OPENWHISPR_STOCK_UI__
// before loading the module under test; nothing in the app sets it.
export const PRIVATE_BUILD =
  (globalThis as { __OPENWHISPR_STOCK_UI__?: boolean }).__OPENWHISPR_STOCK_UI__ !== true;

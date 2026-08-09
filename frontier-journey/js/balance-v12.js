/*
 * Frontier Journey V1.2 balance profile
 *
 * Why this is a separate layer:
 * - The 1990 DOS reference established the interaction cadence and a known
 *   starting economy/loadout.
 * - Automated tuning then tested Frontier Journey's own simulation rather than
 *   blindly copying every classic number.
 * - Keeping these values together makes future AutoResearch-style experiments
 *   reviewable and reversible.
 *
 * Selected calibration: the ox_008 family from the 400-run sweep.
 * Competent Steady/Meager reference policy: ~74% completion, ~195 calendar
 * days, ~83 meaningful actions, ~18 hunts, with ox exhaustion remaining a real
 * failure mode. New games still start on Filling rations, matching the classic;
 * changing rations is deliberately a player decision.
 */

(() => {
  const itemBalance = {
    food:        { price: 0.20, default: 1000 },
    ammo:        { price: 0.10, default: 300 },
    medicine:    { price: 25,   default: 3 },
    clothing:    { price: 10,   default: 10 },
    wheelParts:  { price: 10,   default: 2 },
    axleParts:   { price: 10,   default: 2 },
    tongueParts: { price: 10,   default: 2 },
    oxen:        { price: 20,   default: 6 },
  };

  for (const item of STORE_ITEMS) {
    const tuned = itemBalance[item.id];
    if (!tuned) continue;
    item.price = tuned.price;
    item.default = tuned.default;

    // game.js renders the setup once synchronously during boot, before this
    // profile script loads. Update the already-created input without calling
    // renderSetup() again, which would duplicate event listeners.
    const input = document.querySelector(`#store-${item.id}`);
    if (input) input.value = String(tuned.default);
  }

  // Opening Prairie remains the directly measured ~20 mi/day Steady reference
  // once the full-condition ox multiplier is applied. Later terrain values are
  // Frontier Journey tuning results, not claimed historical measurements.
  Object.assign(REGION_BASE_MILES, {
    Prairie: 17,
    Plains: 16,
    Foothills: 14,
    Mountains: 12,
    'High Desert': 14,
    Columbia: 13,
    Valley: 15,
  });

  // Preserve the original relative meaning of faster pace settings while
  // reducing the runaway attrition feedback discovered in the MVP.
  Object.assign(PACE.Steady,    { wagon: 0.05,  ox: 0.08 });
  Object.assign(PACE.Strenuous, { wagon: 0.15,  ox: 0.18 });
  Object.assign(PACE.Grueling,  { wagon: 0.275, ox: 0.32 });

  // Weather still matters, but no longer destroys draft-animal condition fast
  // enough to create an almost inevitable slow-down -> more days -> more wear
  // positive feedback loop.
  Object.assign(WEATHER.Rain,  { wagon: 0.15, ox: 0.04 });
  Object.assign(WEATHER.Storm, { wagon: 0.30, ox: 0.12 });
  Object.assign(WEATHER.Mud,   { wagon: 0.40, ox: 0.16 });
  Object.assign(WEATHER.Heat,  { wagon: 0.05, ox: 0.32 });
  Object.assign(WEATHER.Snow,  { wagon: 0.25, ox: 0.24 });

  // Filling remains the safe/default choice. Meager remains a trade-off, but
  // no longer imposes such a large deterministic daily health tax that it
  // becomes effectively unusable over a months-long journey.
  RATIONS.Meager.hp = -0.1;

  // Refresh displayed item prices/costs after mutating STORE_ITEMS. Existing
  // input/change handlers use these live objects and need no rebinding.
  if (typeof updateOutfitting === 'function') updateOutfitting();

  window.frontierBalance = Object.freeze({
    version: '1.2',
    calibration: 'ox_008',
    referenceOutfitCost: STORE_ITEMS.reduce((sum, item) => sum + item.default * item.price, 0),
  });
})();

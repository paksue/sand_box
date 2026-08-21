export const FIXED_HZ = 60;
export const ARENA = Object.freeze({ width: 800, height: 450 });
export const FIGHTER_RADIUS = 20;
export const MOVE_PER_TICK = 4;
export const FACING_THRESHOLD = 0.35;

export const ATTACK_RANGE = 56;
export const ATTACK_DAMAGE = 10;
export const ATTACK_COOLDOWN_TICKS = 14;
export const ATTACK_STARTUP_TICKS = 2;
export const ATTACK_RECOVERY_TICKS = 4;
export const HITSTOP_TICKS = 3;
export const KNOCKBACK_SPEED = 10;
export const KNOCKBACK_DECAY = 0.82;
export const HITSTUN_TICKS = 10;

export const GRAPPLE_RANGE = 44;
export const GRAPPLE_HOLD_TICKS = 6;
export const GRAPPLE_COOLDOWN_TICKS = 22;
export const GRAPPLE_RECOVERY_TICKS = 6;
export const THROW_DAMAGE = 15;
export const THROW_SPEED = 13;
export const THROW_HITSTUN_TICKS = 14;
export const THROW_HITSTOP_TICKS = 4;

export const TAG_CORNERS = Object.freeze({
  p1: Object.freeze({ x: 70, y: 380 }),
  p2: Object.freeze({ x: 730, y: 70 }),
});
export const TAG_ZONE_RADIUS = 64;
export const TAG_COOLDOWN_TICKS = 120;
export const PARTNER_RECOVERY_INTERVAL_TICKS = 60;
export const PARTNER_RECOVERY_AMOUNT = 1;

export const ROPE_RETENTION = 0.75;
export const REBOUND_LOCK_TICKS = 6;

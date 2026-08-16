import { equal } from './assert.js';
import { recommendNextTarget } from '../js/domain/progression.js';

export async function runProgressionTests() {
  equal(recommendNextTarget('plank', 30, 'easy'), 35);
  equal(recommendNextTarget('plank', 30, 'good'), 30);
  equal(recommendNextTarget('plank', 30, 'hard'), 25);
  equal(recommendNextTarget('plank', 180, 'easy'), 180, 'Progression must clamp to max');
  equal(recommendNextTarget('quick-hold', 30, 'easy'), 30, 'Quick Hold should not auto-progress');
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { inferPendingFromV2, planV3Migration, classifySyncState, shouldAutoAdoptRemote, threeWay, pullResult } from '../sync-core.mjs';

const t = (id, title, extra={}) => ({
  id, title, details:'', done:false, deleted:false, order:0,
  createdAt:'2026-08-01T10:00:00.000Z',
  contentUpdatedAt:'2026-08-01T10:00:00.000Z',
  doneUpdatedAt:'2026-08-01T10:00:00.000Z',
  orderUpdatedAt:'2026-08-01T10:00:00.000Z',
  deletedUpdatedAt:'', ...extra
});

test('stale Windows copy is not misclassified as local edits during V2 -> V3 migration', () => {
  const remote = { sha:'NEW', tasks:[t('a','New phone title',{contentUpdatedAt:'2026-08-15T12:00:00.000Z'})] };
  const local = [t('a','Old Windows title',{contentUpdatedAt:'2026-08-10T12:00:00.000Z'})];
  const v2 = { ready:true, baseSha:'NEW', baseTasks:remote.tasks, lastSyncedAt:'2026-08-15T12:01:00.000Z' };
  assert.deepEqual(inferPendingFromV2(v2, local), []);
  const plan = planV3Migration({v2State:v2, localTasks:local, remote});
  assert.equal(plan.action, 'adopt_remote');
  assert.equal(plan.pending.length, 0);
});

test('real local edit after last sync survives migration', () => {
  const base = [t('a','Original')];
  const local = [t('a','Edited on PC',{contentUpdatedAt:'2026-08-15T12:05:00.000Z'})];
  const remote = {sha:'REMOTE2',tasks:[t('a','Edited on phone',{contentUpdatedAt:'2026-08-15T12:04:00.000Z'})]};
  const v2 = {ready:true,baseSha:'BASE1',baseTasks:base,lastSyncedAt:'2026-08-15T12:00:00.000Z'};
  const plan = planV3Migration({v2State:v2,localTasks:local,remote});
  assert.equal(plan.action,'preserve_local');
  assert.equal(plan.pending.length,1);
  assert.equal(plan.pending[0].key,'edit:a');
  assert.equal(plan.remoteChanged,true);
});

test('reordering many records counts as one pending operation', () => {
  const base = [t('a','A',{order:0}),t('b','B',{order:1}),t('c','C',{order:2})];
  const stamp='2026-08-15T12:05:00.000Z';
  const local = [t('a','A',{order:2,orderUpdatedAt:stamp}),t('b','B',{order:0,orderUpdatedAt:stamp}),t('c','C',{order:1,orderUpdatedAt:stamp})];
  const v2={ready:true,baseSha:'x',baseTasks:base,lastSyncedAt:'2026-08-15T12:00:00.000Z'};
  const pending=inferPendingFromV2(v2,local);
  assert.equal(pending.length,1);
  assert.equal(pending[0].key,'reorder');
});

test('remote ahead with no local pending work auto-adopts source of truth', () => {
  assert.equal(classifySyncState({ready:true,token:'x',pendingCount:0,remoteChanged:true}),'remote_ahead');
  assert.equal(shouldAutoAdoptRemote({ready:true,pendingCount:0,remoteChanged:true}),true);
});

test('local work plus remote changes is divergent, never silently overwritten', () => {
  assert.equal(classifySyncState({ready:true,token:'x',pendingCount:2,remoteChanged:true}),'diverged');
  assert.equal(shouldAutoAdoptRemote({ready:true,pendingCount:2,remoteChanged:true}),false);
});

test('Pull is authoritative and restores remote deleted=false state exactly', () => {
  const remote=[t('a','A',{deleted:false}),t('b','B',{deleted:false,order:1})];
  const result=pullResult(remote);
  assert.equal(result.length,2);
  assert.equal(result.every(task=>task.deleted===false),true);
});

test('three-way merge combines different fields without conflict', () => {
  const base=[t('a','Task')];
  const local=[t('a','Task',{done:true,doneUpdatedAt:'2026-08-15T12:05:00.000Z'})];
  const remote=[t('a','Task',{details:'Phone note',contentUpdatedAt:'2026-08-15T12:06:00.000Z'})];
  const result=threeWay(base,local,remote);
  assert.equal(result.conflicts.length,0);
  assert.equal(result.merged[0].done,true);
  assert.equal(result.merged[0].details,'Phone note');
});

test('three-way merge surfaces same-field conflict', () => {
  const base=[t('a','Task')];
  const local=[t('a','PC title',{contentUpdatedAt:'2026-08-15T12:05:00.000Z'})];
  const remote=[t('a','Phone title',{contentUpdatedAt:'2026-08-15T12:06:00.000Z'})];
  const result=threeWay(base,local,remote);
  assert.equal(result.conflicts.length,1);
  assert.equal(result.conflicts[0].field,'title');
});

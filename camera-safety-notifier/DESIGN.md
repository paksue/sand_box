# Design notes — Camera Safety Notifier

## Purpose

A public-service workflow for receiving already-collected/authorized Internet exposure metadata, identifying records that plausibly describe cameras/NVRs, and routing a cautious notification to a responsible party.

## Non-goals

The system is not a scanner, camera viewer, exploitation framework, credential tester, or surveillance tool. It must not retrieve snapshots/video/audio, attempt authentication, control devices, or enumerate private content.

## Decision pipeline

1. Ingest authorized metadata.
2. Validate and normalize the finding.
3. Deterministic metadata classifier estimates device category/risk.
4. Optional local Laya/System-One adapter provides an advisory second opinion.
5. Deterministic routing policy chooses organization security, ISP, vendor PSIRT, CERT coordination, or human review.
6. Human approval is required before notification.
7. Any explicit evidence of unauthorized access, child exploitation, or immediate physical danger goes to a specialist escalation-review queue; the software never auto-contacts police.
8. Resolution is later determined from authorized/passive metadata, not by opening the device.

## Laya boundary

The Laya adapter receives only service/device metadata (port, protocol, service name, banner, vendor/model, tags). It does not receive IP addresses, owner identities, or contact details. Its result cannot override guardrails or directly trigger external actions.

## Evaluation

Before production use, create a labeled corpus from synthetic and legitimately obtained findings. Compare deterministic rules and Laya on precision, recall, false-positive rate, Brier score/calibration, latency, throughput, and disagreement rate. Tune notification thresholds to favor low false-positive rates and human review when uncertain.

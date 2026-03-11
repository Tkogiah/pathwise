# Post‑MVP Strategy Context

## Purpose

This context sets the **post‑MVP direction** for Pathwise. It is meant to rehydrate future AI agents on the strategy, compliance posture, and phased roadmap without bloating the core MVP context.

## Strategic Direction (Snapshot)

- Pathwise is a **workflow‑first nonprofit case management platform** focused on housing and human‑services workflows.
- The core differentiator is **derived state**: roadmaps, task status, blockers, and progress are computed from low‑level task actions.
- Compliance is an adoption gate, not the product identity.

## Compliance Wording (Strict)

- Use **HIPAA** (not “HIPPA”).
- Do **not** claim “HIPAA certified,” “HUD certified,” or “HMIS certified.”
- Use “HIPAA‑ready deployment patterns” and “HMIS‑comparable readiness.”

## Packaging Direction

- **Pathwise Core**: workflow engine, task/state model, notes, appointments, reporting basics.
- **Compliance Core**: RBAC, audit logs, retention/deletion, security controls.
- **Housing / VSP Edition**: HMIS‑comparable workflows, reporting/export alignment, privacy constraints.

## Phased Roadmap (High Level)

1. **Compliance‑ready foundation**: RBAC, audit log, retention/deletion, security model, incident response.
2. **Pilot readiness**: templates, manager reporting, onboarding, exports.
3. **HMIS‑comparable gap closure**: field coverage, reporting validation, privacy constraints.
4. **HIPAA‑ready hardening** (if required by buyer): risk analysis, BAA‑ready deployment, enhanced access monitoring.

## Guardrails

- Avoid expanding scope before compliance foundations are documented.
- Prefer minimal viable compliance features with clear documentation over broad feature sprawl.
- Keep derived state in engine/API; UI should render only.

# Feature Flag Guidelines - ODH Dashboard

This document outlines the best practices for adding and managing feature flags in the ODH Dashboard project.

## Overview

Feature flags in ODH Dashboard use a **two-tier system**:

1. **Code-level flags** - Development flags in the application code
2. **CRD-level flags** - Customer-facing configuration flags

## File Locations

| Type | Location | Purpose |
|------|----------|---------|
| **Code-level** | `/backend/src/utils/constants.ts` | Developer-controlled feature toggles |
| **CRD-level** | `/manifests/common/crd/odhdashboardconfigs.opendatahub.io.crd.yaml` | Customer-accessible feature toggles |

## The Two-Tier System Explained

### Code-level Flags (Development)

**When to use:**
- Working on incomplete features
- Features in development that aren't ready for customer use
- Internal testing and validation

**Characteristics:**
- ✅ Safe to add anytime during development
- ✅ Keeps incomplete features isolated
- ⚠️ **Cannot be released** until CRD is added (if customer-facing)

**Example use case:**
```typescript
// Adding a new dashboard page that's still in development
export const NEW_DASHBOARD_PAGE = 'newDashboardPage';
```

### CRD-level Flags (Customer-Ready)

**When to use:**
- Feature is **complete and tested**
- Ready for customers to optionally enable
- Documented and supported

**Characteristics:**
- ⚠️ Immediately accessible to customers once merged
- 🚀 Requires documentation
- 💡 Should only be added when truly ready

**Example use case:**
```yaml
# Feature is production-ready and documented
dashboardConfig:
  newDashboardPage: false  # Disabled by default for DP/TP
```

## When to Add Feature Flags

### ALWAYS Required

Feature flags are **mandatory** for:
- ✅ **Dev Preview (DP)** features
- ✅ **Tech Preview (TP)** features
- ✅ **MUST be disabled by default** for DP/TP

### Sometimes Required (Use Judgment)

Feature flags are **recommended** for GA features involving:
- New routes
- New pages
- New major functionality

After that, it's subjective and likely not needed for minor changes.

### Not Required

Feature flags are typically **not needed** for:
- Bug fixes
- Minor UI tweaks
- Performance improvements
- Refactoring

## Implementation Workflow

### Scenario 1: Development (Code-level Only)

**Use case:** Working on an incomplete feature

```
Step 1: Add code-level flag
├─ File: /backend/src/utils/constants.ts
└─ Status: ✅ Safe for development, ⚠️ Not ready for release

Step 2: Develop and test
└─ Feature is internal-only, customers cannot enable it

Step 3: When ready, add CRD flag (see Scenario 2)
```

### Scenario 2: Customer-Ready (Both Locations)

**Use case:** Feature is complete and ready for customers

```
Step 1: ✅ Feature is complete and tested
Step 2: ✅ Add/verify code-level flag in constants.ts
Step 3: ✅ Add CRD flag to odhdashboardconfigs.opendatahub.io.crd.yaml
Step 4: ✅ Ensure flag is disabled by default (for DP/TP)
Step 5: ✅ Notify documentation team
Step 6: ✅ Submit PR
```

### Pre-Release Checklist

Before adding a CRD-level flag, ensure:

- [ ] **Feature is complete** - No broken or incomplete states
- [ ] **Feature is tested** - QA validation complete
- [ ] **Maturity level determined**:
  - DP/TP: Flag MUST be disabled by default
  - GA: Flag should exist for major new functionality
- [ ] **Flag location**: Added to `dashboardConfig` section
- [ ] **Flag naming**: Uses `<featureFlagName>` format (NOT "disabled" prefix)
- [ ] **Documentation**: Team notified to document the flag's purpose and usage

## Naming Conventions

### ✅ Correct Format

Feature flags should use the `<featureFlagName>` format:

```yaml
dashboardConfig:
  modelServing: true
  notebookController: false
  biasMetrics: false
```

```typescript
export const MODEL_SERVING = 'modelServing';
export const NOTEBOOK_CONTROLLER = 'notebookController';
export const BIAS_METRICS = 'biasMetrics';
```

### ❌ Deprecated Format

**DO NOT use** the "disabled" prefix (old design, no longer supported):

```yaml
# ❌ WRONG - Do not use
dashboardConfig:
  disabledModelServing: false
  disabledNotebookController: true
```

## Common Pitfalls

### ⚠️ Premature CRD Addition

**Problem:** Adding CRD flag before feature is ready

```yaml
# ❌ Feature is 50% complete, but flag is already in CRD
dashboardConfig:
  incompleteFeature: false  # Customers can enable a broken feature!
```

**Solution:** Add code-level flag first, CRD flag only when ready

```typescript
// ✅ Code-level flag during development
export const INCOMPLETE_FEATURE = 'incompleteFeature';

// Wait until feature is complete...
// Then add to CRD
```

### ⚠️ Missing Documentation

**Problem:** CRD flag added without notifying docs team

**Solution:** Always notify documentation when adding CRD flags
- They need to document what the flag does
- They need to document how to enable/disable it
- They need to document any prerequisites or dependencies

### ⚠️ Wrong Default State

**Problem:** DP/TP feature enabled by default

```yaml
# ❌ WRONG - DP/TP must be disabled by default
dashboardConfig:
  techPreviewFeature: true
```

**Solution:** Always disable by default for DP/TP

```yaml
# ✅ CORRECT
dashboardConfig:
  techPreviewFeature: false
```

## FAQ

**Q: Can I add a CRD flag at the same time as the code flag?**
A: Yes, if the feature is truly complete and ready. But consider the two-step approach to avoid premature customer exposure.

**Q: What if I'm unsure whether my GA feature needs a flag?**
A: Ask yourself: "Is this a new route, page, or major functionality?" If yes, add a flag. If it's a minor change or bug fix, probably not needed.

**Q: Can I enable a DP/TP feature by default if it's really stable?**
A: No. DP/TP features must be disabled by default, regardless of stability. This is policy, not technical.

**Q: What happens if I only add the code-level flag?**
A: The feature works internally for development but cannot be enabled by customers. This is fine for work-in-progress but blocks release.

**Q: Do I need to remove flags after GA?**
A: Not immediately. Flags can remain for a grace period to allow rollback. Check with the team for flag retirement policy.

## Getting Help

- For feature flag questions: Ask in the team channel
- For CodeRabbit PR feedback: Check the automated comments
- For AI assistant guidance: See `CLAUDE.md` in the repository
- For documentation: Contact the docs team when adding CRD flags

## Summary

**Remember:**
1. Code-level flags = Development safety
2. CRD-level flags = Customer-ready features
3. Add code flags early, CRD flags only when ready
4. DP/TP always disabled by default
5. Use `<featureFlagName>` format, NOT "disabled" prefix
6. Notify docs team for CRD changes

Following these guidelines ensures a smooth development process and prevents customer exposure to incomplete features.

# ODH Dashboard - AI Assistant Guidelines

## Feature Flag Implementation Rules

When adding or modifying feature flags, you MUST follow these guidelines:

### File Locations
- **Code-level flags**: `/backend/src/utils/constants.ts`
- **CRD-level flags**: `/manifests/common/crd/odhdashboardconfigs.opendatahub.io.crd.yaml`

### Detection & Guidance

#### Scenario 1: Code-level flag ONLY (Development)
If you're adding a feature flag to `/backend/src/utils/constants.ts` but NOT to the CRD:

**This is FINE for development work**, but be aware:
- ✅ This is appropriate for in-progress features
- ⚠️ This feature CANNOT be released to customers until the CRD is updated
- 💡 Consider if this is ready for customer use before adding the CRD entry

#### Scenario 2: BOTH Code-level AND CRD flags (Customer-Ready)
If you're adding a feature flag to BOTH locations:

**This feature is now customer-facing. Ensure you've considered:**

1. **Feature Maturity Level**
   - Dev Preview (DP) or Tech Preview (TP): MUST have code-level flag, MUST be disabled by default
   - General Availability (GA): Use judgment - new routes, pages, or major functionality should have flags

2. **CRD Readiness Checklist**
   - [ ] Feature is complete and tested (not in broken/incomplete state)
   - [ ] Feature flag is disabled by default in code
   - [ ] Flag is added to `dashboardConfig` section of OdhDashboardConfig
   - [ ] Flag name follows format `<featureFlagName>` (NOT using "disabled" prefix)
   - [ ] Documentation team has been notified to document what this flag does

3. **Timing Consideration**
   - Adding CRD flags prematurely allows customers to enable incomplete features
   - Consider adding code-level flags first, then CRD changes just before release

### Feature Flag Naming Convention
- ✅ Use: `featureFlagName` in dashboardConfig
- ❌ Avoid: `disabledFeatureName` (old design, no longer supported)

### When to Add Feature Flags

**ALWAYS required:**
- Dev Preview (DP) features
- Tech Preview (TP) features
- Must be disabled by default for DP/TP

**Sometimes required (use judgment):**
- GA features with new routes
- GA features with new pages
- GA features with new major functionality
- After that, it's subjective

## General Coding Guidelines

- Follow existing code patterns in the repository
- Write tests for new functionality
- Keep changes focused and atomic
- Consider backwards compatibility

/**
 * Utility designed to create branch coverage.
 * Maps uptime (seconds) to a label.
 * Only finite, non-negative numbers are valid: comparisons on NaN/undefined
 * are always false and would otherwise fall through to 'steady'.
 */
export function formatStatus (uptimeSec) {
  if (!Number.isFinite(uptimeSec) || uptimeSec < 0) throw new Error('invalid uptime')
  if (uptimeSec < 60) return 'warming-up'
  if (uptimeSec < 3600) return 'healthy'
  return 'steady'
}

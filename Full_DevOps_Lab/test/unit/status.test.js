/**
 * Unit tests for src/utils/status.js.
 * Covers all branches for good branch coverage.
 */
import { describe, it, expect } from 'vitest'
import { formatStatus } from '../../src/utils/status.js'

describe('formatStatus', () => {
  it('throws on negative', () => {
    expect(() => formatStatus(-1)).toThrow('invalid uptime')
  })
  it('throws on values that are not a finite number', () => {
    for (const bad of [NaN, undefined, null, '10', Infinity]) {
      expect(() => formatStatus(bad)).toThrow('invalid uptime')
    }
  })
  it('warming-up under 60s', () => {
    expect(formatStatus(10)).toBe('warming-up')
  })
  it('healthy under 1h', () => {
    expect(formatStatus(3599)).toBe('healthy')
  })
  it('steady at or after 1h', () => {
    expect(formatStatus(3600)).toBe('steady')
  })

  it('switches label exactly at the 60s and 3600s boundaries', () => {
    expect(formatStatus(0)).toBe('warming-up')
    expect(formatStatus(59)).toBe('warming-up')
    expect(formatStatus(60)).toBe('healthy')
    expect(formatStatus(3599)).toBe('healthy')
    expect(formatStatus(3600)).toBe('steady')
  })
})

import { defineConfig } from 'vitest/config'

// Vitest does not read the "vitest" block of package.json, so the coverage
// quality gate (80% lines/functions/statements, 70% branches) is enforced here.
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    }
  }
})

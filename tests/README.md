# Testing Infrastructure Documentation

This document provides comprehensive guidance for the testing infrastructure of the multilingual personal website built with Nuxt 3 and Vue 3.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Setup and Installation](#setup-and-installation)
- [Running Tests](#running-tests)
- [Testing Utilities](#testing-utilities)
- [Writing Tests](#writing-tests)
- [Performance Testing](#performance-testing)
- [Coverage and Reporting](#coverage-and-reporting)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Overview

Our testing infrastructure provides comprehensive coverage for:

- **Unit Tests**: Individual components and composables
- **Integration Tests**: Component interactions and data flow
- **Performance Tests**: Rendering performance and memory usage
- **Multilingual Tests**: Language switching and RTL support
- **SSR/Hydration Tests**: Server-side rendering consistency

### Technology Stack

- **Testing Framework**: Vitest
- **Component Testing**: Vue Test Utils
- **Performance Benchmarking**: Vitest Bench
- **Coverage**: V8 Coverage Provider
- **Mocking**: Vitest built-in mocks
- **Environment**: JSDOM for browser simulation

## Test Structure

```
tests/
├── setup/
│   └── global.ts                    # Global test setup
├── utils/
│   ├── testing-helpers.ts           # General testing utilities
│   ├── multilingual-helpers.ts      # i18n testing utilities
│   └── mock-factories.ts            # Mock data factories
├── composables/
│   ├── usePersonalData.test.ts      # Personal data composable tests
│   ├── useLanguage.test.ts          # Language composable tests
│   └── useTheme.test.ts             # Theme composable tests
├── integration/
│   ├── composable-interactions.test.ts  # Cross-composable tests
│   └── ssr-hydration.test.ts            # SSR/hydration tests
├── performance/
│   ├── performance-utils.ts             # Performance testing utilities
│   └── component-performance.bench.ts   # Component benchmarks
├── reports/                             # Test reports and coverage
└── fixtures/                           # Test data fixtures
```

## Setup and Installation

### Prerequisites

Ensure you have the following dependencies installed:

```bash
npm install --save-dev \
  vitest \
  @vitest/ui \
  @vitest/coverage-v8 \
  @vue/test-utils \
  @vitejs/plugin-vue \
  jsdom \
  happy-dom
```

### Configuration

The testing infrastructure is configured through:

- `vitest.config.ts` - Main Vitest configuration
- `tests/setup/global.ts` - Global test setup
- `package.json` - Test scripts and dependencies

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:performance

# Run with coverage
npm run test:coverage
```

### Specific Test Commands

```bash
# Test composables only
npm run test:composables

# Test multilingual functionality
npm run test:multilingual

# Test theme functionality
npm run test:theme

# Run performance benchmarks
npm run benchmark
```

### Debug Mode

```bash
# Run tests in debug mode
npm run test:debug

# Clear test cache
npm run test:clear

# Update snapshots
npm run test:update
```

## Testing Utilities

### General Testing Helpers (`tests/utils/testing-helpers.ts`)

#### Component Testing

```typescript
import { mountComponent, flushPromises } from '../utils/testing-helpers'

test('should render component correctly', async () => {
  const wrapper = mountComponent(MyComponent, {
    props: { title: 'Test Title' }
  })
  
  await flushPromises()
  expect(wrapper.text()).toContain('Test Title')
})
```

#### Performance Measurement

```typescript
import { measureRenderPerformance } from '../utils/testing-helpers'

test('should render within performance threshold', async () => {
  const metrics = await measureRenderPerformance(MyComponent, {}, 10)
  expect(metrics.duration).toBeLessThan(50) // 50ms threshold
})
```

#### Theme Testing

```typescript
import { createMockTheme, testThemeSwitching } from '../utils/testing-helpers'

test('should switch themes correctly', async () => {
  const theme = createMockTheme()
  await testThemeSwitching(themeRef, ['light', 'dark'], (theme) => {
    return theme === 'light' || theme === 'dark'
  })
})
```

### Multilingual Testing Helpers (`tests/utils/multilingual-helpers.ts`)

#### Language Context

```typescript
import { createMockI18nContext } from '../utils/multilingual-helpers'

test('should handle language switching', async () => {
  const i18n = createMockI18nContext('en')
  
  await i18n.switchLanguage('ar')
  expect(i18n.currentLocale.value).toBe('ar')
})
```

#### RTL Testing

```typescript
import { createMockRTLContext, testRTLLayout } from '../utils/multilingual-helpers'

test('should handle RTL layout', async () => {
  const rtl = createMockRTLContext('en')
  
  await testRTLLayout(wrapper, rtl, [
    { locale: 'ar', expectedDirection: 'rtl' },
    { locale: 'en', expectedDirection: 'ltr' }
  ])
})
```

### Mock Factories (`tests/utils/mock-factories.ts`)

#### Personal Data Mocks

```typescript
import { createMockPersonalData, createMockProfile } from '../utils/mock-factories'

test('should use mock personal data', () => {
  const data = createMockPersonalData('en')
  const profile = createMockProfile({ locale: 'ar' })
  
  expect(data.profile.name).toBeDefined()
  expect(profile.name).toBeDefined()
})
```

#### API Response Mocks

```typescript
import { createMockApiResponse, createMockFetchResponse } from '../utils/mock-factories'

test('should handle API responses', () => {
  const response = createMockApiResponse({ data: 'test' }, 200)
  const fetchResponse = createMockFetchResponse({ result: 'success' })
  
  expect(response.status).toBe(200)
  expect(fetchResponse.ok).toBe(true)
})
```

## Writing Tests

### Unit Tests

Unit tests should focus on individual components or composables:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useMyComposable } from '~/composables/useMyComposable'

describe('useMyComposable', () => {
  it('should return expected data', () => {
    const { data, fetchData } = useMyComposable()
    
    expect(data.value).toBeNull()
    expect(typeof fetchData).toBe('function')
  })
})
```

### Integration Tests

Integration tests should verify component interactions:

```typescript
import { describe, it, expect } from 'vitest'
import { mountComponent } from '../utils/testing-helpers'

describe('Component Integration', () => {
  it('should handle language and theme switching together', async () => {
    const wrapper = mountComponent(MyApp)
    
    // Test language switch
    await wrapper.find('[data-test="language-switch"]').trigger('click')
    
    // Test theme switch
    await wrapper.find('[data-test="theme-switch"]').trigger('click')
    
    expect(wrapper.classes()).toContain('theme-dark')
    expect(wrapper.classes()).toContain('locale-ar')
  })
})
```

### Performance Tests

Performance tests use Vitest's benchmark functionality:

```typescript
import { bench, describe } from 'vitest'
import { measureComponentPerformance } from '../performance/performance-utils'

describe('Performance Benchmarks', () => {
  bench('Component render performance', async () => {
    await measureComponentPerformance(MyComponent, {}, 10)
  })
})
```

## Performance Testing

### Component Performance

Use the performance utilities to measure rendering performance:

```typescript
import { measureComponentPerformance, MemoryMonitor } from '../performance/performance-utils'

test('should measure component performance', async () => {
  const monitor = new MemoryMonitor()
  monitor.start()
  
  const benchmark = await measureComponentPerformance(MyComponent, {}, 10)
  
  monitor.stop()
  
  expect(benchmark.average.renderTime).toBeLessThan(100)
  expect(monitor.getMemoryGrowth()).toBeLessThan(1024 * 1024) // 1MB
})
```

### Core Web Vitals

Simulate and validate Core Web Vitals:

```typescript
import { simulateCoreWebVitals, validateCoreWebVitals } from '../performance/performance-utils'

test('should meet Core Web Vitals thresholds', () => {
  const vitals = simulateCoreWebVitals('fast')
  const validation = validateCoreWebVitals(vitals)
  
  expect(validation.overall).toBe('good')
  expect(validation.LCP).toBe('good')
  expect(validation.FID).toBe('good')
  expect(validation.CLS).toBe('good')
})
```

### Network Performance

Test with different network conditions:

```typescript
import { NETWORK_CONDITIONS, createNetworkAwareFetch } from '../performance/performance-utils'

test('should handle slow network conditions', async () => {
  const slowFetch = createNetworkAwareFetch(NETWORK_CONDITIONS['Slow 3G'])
  
  const start = performance.now()
  const response = await slowFetch('/api/data')
  const duration = performance.now() - start
  
  expect(response.ok).toBe(true)
  expect(duration).toBeGreaterThan(400) // Slow 3G latency
})
```

## Coverage and Reporting

### Coverage Configuration

Coverage is configured in `vitest.config.ts` with thresholds:

- Global: 80% minimum coverage
- Composables: 90% minimum coverage
- Utils: 85% minimum coverage

### Running Coverage

```bash
# Generate coverage report
npm run coverage

# Open coverage report in browser
npm run coverage:open

# Run with strict thresholds
npm run coverage:threshold
```

### Coverage Reports

Reports are generated in multiple formats:
- HTML: `coverage/index.html`
- JSON: `coverage/coverage.json`
- LCOV: `coverage/lcov.info`

## CI/CD Integration

### GitHub Actions

Example workflow for CI/CD:

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:ci
      - run: npm run benchmark:report
      
      - uses: actions/upload-artifact@v4
        with:
          name: test-reports
          path: tests/reports/
```

### Test Scripts for CI

```bash
# Run all tests with reporting
npm run test:ci

# Generate benchmark report
npm run benchmark:report

# Quality check (lint + typecheck + test)
npm run quality
```

## Best Practices

### 1. Test Structure

- Group related tests with `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking

- Use mock factories for consistent test data
- Mock external dependencies
- Avoid mocking the code under test

### 3. Async Testing

- Always await async operations
- Use `flushPromises()` for Vue updates
- Handle cleanup in test teardown

### 4. Performance Testing

- Set reasonable performance thresholds
- Test with realistic data sizes
- Monitor memory usage
- Use benchmarks for regression testing

### 5. Multilingual Testing

- Test both LTR and RTL layouts
- Verify font switching
- Test URL generation for different locales
- Validate ARIA labels in multiple languages

### 6. Component Testing

- Test user interactions
- Verify props and events
- Test accessibility features
- Mock child components when needed

### 7. Coverage

- Aim for high coverage but focus on quality
- Test edge cases and error conditions
- Don't test implementation details
- Use coverage reports to find gaps

## Troubleshooting

### Common Issues

1. **Tests failing due to missing mocks**
   - Ensure all external dependencies are mocked
   - Check global setup in `tests/setup/global.ts`

2. **Performance tests inconsistent**
   - Run benchmarks multiple times
   - Consider environment factors
   - Use relative thresholds

3. **Memory leaks in tests**
   - Properly unmount components
   - Clear timers and intervals
   - Use `afterEach` for cleanup

4. **SSR hydration mismatches**
   - Mock server and client environments consistently
   - Test with realistic data
   - Verify state serialization

### Debug Tips

- Use `console.log` sparingly in tests
- Leverage Vitest UI for interactive debugging
- Check test isolation with `--no-coverage`
- Use `--reporter=verbose` for detailed output

## Contributing

When adding new tests:

1. Follow the existing patterns and structure
2. Add appropriate mocks and utilities
3. Update documentation if needed
4. Ensure tests are deterministic
5. Add performance benchmarks for new features

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/)
- [Testing Best Practices](https://kentcdodds.com/blog/write-tests)
# Senda Sênior - Testing Strategy

## Overview
This document outlines the comprehensive testing strategy for the Senda Sênior platform, following State-of-the-Art (SOTA) web development practices as of 2026. The strategy encompasses unit testing, integration testing, and end-to-end (E2E) testing to ensure comprehensive coverage and maintain high quality standards.

## Testing Philosophy
- **Shift Left**: Catch defects early in the development cycle
- **Test Pyramid**: Emphasize unit tests, supplemented by integration and E2E tests
- **Automation First**: Maximize test automation for rapid feedback
- **Production-like Testing**: Test in environments that closely mirror production
- **Observability**: Integrate testing with monitoring and alerting systems

## Test Categories

### 1. Unit Tests
**Purpose**: Validate individual functions, components, and modules in isolation
**Tools**: Vitest, React Testing Library, Jest DOM
**Coverage Target**: >90% for business logic, >80% overall
**Location**: `src/**/*.test.{ts,tsx}`

#### Key Areas:
- **Components**: UI components (Button, Form elements, etc.)
- **Utilities**: Helper functions, formatters, validators
- **Business Logic**: Classification algorithms, validation rules
- **Hooks**: Custom React hooks
- **Services**: Isolated service functions

#### Example:
```typescript
// src/design/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

test('renders primary button with correct styles', () => {
  render(<Button>Primary Button</Button>);
  const button = screen.getByRole('button', { name: /primary button/i });
  expect(button).toBeInTheDocument();
  expect(button).toHaveClass('bg-terracotta');
  expect(button).toHaveClass('text-white');
});
```

### 2. Integration Tests
**Purpose**: Test interactions between multiple units and external services
**Tools**: Vitest, MSW (Mock Service Worker), Supabase test database
**Coverage Target**: Critical user flows and service integrations
**Location**: `src/**/*.int.test.{ts,tsx}`

#### Key Areas:
- **API Routes**: Next.js API route handlers
- **Database Interactions**: Supabase queries and mutations
- **External Services**: Auth providers, file storage
- **State Management**: Context providers, store interactions
- **Middleware**: Authentication, rate limiting, CSP

#### Example:
```typescript
// src/features/vault/actions.int.test.ts
import { prepareUpload } from './actions';
import { server } from '../../test/mocks/server';

describe('Vault Actions Integration', () => {
  test('prepareUpload creates signed URL and file record', async () => {
    // Arrange
    const file = new File(['test'], 'document.pdf', { type: 'application/pdf' });
    
    // Act
    const result = await prepareUpload(file, 'juridico');
    
    // Assert
    expect(result).toHaveProperty('uploadUrl');
    expect(result).toHaveProperty('fileId');
    // Verify Supabase interactions via MSW
  });
});
```

### 3. End-to-End (E2E) Tests
**Purpose**: Validate complete user workflows from UI to database
**Tools**: Playwright, @playwright/test
**Coverage Target**: Critical user journeys, authentication flows, core features
**Location**: `e2e/**/*.spec.{ts,tsx}`

#### Key Areas:
- **Authentication**: Login, registration, password reset
- **Core Features**: File upload, classification, metadata editing
- **User Flows**: Complete vault operations
- **Responsiveness**: Mobile and desktop breakpoints
- **Accessibility**: WCAG compliance checks
- **Performance**: Critical rendering paths

#### Example:
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can register and login successfully', async ({ page }) => {
  // Navigate to registration page
  await page.goto('/register');
  
  // Fill registration form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Verify successful registration
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
  
  // Logout and login again
  await page.click('button[aria-label="User menu"]');
  await page.click('text=Logout');
  
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');
  
  // Verify successful login
  await expect(page).toHaveURL('/dashboard');
});
```

### 4. Visual Regression Tests
**Purpose**: Detect unintended UI changes
**Tools**: Playwright Visual Testing or specialized tools like Percy
**Coverage Target**: Key UI components and pages
**Location**: `e2e/visual/**/*.spec.{ts,tsx}`

### 5. Performance Tests
**Purpose**: Ensure application meets performance benchmarks
**Tools**: Lighthouse, Web Vitals, Playwright performance tracing
**Coverage Target**: Critical pages and user interactions
**Location**: `performance/**/*.{ts,js}`

### 6. Security Tests
**Purpose**: Identify vulnerabilities and security issues
**Tools**: OWASP ZAP, npm audit, custom security test scripts
**Coverage Target**: Authentication, authorization, input validation, CSP
**Location**: `security/**/*.{ts,js}`

## Test Environment Setup

### Local Development
```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed
```

### CI/CD Integration
Tests are automatically executed in the following scenarios:
1. **Pull Request**: Unit, integration, and lint tests run on every PR
2. **Main Branch**: Full test suite (including E2E) runs on merge to main
3. **Nightly**: Performance and security tests run on a schedule
4. **Pre-deployment**: Smoke tests run in staging environment

## Test Data Management

### Unit/Integration Tests
- Use factory functions for test data
- Mock external services with MSW
- Use in-memory databases where applicable
- Reset state between tests

### E2E Tests
- Use test-specific database seeding
- Implement test user creation/cleanup
- Use API endpoints for test setup when UI is inefficient
- Leverage Playwright's test fixtures for shared state

## Code Coverage Requirements

| Test Type | Statement | Branch | Function | Line |
|-----------|-----------|--------|----------|------|
| Unit Tests | 90% | 85% | 95% | 90% |
| Overall | 80% | 75% | 85% | 80% |

Coverage reports are generated with every test run and enforced in CI.

## Best Practices

### Test Naming
- Use descriptive `test()` or `it()` names that explain the scenario
- Follow the pattern: `"[unit under test] [action] [expected result]"`
- For bugs: `"[issue description] - [expected fix]"`

### Test Organization
- Group related tests with `describe()` blocks
- Use `beforeEach()`/`afterEach()` for setup/teardown
- Keep tests independent and deterministic
- Avoid test interdependencies

### Mocking Strategy
- Prefer spies over mocks when possible
- Mock only external dependencies
- Keep mocks simple and focused
- Verify mock calls when testing interactions

### Test Maintenance
- Treat test code with same respect as production code
- Refactor tests regularly
- Delete obsolete tests
- Update tests when requirements change

## Tools & Dependencies

### Dev Dependencies
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitest/coverage-v8": "^2.1.4",
    "@vitest/ui": "^2.1.4",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "jsdom": "^25.0.1",
    "playwright": "^1.45.0",
    "@playwright/test": "^1.45.0",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^2.1.4"
  }
}
```

### Scripts
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

## Continuous Improvement

### Metrics Tracking
- Test execution time trends
- Flaky test detection and resolution
- Defect escape analysis
- Test coverage trends
- Mean time to detect (MTTD) and mean time to resolve (MTTR)

### Feedback Loops
- Test results visible in pull requests
- Test performance dashboards
- Regular test effectiveness reviews
- Test debt tracking and remediation

## Conclusion
This testing strategy provides a comprehensive framework for ensuring the quality, reliability, and maintainability of the Senda Sênior platform. By implementing SOTA testing practices, we can confidently deliver features while maintaining high standards of correctness and user experience.
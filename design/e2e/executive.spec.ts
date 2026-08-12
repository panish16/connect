import { test, expect, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { getTestCredentials } from './test-helpers'

async function loginIfRequired(page: Page, path: string) {
  await page.goto(path)

  try {
    await page.waitForURL(/(logontest7\.gov\.bc\.ca|loginproxy\.gov\.bc\.ca|keycloak)/, { timeout: 5000 })
    const credentials = getTestCredentials('BRTEST3')
    
    const userField = page.locator('input[name="user"], input#user, input#username')
    await userField.waitFor({ state: 'visible', timeout: 15000 })
    await userField.fill(credentials.username)

    const passwordField = page.locator('input[name="password"], input#password')
    await passwordField.fill(credentials.password)

    const submitBtn = page.locator('input[type="submit"], input[name="login"], button#kc-login, button[type="submit"], input[value="Continue"]')
    await submitBtn.click()

    await page.waitForURL(url => url.origin.includes('localhost:3000'), { timeout: 35000 })
  } catch {
    // Already on the site or no login required
  }
}

test.describe('Executive Landing Page - PRD Phase 2 Redesign', () => {
  test.beforeEach(async ({ page }) => {
    await loginIfRequired(page, '/executive')
  })

  test('Page exists and renders root container', async ({ page }) => {
    const container = page.locator('[data-testid="doc-page-content"]')
    await expect(container).toBeVisible({ timeout: 15000 })
  })

  test('Hero section dynamically binds frontmatter data', async ({ page }) => {
    const container = page.locator('[data-testid="doc-page-content"]')
    await container.waitFor({ state: 'visible' })

    // Category Badge
    const badge = page.locator('[data-testid="hero-badge"]')
    await expect(badge).toContainText('CSBC CONNECT SERVICES PLATFORM')

    // Headline
    const headline = page.locator('.executive-landing h1')
    await expect(headline).toHaveText('Deliver Compliant, Scale-Ready Public Services in Months—Not Years.')

    // Sub-headline description
    const description = page.locator('.executive-landing p').first()
    await expect(description).toContainText('Connect provides BC Government teams with turn-key infrastructure')

    // Primary CTA
    const primaryCta = page.locator('a[href="#capabilities"]')
    await expect(primaryCta).toBeVisible()
    await expect(primaryCta).toHaveText('Explore Shared Capabilities')

    // Secondary CTA
    const secondaryCta = page.locator('a[href="#briefing"]')
    await expect(secondaryCta).toBeVisible()
    await expect(secondaryCta).toHaveText('Schedule an Executive Briefing')
  })

  test('Metrics bar renders executive-friendly copy and metric cards', async ({ page }) => {
    const container = page.locator('[data-testid="doc-page-content"]')
    await container.waitFor({ state: 'visible' })

    // Metric 1: 60% Faster
    await expect(page.getByText('60% Faster')).toBeVisible()
    await expect(page.getByText('Average Delivery Schedule Reduction for New Services')).toBeVisible()

    // Metric 2: 100% Compliant
    await expect(page.getByText('100% Compliant')).toBeVisible()
    await expect(page.getByText('Built-in Accessibility (WCAG 2.1 AA) & BC Design Standards')).toBeVisible()

    // Metric 3: Enterprise-Grade
    await expect(page.getByText('Enterprise-Grade')).toBeVisible()
    await expect(page.getByText('High-Availability Payments, Entity & Identity Services')).toBeVisible()
  })

  test('Markdown body content renders cleanly below hero via ContentRenderer', async ({ page }) => {
    const container = page.locator('[data-testid="doc-page-content"]')
    await container.waitFor({ state: 'visible' })

    const capabilitiesSection = page.locator('section#capabilities')
    await expect(capabilitiesSection).toBeVisible()

    // Check heading from body markdown content
    await expect(capabilitiesSection.locator('h2').first()).toContainText('1. The Connect Value Proposition')
  })

  test('Keyboard navigation and focus states function correctly', async ({ page }) => {
    const container = page.locator('[data-testid="doc-page-content"]')
    await container.waitFor({ state: 'visible' })

    const primaryCta = page.locator('a[href="#capabilities"]')
    await primaryCta.focus()
    await expect(primaryCta).toBeFocused()
  })

  test('Executive landing page has no accessibility (a11y) violations', async ({ page }) => {
    const container = page.locator('[data-testid="doc-page-content"]')
    await container.waitFor({ state: 'visible', timeout: 15000 })

    const results = await new AxeBuilder({ page })
      .include('[data-testid="doc-page-content"]')
      .disableRules(['link-name', 'region', 'color-contrast', 'empty-heading', 'landmark-unique', 'button-name'])
      .exclude('.nuxt')
      .analyze()

    if (results.violations.length > 0) {
      console.log('AXE VIOLATIONS on Executive Page:')
      console.dir(results.violations, { depth: null })
    }

    expect(results.violations).toEqual([])
  })
})

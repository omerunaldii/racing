import { test, expect, type Page } from '@playwright/test'

const HORSE_COUNT = 20
const ROUND_COUNT = 6
const HORSES_PER_ROUND = 10

function ui(page: Page) {
  const track = page.getByTestId('race-track')

  return {
    generateButton: page.getByRole('button', { name: 'Generate Program' }),
    toggleButton: page.getByRole('button', { name: 'Start / Paused' }),
    horseRows: page.getByTestId('horse-list').locator('tbody tr'),
    schedule: page.getByTestId('race-schedule'),
    roundCards: page.getByTestId('round-card'),
    track,
    trackTitle: track.locator('h3'),
    trackStatus: track.getByTestId('round-status'),
    lanes: track.getByTestId('lane-runner'),
  }
}

async function finishRunningRound(page: Page) {
  await page.evaluate(() => document.getAnimations().forEach((animation) => animation.finish()))
}

function laneAnimationStates(page: Page) {
  return page
    .getByTestId('lane-runner')
    .evaluateAll((lanes) => lanes.map((lane) => lane.getAnimations()[0]?.playState ?? 'none'))
}

function laneOffset(page: Page, index: number) {
  return page
    .getByTestId('lane-runner')
    .nth(index)
    .evaluate((lane) => new DOMMatrix(getComputedStyle(lane).transform).m41)
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('shows an empty program on first load', async ({ page }) => {
  const { horseRows, schedule, track, toggleButton } = ui(page)

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Horse Racing')
  await expect(horseRows).toHaveText(['No horses generated yet.'])
  await expect(track).toContainText('Generate a race program to see the track.')
  await expect(schedule).toContainText('Generate a program to see the race schedule.')
  await expect(toggleButton).toBeDisabled()
})

test('generates horses and a race schedule', async ({ page }) => {
  const { generateButton, toggleButton, horseRows, roundCards, trackTitle, trackStatus, lanes } =
    ui(page)

  await generateButton.click()

  await expect(horseRows).toHaveCount(HORSE_COUNT)
  await expect(roundCards).toHaveCount(ROUND_COUNT)

  for (let i = 0; i < ROUND_COUNT; i++) {
    const card = roundCards.nth(i)

    await expect(card.getByTestId('round-status')).toHaveText('pending')
    await expect(card.getByTestId('participants-table').locator('tbody tr')).toHaveCount(
      HORSES_PER_ROUND,
    )
  }

  await expect(trackTitle).toHaveText('Round 1')
  await expect(trackStatus).toHaveText('pending')
  await expect(lanes).toHaveCount(HORSES_PER_ROUND)
  await expect(toggleButton).toBeEnabled()
})

test('starts, pauses and resumes the race', async ({ page }) => {
  const { generateButton, toggleButton, trackStatus } = ui(page)

  await generateButton.click()
  await toggleButton.click()

  await expect(trackStatus).toHaveText('running')
  await expect.poll(() => laneOffset(page, 0)).toBeGreaterThan(0)

  await toggleButton.click()
  await expect.poll(() => laneAnimationStates(page)).toEqual(Array(HORSES_PER_ROUND).fill('paused'))

  await toggleButton.click()
  await expect
    .poll(() => laneAnimationStates(page))
    .toEqual(Array(HORSES_PER_ROUND).fill('running'))
})

test('records the results and moves on to the next round', async ({ page }) => {
  const { generateButton, toggleButton, roundCards, trackTitle, trackStatus } = ui(page)

  await generateButton.click()
  await toggleButton.click()
  await expect(trackStatus).toHaveText('running')

  await finishRunningRound(page)

  const firstRound = roundCards.first()

  await expect(firstRound.getByTestId('round-status')).toHaveText('completed')
  await expect(firstRound.getByTestId('result-table').locator('tbody tr')).toHaveCount(
    HORSES_PER_ROUND,
  )
  await expect(trackTitle).toHaveText('Round 2')
  await expect(trackStatus).toHaveText('running')
})

test('runs the whole program to the end', async ({ page }) => {
  const { generateButton, toggleButton, roundCards, trackTitle, trackStatus } = ui(page)

  await generateButton.click()
  await toggleButton.click()

  for (let round = 1; round <= ROUND_COUNT; round++) {
    await expect(trackTitle).toHaveText(`Round ${round}`)
    await expect(trackStatus).toHaveText('running')
    await finishRunningRound(page)
  }

  await expect(trackTitle).toHaveText(`Round ${ROUND_COUNT}`)
  await expect(trackStatus).toHaveText('completed')
  await expect(roundCards.getByTestId('round-status')).toHaveText(
    Array(ROUND_COUNT).fill('completed'),
  )
  await expect(toggleButton).toBeDisabled()
})

test('generating a new program resets a running race', async ({ page }) => {
  const { generateButton, toggleButton, roundCards, trackTitle, trackStatus } = ui(page)

  await generateButton.click()
  await toggleButton.click()
  await expect(trackStatus).toHaveText('running')

  await generateButton.click()

  await expect(trackTitle).toHaveText('Round 1')
  await expect(trackStatus).toHaveText('pending')
  await expect(roundCards.first().getByTestId('result-table')).toContainText('Waiting for race')
  await expect.poll(() => laneAnimationStates(page)).toEqual(Array(HORSES_PER_ROUND).fill('none'))
})

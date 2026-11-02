import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { IHorse } from '@/features/horse-racing/types/horse'
import RaceLane from './RaceLane.vue'

const horse: IHorse = { id: 'horse-1', name: 'Horse 1', condition: 50, color: '#ff0000' }

function mountLane(props: { duration: number | null; running: boolean }) {
  return mount(RaceLane, { props: { horse, index: 0, ...props } })
}

describe('RaceLane Component', () => {
  it('does not run while waiting at the start', () => {
    const runner = mountLane({ duration: null, running: false }).get('[data-testid="lane-runner"]')

    expect(runner.classes()).not.toContain('running')
    expect(runner.attributes('style')).toBeUndefined()
  })

  it('runs for the given duration', () => {
    const runner = mountLane({ duration: 8000, running: true }).get('[data-testid="lane-runner"]')

    expect(runner.classes()).toContain('running')
    expect(runner.attributes('style')).toContain('animation-duration: 8000ms')
    expect(runner.attributes('style')).toContain('animation-play-state: running')
  })

  it('pauses with the running prop', async () => {
    const wrapper = mountLane({ duration: 8000, running: true })

    await wrapper.setProps({ running: false })

    expect(wrapper.get('[data-testid="lane-runner"]').attributes('style')).toContain(
      'animation-play-state: paused',
    )
  })

  it('emits finish when its own animation ends', async () => {
    const wrapper = mountLane({ duration: 8000, running: true })

    await wrapper.get('[data-testid="lane-runner"]').trigger('animationend')

    expect(wrapper.emitted('finish')).toHaveLength(1)
  })

  it('ignores animations ending inside the horse icon', async () => {
    const wrapper = mountLane({ duration: 8000, running: true })

    await wrapper.get('[data-testid="lane-runner"] > *').trigger('animationend')

    expect(wrapper.emitted('finish')).toBeUndefined()
  })
})

/**
 * Component tests for the design picker.
 *
 * The interesting behaviour is all in the gating: who sees the dialog, when it
 * can be dismissed, and what a choice writes to localStorage and the <html>
 * element. Appearance is covered by the E2E spec instead.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithLang, screen, waitFor } from '../setup/test-utils'
import { DesignProvider } from '@/components/shared/DesignProvider'
import { DesignChooser } from '@/components/shared/DesignChooser'
import { DesignSwitchButton } from '@/components/shared/DesignSwitchButton'
import { DESIGN_ATTRIBUTE, DESIGN_STORAGE_KEY } from '@/constants/design'

function renderPicker(lang: 'en' | 'tr' = 'en') {
  return renderWithLang(
    <DesignProvider>
      <DesignSwitchButton lang={lang} />
      <DesignChooser lang={lang} />
    </DesignProvider>,
    { lang },
  )
}

const dialog = () => screen.queryByRole('dialog')

beforeEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute(DESIGN_ATTRIBUTE)
})

describe('DesignChooser', () => {
  it('opens automatically when no design has been chosen', async () => {
    renderPicker()
    await waitFor(() => expect(dialog()).toBeInTheDocument())
    expect(screen.getByText('Choose your design')).toBeInTheDocument()
  })

  it('stays closed for a visitor who already chose', async () => {
    window.localStorage.setItem(DESIGN_STORAGE_KEY, 'neobrutalism')
    renderPicker()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Change Theme' })).toBeInTheDocument(),
    )
    expect(dialog()).not.toBeInTheDocument()
  })

  it('applies and persists the chosen design', async () => {
    const user = userEvent.setup()
    renderPicker()
    await waitFor(() => expect(dialog()).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /Neobrutalism/ }))

    expect(window.localStorage.getItem(DESIGN_STORAGE_KEY)).toBe('neobrutalism')
    expect(document.documentElement.getAttribute(DESIGN_ATTRIBUTE)).toBe('neobrutalism')
    await waitFor(() => expect(dialog()).not.toBeInTheDocument())
  })

  it('ignores ESC until a choice has been made, then honours it', async () => {
    const user = userEvent.setup()
    renderPicker()
    await waitFor(() => expect(dialog()).toBeInTheDocument())

    await user.keyboard('{Escape}')
    expect(dialog()).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Current Design/ }))
    await waitFor(() => expect(dialog()).not.toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Change Theme' }))
    await waitFor(() => expect(dialog()).toBeInTheDocument())

    await user.keyboard('{Escape}')
    await waitFor(() => expect(dialog()).not.toBeInTheDocument())
  })

  it('exposes the dialog with an accessible name and moves focus into it', async () => {
    renderPicker()
    await waitFor(() => expect(dialog()).toBeInTheDocument())

    expect(dialog()).toHaveAttribute('aria-modal', 'true')
    expect(dialog()).toHaveAccessibleName('Choose your design')
    await waitFor(() =>
      expect(dialog()).toContainElement(document.activeElement as HTMLElement | null),
    )
  })

  it('marks the active design with aria-pressed when reopened', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem(DESIGN_STORAGE_KEY, 'neobrutalism')
    renderPicker()

    await user.click(await screen.findByRole('button', { name: 'Change Theme' }))
    await waitFor(() => expect(dialog()).toBeInTheDocument())

    expect(screen.getByRole('button', { name: /Neobrutalism/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: /Current Design/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('renders Turkish copy for the tr locale', async () => {
    renderPicker('tr')
    await waitFor(() => expect(dialog()).toBeInTheDocument())
    expect(screen.getByText('Tasarımınızı seçin')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Mevcut Tasarım/ })).toBeInTheDocument()
  })
})

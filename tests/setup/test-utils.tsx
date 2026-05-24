/**
 * Shared testing helpers.
 *
 * `renderWithLang` wraps React Testing Library's `render` and threads the
 * site's `Locale` type through, so component tests can express intent as
 * `renderWithLang(<StatCards lang="tr" ... />, { lang: 'tr' })`.
 *
 * We deliberately re-export everything from `@testing-library/react` so that
 * test files only need one import for screen, fireEvent, within, etc.
 */
import type { ReactElement } from 'react'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { Locale } from '@/constants/config'

interface LangRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  lang?: Locale
}

export function renderWithLang(
  ui: ReactElement,
  { lang: _lang = 'en', ...options }: LangRenderOptions = {},
): RenderResult {
  // The lang param is currently consumed via component props rather than a
  // provider, so we just forward it as metadata. A future I18nProvider would
  // be wired in here without test changes.
  void _lang
  return render(ui, options)
}

export * from '@testing-library/react'

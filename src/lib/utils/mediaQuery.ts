'use client'

type MediaQueryChangeHandler = (event: MediaQueryListEvent | MediaQueryList) => void
type LegacyMediaQueryList = MediaQueryList & {
  addListener: (handler: MediaQueryChangeHandler) => void
  removeListener: (handler: MediaQueryChangeHandler) => void
}

export function listenMediaQuery(
  mediaQuery: MediaQueryList,
  handler: MediaQueryChangeHandler,
) {
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }

  const legacyMediaQuery = mediaQuery as LegacyMediaQueryList
  legacyMediaQuery.addListener(handler)
  return () => legacyMediaQuery.removeListener(handler)
}

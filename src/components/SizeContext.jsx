import { createContext, useContext, useCallback, useMemo } from 'react'

/**
 * Contexto compartilhado por slide para guardar:
 *  - sizes: multiplicadores de tamanho (textos/imagens)
 *  - positions: deslocamentos {x,y} em px aplicados via transform
 *
 * Cada elemento opta por participar passando uma `sizeKey` ou `positionKey` única.
 */
const SizeCtx = createContext({
  sizes: {},
  setSize: () => {},
  positions: {},
  setPosition: () => {},
  resetPosition: () => {},
})

export function SizeProvider({
  sizes = {},
  positions = {},
  onSizesChange,
  onPositionsChange,
  children,
}) {
  const setSize = useCallback(
    (key, delta) => {
      if (!onSizesChange) return
      const current = sizes?.[key] ?? 1
      const next = Math.max(0.3, Math.min(4, +(current + delta).toFixed(2)))
      onSizesChange({ ...sizes, [key]: next })
    },
    [sizes, onSizesChange],
  )

  const setSizeAbsolute = useCallback(
    (key, value) => {
      if (!onSizesChange) return
      const next = Math.max(0.3, Math.min(4, +value.toFixed(2)))
      onSizesChange({ ...sizes, [key]: next })
    },
    [sizes, onSizesChange],
  )

  const setPosition = useCallback(
    (key, pos) => {
      if (!onPositionsChange) return
      onPositionsChange({ ...positions, [key]: pos })
    },
    [positions, onPositionsChange],
  )

  const resetPosition = useCallback(
    (key) => {
      if (!onPositionsChange) return
      const next = { ...positions }
      delete next[key]
      onPositionsChange(next)
    },
    [positions, onPositionsChange],
  )

  const value = useMemo(
    () => ({ sizes, setSize, setSizeAbsolute, positions, setPosition, resetPosition }),
    [sizes, setSize, setSizeAbsolute, positions, setPosition, resetPosition],
  )
  return <SizeCtx.Provider value={value}>{children}</SizeCtx.Provider>
}

export function useSize(key, defaultMult = 1) {
  const { sizes, setSize, setSizeAbsolute } = useContext(SizeCtx)
  if (!key) return [defaultMult, null, null]
  return [
    sizes?.[key] ?? defaultMult,
    (delta) => setSize(key, delta),
    (val) => setSizeAbsolute(key, val),
  ]
}

export function usePosition(key) {
  const { positions, setPosition, resetPosition } = useContext(SizeCtx)
  if (!key) return [{ x: 0, y: 0 }, null, null]
  return [positions?.[key] ?? { x: 0, y: 0 }, (p) => setPosition(key, p), () => resetPosition(key)]
}

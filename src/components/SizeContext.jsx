import { createContext, useContext, useCallback, useMemo } from 'react'

/**
 * Contexto compartilhado por slide para guardar:
 *  - sizes: multiplicadores de tamanho (textos/imagens)
 *  - positions: deslocamentos {x,y} em px aplicados via transform
 *  - hidden: lista de keys ocultas (elementos excluídos pelo usuário)
 */
const SizeCtx = createContext({
  sizes: {},
  setSize: () => {},
  setSizeAbsolute: () => {},
  positions: {},
  setPosition: () => {},
  resetPosition: () => {},
  hidden: [],
  setHidden: () => {},
  restoreHidden: () => {},
  restoreAllHidden: () => {},
})

export function SizeProvider({
  sizes = {},
  positions = {},
  hidden = [],
  onSizesChange,
  onPositionsChange,
  onHiddenChange,
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

  const setHidden = useCallback(
    (key, isHidden) => {
      if (!onHiddenChange || !key) return
      const set = new Set(hidden)
      if (isHidden) set.add(key)
      else set.delete(key)
      onHiddenChange(Array.from(set))
    },
    [hidden, onHiddenChange],
  )

  const restoreHidden = useCallback(
    (key) => setHidden(key, false),
    [setHidden],
  )

  const restoreAllHidden = useCallback(() => {
    if (!onHiddenChange) return
    onHiddenChange([])
  }, [onHiddenChange])

  const value = useMemo(
    () => ({
      sizes, setSize, setSizeAbsolute,
      positions, setPosition, resetPosition,
      hidden, setHidden, restoreHidden, restoreAllHidden,
    }),
    [sizes, setSize, setSizeAbsolute, positions, setPosition, resetPosition,
     hidden, setHidden, restoreHidden, restoreAllHidden],
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

export function useHidden(key) {
  const { hidden, setHidden } = useContext(SizeCtx)
  if (!key) return [false, null]
  return [hidden.includes(key), (isH) => setHidden(key, isH)]
}

export function useHiddenList() {
  const { hidden, restoreHidden, restoreAllHidden } = useContext(SizeCtx)
  return { hidden, restoreHidden, restoreAllHidden }
}

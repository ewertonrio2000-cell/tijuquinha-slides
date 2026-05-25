import { createContext, useContext, useCallback, useMemo } from 'react'

/**
 * Contexto compartilhado por slide para guardar multiplicadores de tamanho
 * (texto e imagens). Cada componente passa um `sizeKey` único e recebe
 * o valor + função para incrementar/decrementar.
 *
 * Os multiplicadores ficam em data.sizes[key] (ex: 0.5 a 2.5).
 */
const SizeCtx = createContext({ sizes: {}, setSize: () => {} })

export function SizeProvider({ sizes = {}, onSizesChange, children }) {
  const setSize = useCallback(
    (key, delta) => {
      if (!onSizesChange) return
      const current = sizes?.[key] ?? 1
      const next = Math.max(0.5, Math.min(3, +(current + delta).toFixed(2)))
      onSizesChange({ ...sizes, [key]: next })
    },
    [sizes, onSizesChange],
  )
  const value = useMemo(() => ({ sizes, setSize }), [sizes, setSize])
  return <SizeCtx.Provider value={value}>{children}</SizeCtx.Provider>
}

export function useSize(key, defaultMult = 1) {
  const { sizes, setSize } = useContext(SizeCtx)
  if (!key) return [defaultMult, null]
  return [sizes?.[key] ?? defaultMult, (delta) => setSize(key, delta)]
}

/**
 * Toast minimalista — event bus que componentes escutam pra mostrar mensagens.
 */
const listeners = new Set()
let nextId = 1

export function toast(message, opts = {}) {
  const id = nextId++
  const item = {
    id,
    message,
    kind: opts.kind || 'info', // 'info' | 'success' | 'error'
    duration: opts.duration ?? 3500,
  }
  listeners.forEach((l) => l({ type: 'add', item }))
  if (item.duration > 0) {
    setTimeout(() => {
      listeners.forEach((l) => l({ type: 'remove', id }))
    }, item.duration)
  }
  return id
}

export function dismissToast(id) {
  listeners.forEach((l) => l({ type: 'remove', id }))
}

export function onToast(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

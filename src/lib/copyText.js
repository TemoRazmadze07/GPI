/* copyText — clipboard write with the execCommand fallback. The modern async
   Clipboard API needs a secure context: it is blocked on file:// (the offline
   share build!) and in some embedded panes. The hidden-textarea + execCommand
   path is deprecated but works everywhere on a user gesture, so every copy
   affordance in the prototype goes through here. Returns true when the text
   actually landed on the clipboard — callers show feedback only then. */
export default async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    /* insecure context or permission denied — fall through */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch {
    return false
  }
}

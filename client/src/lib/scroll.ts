/** Navigation bar height offset so the section heading isn't hidden behind the fixed nav. */
const NAV_OFFSET = 72;

/**
 * Smooth-scroll to a section by its DOM id.
 * @param id        The element id to scroll to (e.g. "contact").
 * @param callback  Optional callback to invoke after initiating scroll (e.g. closing mobile menu).
 */
export function scrollToSection(id: string, callback?: () => void): void {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
    behavior: "smooth",
  });
  callback?.();
}

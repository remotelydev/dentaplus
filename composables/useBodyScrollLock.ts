export const useBodyScrollLock = () => {
  const setBodyScrollLock = (lock: boolean) => {
    if (!document) return;
    if (lock) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = "";
    }
  }

  return { setBodyScrollLock }
}

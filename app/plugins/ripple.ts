class Ripple {
  mountRipple () {
    const selector = [
      ...document.querySelectorAll<HTMLElement>("[ripple]"),
      ...document.querySelectorAll<HTMLElement>("[ripple-dark]")
    ];
    for (const el of selector) {
      const handler = (e: MouseEvent | TouchEvent) => {
        const event = (e as TouchEvent).touches?.[0] || (e as MouseEvent);
        const r = el.getBoundingClientRect();
        const d = Math.sqrt(Math.pow(r.width, 2) + Math.pow(r.height, 2)) * 2;
        el.style.cssText = "--s: 0; --o: 1;";
        void el.offsetTop;
        el.style.cssText = `--t: 1; --o: 0; --d: ${d}; --x:${event.clientX - r.left}; --y:${event.clientY - r.top};`;
      };

      el.addEventListener("mousedown", handler);
    }
  }
}

const ripple = new Ripple();

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    useMutationObserver(document.body, () => {
      ripple.mountRipple();
    }, { childList: true, subtree: true });
  });
});

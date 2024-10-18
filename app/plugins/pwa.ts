// Must meet web manifest requirements for desktop

type UserChoice = Promise<{
  outcome: "accepted" | "dismissed";
}>;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<UserChoice>;
  userChoice: UserChoice;
}

export class PWA {
  event?: BeforeInstallPromptEvent | null;
  installed?: boolean;
  standalone?: boolean;
  constructor () {
    this.event = null;
    this.installed = true;
    this.standalone = false;
  }

  async install? () {
    const result = await this.event?.prompt();
    const { outcome } = result || {};
    if (outcome === "accepted") this.installed = true;
    this.event = null;
  }
}

const pwa = new PWA();

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("app:mounted", () => {
    addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      pwa.installed = false;
      pwa.event = e as BeforeInstallPromptEvent;
    });

    // @ts-expect-error
    pwa.standalone = window?.matchMedia("(display-mode: standalone)")?.matches || window?.navigator?.standalone ? true : false;
    pwa.installed = pwa.standalone || pwa.installed;
  });

  return {
    provide: { pwa }
  };
});

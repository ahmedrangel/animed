import { SITE } from "../shared/utils/info";

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  compatibilityDate: "2025-02-07",
  app: {
    pageTransition: { name: "fadepage", mode: "out-in" },
    layoutTransition: { name: "fadepage", mode: "out-in" },
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      bodyAttrs: {
        "data-bs-theme": "dark"
      },
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { name: "robots", content: "index, follow" },
        { property: "og:ttl", content: "604800" },
        { name: "darkreader-lock", content: "darkreader" },
        { property: "og:site_name", content: SITE.name }
      ],
      link: [
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/android-chrome-512x512.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#0b0e0f" },
        { rel: "preconnect", href: "https://s4.anilist.co" }
      ]
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@vuepic/vue-datepicker/dist/main.css",
    "~/assets/css/main.css",
    "~/assets/css/transitions.css",
    "~/assets/css/theme.css",
    "~/assets/css/categories.css",
    "~/assets/css/connections.css",
    "~/assets/css/datepicker.css"
  ],
  modules: [
    "@nuxt/scripts",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "@nuxt/eslint",
    "nuxt-aos",
    "@vueuse/nuxt",
    "@nuxthub/core",
    "@nuxt/fonts",
    "nuxt-ripple",
    "nuxt-auth-utils"
  ],
  icon: {
    mode: "svg",
    clientBundle: {
      scan: true,
      sizeLimitKb: 2048
    }
  },
  runtimeConfig: {
    secure: {
      salt: ""
    },
    myanimelist: {
      clientId: ""
    }
  },
  features: {
    inlineStyles: false
  },
  colorMode: {
    preference: "dark",
    fallback: "dark",
    dataValue: "bs-theme",
    storageKey: "nuxt-color-mode"
  },
  site: {
    url: SITE.url
  },
  nitro: {
    prerender: {
      routes: ["/c", "/search", "/sitemap.xml"]
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: ["/images/*"]
        }
      }
    }
  },
  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },
  sitemap: {
    sources: ["/api/__sitemap"],
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  },
  routeRules: {
    "/": { sitemap: { priority: 1 } },
    "/*/**": { sitemap: { priority: 0.8, lastmod: new Date().toISOString() }, appMiddleware: "setup-profile" },
    "/api/_nuxt_icon/**": { cache: { maxAge: 1.577e+7 } }
  },
  fonts: {
    families: [
      { name: "Rubik", provider: "google", global: true }
    ],
    experimental: {
      disableLocalFallbacks: true
    }
  },
  experimental: {
    typedPages: true,
    purgeCachedData: false
  },
  hub: {
    kv: true,
    cache: true,
    database: true
  }
});

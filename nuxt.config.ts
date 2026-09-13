import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import tailwindAspectRatio from "@tailwindcss/aspect-ratio";
import svgLoader from "vite-svg-loader";
import { sitemapDoctorUids } from "./data/doctors";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: true,

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://www.dentaplus.pl",
    },
  },

  app: {
    head: {
      title: "DentaPlus+ | Gabinety stomatologiczne w Turku i Poddębicach",
      htmlAttrs: {
        lang: "pl",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "DentaPlus+ to gabinety stomatologiczne w Turku i Poddębicach. Poznaj naszych specjalistów i sprawdź zakres leczenia.",
        },
        { name: "format-detection", content: "telephone=no" },
        { property: "og:locale", content: "pl_PL" },
        { property: "og:site_name", content: "DentaPlus+" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/denta.ico" }],
    },
  },

  css: [
    "~/styles/global.css",
    "@fontsource/inter/latin-400.css",
    "@fontsource/inter/latin-ext-400.css",
    "@fontsource/inter/latin-500.css",
    "@fontsource/inter/latin-ext-500.css",
    "@fontsource/inter/latin-600.css",
    "@fontsource/inter/latin-ext-600.css",
  ],

  modules: [
    "@nuxtjs/prismic",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@vueuse/nuxt",
  ],

  vite: {
    plugins: [svgLoader()],
    // Keep Vue's injection symbols shared when pnpm dependencies resolve through symlinks.
    resolve: {
      dedupe: ["vue", "@prismicio/vue", "@prismicio/client"],
    },
  },

  image: {
    prismic: {},
  },

  prismic: {
    endpoint: process.env.NUXT_PUBLIC_PRISMIC_ENDPOINT || "dentaplus",
    preview: "/api/preview",
    toolbar: process.env.NODE_ENV !== "production",
  },

  routeRules: {
    "/api/preview": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/api/preview/**": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
    "/slice-simulator": { headers: { "X-Robots-Tag": "noindex, nofollow" } },
  },

  hooks: {
    "nitro:init"(nitro) {
      nitro.hooks.hook("prerender:done", () => {
        const publicDir = nitro.options.output.publicDir;
        const generatedNotFound = join(publicDir, "404", "index.html");
        const netlifyNotFound = join(publicDir, "404.html");

        if (!existsSync(generatedNotFound)) {
          throw new Error("Prerendered /404/ is missing; cannot write 404.html");
        }

        copyFileSync(generatedNotFound, netlifyNotFound);
      });
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      ignore: [
        "/zespol/monika-maciejeweska",
        "/zespol/monika-maciejeweska/",
      ],
      routes: [
        "/404/",
        "/api/preview/",
        "/turek/",
        "/poddebice/",
        "/polityka-prywatnosci/",
        "/cookies/",
        "/uslugi/",
        ...sitemapDoctorUids.map((uid) => `/zespol/${uid}/`),
      ],
    },
  },

  tailwindcss: {
    config: {
      content: ["./app/**/*.{js,ts,vue}", "./slices/**/*.{js,ts,vue}"],
      theme: {
        fontFamily: {
          sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        },
        extend: {
          colors: {
            "denta-green": "#b7d424",
          },
          screens: {
            xs: "390px",
          },
        },
      },
      plugins: [tailwindAspectRatio],
    },
  },
});

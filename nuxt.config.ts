import tailwindAspectRatio from "@tailwindcss/aspect-ratio";
import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: true,

  app: {
    head: {
      title: "Prismic + Nuxt multi-page example",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Prismic + Nuxt multi-page example",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/png", href: "/denta.ico" }],
    },
  },

  css: [
    "~/styles/global.css",
    "@fontsource/inter/400.css",
    "@fontsource/inter/500.css",
    "@fontsource/inter/600.css",
  ],

  modules: [
    "@nuxtjs/prismic",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@vueuse/nuxt",
  ],

  vite: {
    plugins: [svgLoader()],
  },

  image: {
    prismic: {},
  },

  prismic: {
    endpoint: "dentaplus",
    preview: "/api/preview",
    clientConfig: {
      routes: [
        {
          type: "page",
          path: "/:uid",
        },
        {
          type: "bio",
          path: "/zespol/:uid",
        },
        {
          type: "page",
          uid: "home",
          path: "/",
        },
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

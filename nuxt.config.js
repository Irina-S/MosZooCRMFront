import ru from 'vuetify/src/locale/ru'

let API_URI = process.env.NUXT_API_URL
if (process.env.NODE_ENV === 'production') {
  API_URI = '/'
}

const axios = {
  debug: true,
  proxy: process.env.NODE_ENV === 'dev',
  baseURL: API_URI,
}
const proxy = {
  '/api': {
    target: API_URI,
  },
  '/storage': {
    target: API_URI,
  },
  '/sanctum': {
    target: API_URI,
  },
}

// https://realfavicongenerator.net/
/*
const config = {
  msapplicationTileColor: '#ffffff',
  themeColor: '#ffffff',
  safariPinnedTab: '#ffffff',
}
 */

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  loading: {
    color: '#006299',
    height: '5px',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Загрузка...',
    htmlAttrs: {
      lang: 'ru',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1',
      },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },

      /*
      {
        name: 'msapplication-TileColor',
        content: config.msapplicationTileColor,
      },
      { name: 'theme-color', content: config.themeColor },

       */
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },

      /*
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      {
        rel: 'manifest',
        href: '/safari-pinned-tab.svg',
        color: config.safariPinnedTab,
      },
       */
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['./assets/scss/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    './plugins/axios.js',
    './api/sendRequest.js',
    './api/index.js',
    // './plugins/draggable.js',
    // './plugins/animate.css.js',
    // './plugins/haptics.js',
    './plugins/modal.js',
    './plugins/hotkey.js',
    './plugins/trackers',
    './plugins/vue-async-computed.js',
    { src: './plugins/polyfills.js', ssr: false },
    './plugins/v-mask.js',
    './plugins/vee-validate.js',
    './plugins/dayjs.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    '@nuxtjs/svg',
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/sentry',
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/style-resources',
    '@nuxtjs/dayjs',
    // '@nuxtjs/svg-sprite',
  ],

  sentry: {
    dsn: process.env.SENTRY_DSN, // Enter your project's DSN here
    tracing: process.env.SENTRY_TRACES_SAMPLE_RATE
      ? {
          tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE),
          vueOptions: {
            tracing: true,
            tracingOptions: {
              hooks: ['mount', 'update'],
              timeout: 2000,
              trackComponents: true,
            },
          },
          browserOptions: {},
        }
      : false,
    // Additional Module Options go here
    // https://sentry.nuxtjs.org/sentry/options
    config: {
      // Add native Sentry config here
      // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/
      environment: process.env.NODE_ENV,
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    lang: {
      locales: { ru },
      current: 'ru',
    },
    customVariables: ['~/assets/scss/variables.scss'],
    treeShake: true,
    theme: {
      themes: {
        light: {
          error: '#E36464',
          primary: '#006299',
          success: '#38A326',
        },
        dark: false,
      },
    },
    breakpoint: {
      thresholds: {
        xs: 500,
        sm: 960,
        md: 1280,
        lg: 1920,
      },
    },
  },

  axios,
  proxy,

  dayjs: {
    locales: ['en', 'ru'],
    defaultLocale: 'ru',
  },

  router: {
    middleware: ['init-store', 'auth'],
  },

  auth: {
    redirect: {
      login: '/auth',
      logout: '/auth',
      callback: '/auth',
      home: '/',
    },
    strategies: {
      local: {
        token: {
          maxAge: 31536000, // 1 year,
          global: true,
        },
        user: {
          property: '',
          autoFetch: true,
        },
        // cookie: {
        //   // (optional) If set, we check this cookie existence for loggedIn check
        //   name: 'XSRF-TOKEN',
        // },
        endpoints: {
          login: {
            url: '/api/v1/auth-by-password',
            method: 'post',
          },
          logout: {
            url: '/api/v1/auth/logout',
            method: 'get',
          },
          user: {
            url: '/api/v1/user/me',
            method: 'get',
          },
          // (optional) If set, we send a get request to this endpoint before login
          csrf: {
            url: '/sanctum/csrf-cookie',
          },
        },
      },
    },
  },

  bootstrapVue: {
    bootstrapCSS: false, // подключаем отдельно в assets/scss
    bootstrapVueCSS: false,
    components: ['BButton', 'BIcon', 'BIconX'],
  },

  styleResources: {
    scss: ['./assets/scss/includes.scss'],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: process.env.NODE_ENV !== 'dev',
    extend(config) {
      config.performance.maxAssetSize = 512000 // дефолтный бандл vue превышает 244 кб
      // поддержка работы с pdf
      // Find the rule which contains a assets file extension
      const assetsLoader = config.module.rules.find((rule) =>
        rule.test.test('.png')
      )
      // Overwrite the test regex and add `pdf`
      assetsLoader.test = /\.(png|jpe?g|gif|webp|pdf)$/i
      return config
    },
    loaders: {
      scss: {
        sassOptions: {
          quietDeps: true, // убирает варнинги с math.div
        },
      },
      // file: { test: /\.pdf$/i, loader: 'file-loader' },
    },
  },
}

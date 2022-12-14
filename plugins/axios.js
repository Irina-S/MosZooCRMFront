export default function ({ $axios }) {
  $axios.onRequest((config) => {
    if (window?.$nuxt?.$loading?.start) {
      // показываем прелоадер
      window.$nuxt.$loading.start()
    }
  })

  // eslint-disable-next-line
  $axios.defaults.headers.common['Accept'] = 'application/json'
  $axios.defaults.headers.common['Content-Type'] = 'application/json'

  // вычисляем базовый урл для своле
  let url
  if ($axios.defaults.baseURL === '/') {
    url = new URL(location + '')
  } else {
    url = new URL($axios.defaults.baseURL)
  }

  // url.host уже содержит порт
  const port = url.port
  $axios.swooleBaseURLWs = `${url.protocol.replace('http', 'ws')}//${
    url.hostname
  }${port ? `:${port}` : ''}/`
}

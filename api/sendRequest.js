export default (ctx, inject) => {
  const { $axios } = ctx
  const sendRequest = (
    method,
    url,
    params = {},
    requestDataPrepare = (d) => d,
    config = {}
  ) => {
    if (!method) {
      return $axios
    }
    if (method === 'get' && !params.params) {
      // для запросов со скачиванием файлов формируем params сразу
      params = { params }
    }
    if (requestDataPrepare) {
      params = requestDataPrepare(params)
    }

    return $axios[`$${method}`](url, params, config)
  }
  ctx.$sendRequest = sendRequest
  inject('sendRequest', sendRequest)
}

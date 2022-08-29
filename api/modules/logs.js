export default ($sendRequest) => {
  const request = {}

  request.getList = (params) => {
    return $sendRequest('get', '/api/v1/logs', params)
  }

  request.get = (id) => {
    return $sendRequest('get', `/api/v1/logs/${id}`)
  }

  return request
}

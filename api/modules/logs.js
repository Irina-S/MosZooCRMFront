export default ($sendRequest) => {
  const request = {}

  request.getList = (params) => {
    return $sendRequest('get', '/api/v1/logs', params)
  }

  return request
}

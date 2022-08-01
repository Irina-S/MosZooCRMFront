export default ($sendRequest) => {
  const request = {}

  request.getList = () => {
    return $sendRequest('get', '/api/v1/settings')
  }

  request.get = (id) => {
    return $sendRequest('get', `/api/v1/settings/${id}`)
  }

  request.update = (id, params) => {
    return $sendRequest('put', `/api/v1/settings/${id}`, params)
  }

  return request
}

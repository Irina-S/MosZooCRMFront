export default ($sendRequest) => {
  const request = {}

  request.getList = () => {
    return $sendRequest('get', '/api/v1/settings')
  }

  request.get = (id) => {
    return $sendRequest('get', ` /api/v1/settings/${id}`)
  }

  request.update = (id) => {
    return $sendRequest('put', ` /api/v1/settings/${id}`)
  }

  return request
}

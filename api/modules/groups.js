export default ($sendRequest) => {
  const request = {}

  request.getList = (params) => {
    return $sendRequest('get', '/api/v1/groups', params)
  }

  return request
}

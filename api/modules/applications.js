export default ($sendRequest) => {
  const request = {}

  request.validate = (params) => {
    return $sendRequest('post', '/api/v1/applications/validate', params)
  }

  request.create = (params) => {
    return $sendRequest('post', '/api/v1/applications', params)
  }

  return request
}

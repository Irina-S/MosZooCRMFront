export default ($sendRequest) => {
  const request = {}

  request.validate = (params) => {
    return $sendRequest('post', '/api/v1/applications/validate', params)
  }

  request.create = (params) => {
    return $sendRequest('post', '/api/v1/applications', params)
  }

  request.update = (id, params) => {
    return $sendRequest('put', `/api/v1/applications/${id}`, params)
  }

  request.get = (id) => {
    return $sendRequest('get', `/api/v1/applications/${id}`)
  }

  request.updateStatus = (id, params) => {
    return $sendRequest('put', `/api/v1/applications/${id}/next-status`, params)
  }

  request.getList = (params) => {
    return $sendRequest('get', '/api/v1/applications', params)
  }

  return request
}

export default ($sendRequest) => {
  const request = {}

  request.getVars = () => {
    return $sendRequest('get', '/api/v1/templates/vars ')
  }

  request.get = (id) => {
    return $sendRequest('get', `/api/v1/templates/show/${id}`)
  }

  request.update = (id, params) => {
    return $sendRequest('put', `/api/v1/templates/edit/${id}`, params)
  }

  request.getStatus = (id) => {
    return $sendRequest('get', `/api/v1/templates/show/${id}/is_active`)
  }

  request.updateStatus = (id, params) => {
    return $sendRequest(
      'put',
      `/api/v1/templates/show/${id}/set_active`,
      params
    )
  }

  return request
}

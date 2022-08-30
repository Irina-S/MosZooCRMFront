export default ($sendRequest) => {
  const request = {}

  request.getVars = () => {
    return $sendRequest('get', '/api/v1/templates/vars ')
  }

  request.get = (id) => {
    return $sendRequest('get', `/api/v1/templates/show/${id}`)
  }

  request.update = (id) => {
    return $sendRequest('put', `/api/v1/templates/edit/${id}`)
  }

  request.getStatus = (id) => {
    return $sendRequest('get', `/api/v1/templates/${id}/is_active`)
  }

  request.updateStatus = (id) => {
    return $sendRequest('put', `/api/v1/templates/${id}/set_active`)
  }

  return request
}

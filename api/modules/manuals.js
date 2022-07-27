export default ($sendRequest) => {
  const request = {}

  request.getApplicationsTypes = () => {
    return $sendRequest('get', '/api/v1/manuals/types')
  }

  request.getStatuses = () => {
    return $sendRequest('get', '/api/v1/manuals/statuses')
  }

  request.getModerators = (params) => {
    return $sendRequest('get', '/api/v1/manuals/moderators', params)
  }

  return request
}

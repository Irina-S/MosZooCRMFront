export default ($sendRequest) => {
  const request = {}

  request.getApplicationsTypes = (params) => {
    return $sendRequest('get', '/api/v1/manuals/types')
  }

  request.getStatuses = () => {
    return $sendRequest('get', '/api/v1/manuals/statuses')
  }

  request.getModerators = () => {
    return $sendRequest('get', '/api/v1/manuals/moderators')
  }

  return request
}

export default ($sendRequest) => {
  const request = {}

  request.getApplicationsTypes = (params) => {
    return $sendRequest('get', '/api/v1/manuals/types')
  }

  return request
}

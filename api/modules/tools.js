export default ($sendRequest) => {
  const request = {}

  request.export = (params) => {
    return $sendRequest('get', '/api/v1/tools/export', {
      params,
      responseType: 'blob',
    })
  }

  return request
}

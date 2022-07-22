export default ($sendRequest) => {
  const request = {}

  request.authBySms = (params) => {
    console.log('auth')
    return $sendRequest('post', '/api/v1/auth', params)
  }

  request.confirm = (params) => {
    return $sendRequest('post', '/api/v1/confirm', params)
  }

  return request
}

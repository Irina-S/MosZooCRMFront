import ws from './modules/ws'
import applications from './modules/applications'
import manuals from './modules/manuals'
import auth from './modules/auth'

export default ({ $sendRequest, store }, inject) => {
  inject('api', {
    ws: ws($sendRequest, store),
    applications: applications($sendRequest),
    manuals: manuals($sendRequest),
    auth: auth($sendRequest),
  })
}

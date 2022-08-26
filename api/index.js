import ws from './modules/ws'
import applications from './modules/applications'
import manuals from './modules/manuals'
import auth from './modules/auth'
import groups from './modules/groups'
import settings from './modules/settings'
import logs from './modules/logs'
import tools from './modules/tools'

export default ({ $sendRequest, store }, inject) => {
  inject('api', {
    ws: ws($sendRequest, store),
    applications: applications($sendRequest),
    manuals: manuals($sendRequest),
    auth: auth($sendRequest),
    groups: groups($sendRequest),
    settings: settings($sendRequest),
    logs: logs($sendRequest),
    tools: tools($sendRequest),
  })
}

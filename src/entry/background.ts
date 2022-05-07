import { Method } from 'axios'
import http from '../lib/http'

const commands: {[k: string]:any} = {
  loadInstances (sendResponse: any) {
    request('GET', '/instances', null, sendResponse)
  },
  deleteInstance (id: any, sendResponse: any) {
    request('DELETE', `/instances/${id}`, null, sendResponse)
  },
  selectInstance (id: any, sendResponse: any) {
    request('POST', `/instances/${id}/select`, null, sendResponse)
  },
  createInstance (instance: any, sendResponse: any) {
    request('POST', '/instances', instance, sendResponse)
  },
  updateInstance (id: any, instance: any, sendResponse: any) {
    request('POST', `/instances/${id}`, instance, sendResponse)
  },
  loadStatus (sendResponse: any) {
    request('GET', '/status', null, sendResponse)
  },

  loadAccounts (sendResponse: any) {
    request('GET', '/accounts', null, sendResponse)
  },
  deleteAccount (id: any, sendResponse: any) {
    request('DELETE', `/accounts/${id}`, null, sendResponse)
  },
  createAccount (account: any, sendResponse: any) {
    request('POST', '/accounts', account, sendResponse)
  },
  updateAccount (id: any, account: any, sendResponse: any) {
    request('POST', `/accounts/${id}`, account, sendResponse)
  },
  selectAccount (id: any, sendResponse: any) {
    request('POST', `/accounts/${id}/select`, null, sendResponse)
  }
}

async function request (method: Method, url: string, data: any, sendResponse: (res: any) => void) {
  try {
    const res = await http.request({
      method,
      url,
      data
    })
    if (res.status !== 200) {
      console.error('Failed to connect to hijacker controller. ', res.data)
      sendResponse(null)
      return
    }
    sendResponse(res.data)
  } catch (e) {
    console.error('error: ', e)
    sendResponse(null)
  }
}

chrome.runtime.onMessage.addListener((msg: {command: string, args?: []}, sender, sendResponse) => {
  console.log('received message', msg)
  const cmd = commands[msg.command]
  if (!cmd) {
    console.error('unknown command: ', msg.command)
    sendResponse(null)
  } else {
    if (msg.args) {
      cmd(...msg.args, sendResponse)
    } else {
      cmd(sendResponse)
    }
  }
  return true
})

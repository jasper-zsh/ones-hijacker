import { Method } from 'axios'
import http from '../lib/http'

let currentStatus: any = null

const updateStatus = (status: any) => {
  currentStatus = status
  chrome.tabs.query({}, result => {
    for (const tab of result) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'statusUpdated',
          data: status
        })
      }
    }
  })
}

const commands: {[k: string]:any} = {
  proxyStatus (sendResponse: any) {
    chrome.proxy.settings.get({}, config => {
      sendResponse(config.value.mode !== 'system')
    })
  },
  enableProxy (sendResponse: any) {
    chrome.proxy.settings.set({
      value: {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: 'http',
            host: '127.0.0.1',
            port: 6789
          }
        }
      },
      scope: 'regular'
    }, () => {
      console.log('proxy enabled')
      sendResponse()
      updateStatus(currentStatus)
    })
  },
  disableProxy (sendResponse: any) {
    chrome.proxy.settings.set({
      value: {
        mode: 'system'
      },
      scope: 'regular'
    }, () => {
      console.log('proxy disabled')
      sendResponse()
      updateStatus(currentStatus)
    })
  },
  checkStatus (sendResponse: any) {
    console.log('checking status')
    if (currentStatus == null) {
      request('GET', '/status', null, res => {
        console.log('checkStatus got status', res)
        currentStatus = res
        sendResponse(res)
      })
    } else {
      console.log('currentStatus is not null')
      sendResponse(currentStatus)
    }
  },
  loadStatus (sendResponse: any) {
    request('GET', '/status', null, res => {
      sendResponse(res)
      updateStatus(res)
    })
  },
  loadInstances (sendResponse: any) {
    request('GET', '/instances', null, sendResponse)
  },
  deleteInstance (id: any, sendResponse: any) {
    request('DELETE', `/instances/${id}`, null, sendResponse)
  },
  selectInstance (id: any, sendResponse: any) {
    request('POST', `/instances/${id}/select`, null, res => {
      sendResponse(res)
      updateStatus(res)
    })
  },
  createInstance (instance: any, sendResponse: any) {
    request('POST', '/instances', instance, sendResponse)
  },
  updateInstance (id: any, instance: any, sendResponse: any) {
    request('POST', `/instances/${id}`, instance, sendResponse)
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
    request('POST', `/accounts/${id}/select`, null, res => {
      sendResponse(res)
      updateStatus(res)
    })
  }
}

async function request (method: Method, url: string, data: any, sendResponse: (res: any) => void) {
  try {
    // const opts: RequestInit = {
    //   method
    // }
    // if (['POST', 'PUT'].indexOf(method) >= 0) {
    //   opts.body = JSON.stringify(data)
    //   opts.headers = {
    //     'content-type': 'application/json'
    //   }
    // }
    // const res = await fetch(url, opts)
    const res = await http.request({
      url,
      method,
      data
    })
    if (res.status !== 200) {
      console.error('Failed to connect to hijacker controller. ', res.data)
      sendResponse(null)
      return
    }
    console.log('[Request] got response', res.data)
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

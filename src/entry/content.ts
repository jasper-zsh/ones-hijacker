console.log('ONES Hijacker loaded!')

const statusPanel = document.createElement('div')
const instanceVal = document.createElement('div')
const accountVal = document.createElement('div')
statusPanel.setAttribute('style', 'position: fixed;bottom: 30px; right: 30px; padding: 10px;border-radius: 5px;background: #1e90ff90; color: #ffffff')
statusPanel.appendChild((() => {
  const row = document.createElement('div')
  row.setAttribute('style', 'display: flex')
  const label = document.createElement('div')
  row.appendChild(label)
  label.textContent = '服务：'
  row.appendChild(instanceVal)
  return row
})())
statusPanel.append((() => {
  const row = document.createElement('div')
  row.setAttribute('style', 'display: flex')
  const label = document.createElement('div')
  row.appendChild(label)
  label.textContent = '账号：'
  row.appendChild(accountVal)
  return row
})())
document.getElementsByTagName('body')[0].appendChild(statusPanel)

chrome.runtime.sendMessage({
  command: 'checkStatus'
}, res => {
  console.log('check status', res)
  instanceVal.textContent = res.instance.note || res.instance.base_url
  accountVal.textContent = res.account.note || res.account.email
})

chrome.runtime.onMessage.addListener((msg, sender) => {
  console.log('hijacker status changed', msg)
  instanceVal.textContent = msg.data.instance.note || msg.data.instance.base_url
  accountVal.textContent = msg.data.account.note || msg.data.account.email
  location.reload()
})

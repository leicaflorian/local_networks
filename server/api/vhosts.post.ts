import fs from 'fs'
import { path, restartApache, sectionEnd, sectionStart } from '../VHostParser.server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const content = fs.readFileSync(path, 'utf8')
  const fileRows = content.split('\n')
  
  let customSectionIndex = fileRows.findIndex(row => row === sectionEnd)
  
  if (customSectionIndex === -1) {
    fileRows.push('\n' + sectionStart)
    fileRows.push(sectionEnd)
    
    // Backup hosts file
    fs.copyFileSync(path, path + '.bakup')
    
    customSectionIndex = fileRows.length - 2
  }
  
  const newVHost = `
<VirtualHost *:80>
    ProxyPreserveHost On
    ProxyRequests Off
    ServerName ${body.serverName}
    ServerAlias ${body.serverAlias}
    ProxyPass ${body.proxyPass.join(' ')}
    ProxyPassReverse ${body.proxyPassReverse.join(' ')}
</VirtualHost>`
  
  fileRows.splice(customSectionIndex, 0, newVHost)
  
  // Write content to file
  fs.writeFileSync(path, fileRows.join('\n'))
  
  // Restart apache
  await restartApache()
  
  return newVHost
})

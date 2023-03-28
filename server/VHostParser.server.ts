import { ref, Ref } from 'vue'
import { VHost } from '~/@types/VHost'
import { exec } from 'child_process'

interface VHostParserServer extends VHost {
  raw: string
}

export const path = '/private/etc/apache2/extra/httpd-vhosts.conf'
export const sectionStart = '# Start Local networks section'
export const sectionEnd = '# End Local networks section'

export const useVHostParser = (content: string) => {
  const vHosts: Ref<VHostParserServer[]> = ref([])
  const res = content.match(/<VirtualHost((.|\n)*?)<\/VirtualHost>/gim)
  
  res?.forEach((vhost, i) => {
    vHosts.value.push({
      id: i,
      serverName: vhost.match(/ServerName (.*)/i)?.[1].replace('ServerName', '').trim() || '',
      serverAlias: vhost.match(/ServerAlias (.*)/i)?.[1].replace('ServerAlias', '').trim() || '',
      proxyPass: vhost.match(/ProxyPass (.*)/i)?.[1].replace('ProxyPass', '').trim()
        .split(' ') as [string, string] || ['', ''],
      proxyPassReverse: vhost.match(/ProxyPassReverse (.*)/i)?.[1].replace('ProxyPassReverse', '').trim()
        .split(' ') as [string, string] || ['', ''],
      raw: vhost
    })
  })
  
  return {
    vHosts
  }
}

export const restartApache = async () => {
  // run cmd command sudo apachectl restart
  return new Promise((resolve, reject) => {
    exec('sudo apachectl restart', (error, stdout, stderr) => {
      if (error) {
        reject(`error: ${error.message}`)
        
      }
      if (stderr) {
        reject(`stderr: ${stderr}`)
      }
      
      resolve(stdout.trim() || 'OK')
    })
  })
}

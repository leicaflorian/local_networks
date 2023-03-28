import fs from 'fs'

export default defineEventHandler(async (event) => {
  const hosts = fs.readFileSync('/etc/hosts', 'utf8')
  const hostsList = hosts.split('\n')
  const body: { ipAddress: string, host: string } = await readBody(event)
  
  if (!body.ipAddress?.trim() || !body.host?.trim()) {
    throw new Error('Invalid request')
  }
  
  let customSectionIndex = hostsList.findIndex((line) => line === '# End Local networks section')
  
  if (customSectionIndex === -1) {
    hostsList.push('\n# Start Local networks section')
    hostsList.push('# End Local networks section')
    
    // Backup hosts file
    fs.copyFileSync('/etc/hosts', '/etc/hosts.bakup')
    
    customSectionIndex = hostsList.length - 2
  } else {
    customSectionIndex--
  }
  
  hostsList.splice(customSectionIndex + 1, 0, `${body.ipAddress.trim()} ${body.host.trim()}`)
  
  // Write content to file
  fs.writeFileSync('/etc/hosts', hostsList.join('\n'))
  
  return hostsList
})

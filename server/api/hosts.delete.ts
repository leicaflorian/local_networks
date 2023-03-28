import fs from 'fs'

export default defineEventHandler(async (event) => {
  const hosts = fs.readFileSync('/etc/hosts', 'utf8')
  const hostsList = hosts.split('\n')
  const body: { host: string } = await readBody(event)
  
  if (!body.host || !body.host.trim()) {
    throw new Error('Host is required')
  }
  
  const toDeleteIndex = hostsList.findIndex((line) => line.includes(body.host))
  
  if (!toDeleteIndex) {
    throw new Error('Host not found')
  }
  
  hostsList.splice(toDeleteIndex, 1)
  
  // Write content to file
  fs.writeFileSync('/etc/hosts', hostsList.join('\n'))
  
  return 'Deleted'
})

import fs from 'fs'
import { VHost } from '~/@types/VHost'
import { useVHostParser, path, sectionStart, sectionEnd, restartApache } from '../VHostParser.server'

export default defineEventHandler(async (event) => {
  const body: { vhostId: number } = await readBody(event)
  const content = fs.readFileSync(path, 'utf8')
  const fileRows = content.split('\n')
  const vHostsList = useVHostParser(content).vHosts.value
  
  const vHost = vHostsList.find(vhost => vhost.id === body.vhostId)?.raw
  
  if (!vHost) {
    throw  new Error('VHost not found')
  }
  
  const newContent = removeEmptySpaces(content.replace(vHost, ''))
  
  // Write content to file
  fs.writeFileSync(path, newContent)
  
  // Restart apache
  await restartApache()
  
  return 'Deleted'
})

function removeEmptySpaces (content: string): string {
  const lines = content.split('\n')
  const newLines: string[] = []
  let lastEmptyLine = -1
  
  lines.forEach((line, i) => {
    if (line.trim()) {
      newLines.push(line)
    } else {
      if (lastEmptyLine !== i - 1) {
        newLines.push(line)
      }
      
      lastEmptyLine = i
    }
  })
  
  return newLines.join('\n')
}

import fs from 'fs'
import { VHost } from '~/@types/VHost'
import { useVHostParser, path } from '../VHostParser.server'

export default defineEventHandler((event) => {
  const content = fs.readFileSync(path, 'utf8')
  
  const toReturn: VHost[] = useVHostParser(content).vHosts.value
  
  return toReturn
})

import fs from 'fs'

export default defineEventHandler((event) => {
  const hosts = fs.readFileSync('/etc/hosts', 'utf8')
  
  return {
    data: hosts
  }
})

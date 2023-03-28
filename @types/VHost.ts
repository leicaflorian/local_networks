export interface VHost {
  id: number
  serverName: string
  serverAlias: string
  proxyPass: [string, string]
  proxyPassReverse: [string, string]
}

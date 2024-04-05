export interface GithubActionEnabledRequest {
  apiID: string
  uid: string
  roles: number[]
}

export interface TriggerButtonInfo {
  buttonID: string
  apiID: string
  label: string
  variant?: string
  roles?: string[]
}

export interface GithubActionEnabledResponse {
  enabled: boolean
  buttons: TriggerButtonInfo[]
}

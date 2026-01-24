import { Toast } from 'vant'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $toast: typeof Toast
  }
}

export {}

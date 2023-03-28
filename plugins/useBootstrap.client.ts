// @ts-ignore
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle'

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      bootstrap: bootstrap
    }
  }
  // nuxtApp.provide('bootstrap', bootstrap)
})

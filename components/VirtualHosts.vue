<template>
  <div class="card rounded-top-0 border-top-0">
    <div class="card-body bg-light text-center">
      <h5 class="card-title mb-0">Active Virtual Hosts</h5>
      <em class="small">({{ filePath }})</em>
    </div>

    <nav class="nav bg-light justify-content-center border-bottom">
      <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#vhosts-add-modal"
         @click="onAddClick">Add</a>
      <a class="nav-link" :href="'vscode://file/' + filePath" target="_blank">Open in VsCode</a>
    </nav>

    <ul class="list-group list-group-flush">
      <VirtualHostListItem v-for="(vHost, i) in vHostsList" :key="i"
                           :vHost="vHost"
                           @removeHost="onDeleteClick(vHost)">
      </VirtualHostListItem>
    </ul>
  </div>

  <div class="modal fade" id="vhosts-add-modal"
       data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Aggiungi nuovo virtual host</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" v-if="Object.values(validationErrors).length">
            <div v-html="Object.values(validationErrors).join('<br>')"></div>
          </div>

          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="serveNameInput" placeholder="Server Name"
                   v-model="newVHostForm.serverName">
            <label for="serveNameInput">Server Name</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="serverAliasInput" placeholder="Server Alias"
                   v-model="newVHostForm.serverAlias">
            <label for="serverAliasInput">Server Alias</label>
          </div>

          <div class="row">
            <div class="col">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="proxyPassFromInput" placeholder="Proxy Pass From"
                       v-model="newVHostForm.proxyPassFrom">
                <label for="proxyPassFromInput">Proxy Pass From</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="proxyPassToInput" placeholder="Proxy Pass To"
                       v-model="newVHostForm.proxyPassTo">
                <label for="proxyPassToInput">Proxy Pass To</label>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="proxyPassReverseFromInput"
                       placeholder="Proxy Pass Reverse From"
                       v-model="newVHostForm.proxyPassReverseFrom">
                <label for="proxyPassReverseFromInput">Proxy Pass Reverse From</label>
              </div>
            </div>
            <div class="col">
              <div class="form-floating mb-3">
                <input type="text" class="form-control" id="proxyPassReverseToInput" placeholder="Proxy Pass Reverse To"
                       v-model="newVHostForm.proxyPassReverseTo">
                <label for="proxyPassReverseToInput">Proxy Pass Reverse To</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="addVHost">Add</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="vhosts-remove-modal"
       data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Delete this host?</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="lead">Are you sure you want to delete the host: </p>
          <strong>{{ deletingVHost }}</strong>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="deleteVHost">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref } from 'vue'
import { VHost } from '~/@types/VHost'

const { $bootstrap } = useNuxtApp()
const filePath = '/private/etc/apache2/extra/httpd-vhosts.conf'
const { data: rawVHosts, refresh: refreshRawVHosts } = useFetch<VHost[]>('/api/vhosts')
const validationErrors: Ref<any> = ref({})
const deletingVHost: Ref<VHost | undefined> = ref()
const initialFormData = {
  serverName: 'local.***.com',
  serverAlias: 'local.***.com',
  proxyPassFrom: '/',
  proxyPassTo: 'http://localhost:****/',
  proxyPassReverseFrom: '/',
  proxyPassReverseTo: 'http://localhost:****/'
}
const newVHostForm = reactive({
  ...initialFormData
})
const vHostsList = computed(() => rawVHosts.value)

async function addVHost () {
  const data = {
    serverName: newVHostForm.serverName.trim(),
    serverAlias: newVHostForm.serverAlias.trim(),
    proxyPass: [newVHostForm.proxyPassFrom.trim(), newVHostForm.proxyPassTo.trim()],
    proxyPassReverse: [newVHostForm.proxyPassReverseFrom.trim(), newVHostForm.proxyPassReverseTo.trim()]
  }

  validationErrors.value = validate(data)

  if (Object.values(validationErrors.value).length) {
    return
  }

  try {
    await $fetch('/api/vhosts', {
      method: 'post',
      body: data
    })

    await refreshRawVHosts()
    Object.assign(newVHostForm, initialFormData)

    const modal = document.getElementById('vhosts-add-modal')
    const bootstrapModal = $bootstrap.Modal.getInstance(modal)

    bootstrapModal.hide()
  } catch (e) {
    console.error(e)
  }
}

async function deleteVHost () {
  if (!deletingVHost.value) {
    return
  }

  try {
    await $fetch('/api/vhosts', {
      method: 'delete',
      body: {
        vhostId: deletingVHost.value.id
      }
    })

    await refreshRawVHosts()

    const modal = document.getElementById('vhosts-remove-modal')
    const bootstrapModal = $bootstrap.Modal.getInstance(modal)

    bootstrapModal.hide()
  } catch (e) {
    console.error(e)
  }
}

function onAddClick () {
  validationErrors.value = {}
  Object.assign(newVHostForm, initialFormData)
}

function onDeleteClick (vHost: VHost) {
  deletingVHost.value = vHost
}

function validate (data: any) {
  const toReturn: any = {}

  if (!data.serverName) {
    toReturn.serverName = 'Server Name is required'
  }
  if (!data.serverAlias) {
    toReturn.serverAlias = 'Server Alias is required'
  }
  if (!data.proxyPass[0]) {
    toReturn.proxyPassFrom = 'Proxy Pass From is required'
  }
  if (!data.proxyPass[1]) {
    toReturn.proxyPassTo = 'Proxy Pass To is required'
  }
  if (!data.proxyPassReverse[0]) {
    toReturn.proxyPassReverseFrom = 'Proxy Pass Reverse From is required'
  }
  if (!data.proxyPassReverse[1]) {
    toReturn.proxyPassReverseTo = 'Proxy Pass Reverse To is required'
  }

  return toReturn
}
</script>

<style scoped></style>

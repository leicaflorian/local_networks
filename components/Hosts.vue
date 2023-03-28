<template>
  <div class="card rounded-top-0 border-top-0">
    <div class="card-body bg-light text-center">
      <h5 class="card-title mb-0">Registered Hosts</h5>
      <em class="small">({{ filePath }})</em>
    </div>

    <nav class="nav bg-light justify-content-center border-bottom">
      <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#hosts-add-modal"
         @click="onAddClick">Add</a>
      <a class="nav-link" :href="'vscode://file/' + filePath" target="_blank">Open in VsCode</a>
    </nav>

    <ul class="list-group list-group-flush">
      <HostListItem v-for="(host, i) in hostsList" :key="i"
                    @removeHost="onDeleteClick(host)">{{ host }}
      </HostListItem>
    </ul>
  </div>

  <div class="modal fade" id="hosts-add-modal"
       data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
       aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Add new host</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="alert alert-danger" v-if="Object.values(validationErrors).length">
            <div v-html="Object.values(validationErrors).join('<br>')"></div>
          </div>

          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="ipAddressInput" placeholder="Ip Address"
                   v-model="newHostForm.ipAddress">
            <label for="ipAddressInput">Ip Address</label>
          </div>
          <div class="form-floating mb-3">
            <input type="text" class="form-control" id="hostInput" placeholder="Host" v-model="newHostForm.host">
            <label for="hostInput">Host</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="addHost">Add</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="hosts-remove-modal"
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
          <strong>{{ deletingHost }}</strong>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="deleteHost">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref } from 'vue'

const { $bootstrap } = useNuxtApp()
const filePath = "/etc/hosts"
const deletingHost: Ref<string> = ref('')
const validationErrors: Ref<any> = ref({})
const { data: rawHosts, refresh: refreshRawHosts } = useFetch('/api/hosts')

const newHostForm = reactive({
  ipAddress: '127.0.0.1',
  host: 'local.'
})

const hostsList = computed(() => {
  return rawHosts.value?.data.split('\n').filter((host: string) => host && !host.startsWith('#'))
})

async function addHost () {
  const data = {
    ipAddress: newHostForm.ipAddress.trim(),
    host: newHostForm.host.trim()
  }

  validationErrors.value = {}

  if (!data.ipAddress) {
    validationErrors.value.ipAddress = 'Ip Address is required'
  }

  if (!data.host) {
    validationErrors.value.host = 'Host is required'
  }

  if (Object.keys(validationErrors.value).length > 0) {
    return
  }

  try {
    const data = await $fetch('/api/hosts', {
      method: 'post',
      body: newHostForm
    })

    await refreshRawHosts()

    newHostForm.ipAddress = '127.0.0.1'
    newHostForm.host = 'local.'

    const modal = document.getElementById('hosts-add-modal')
    const bootstrapModal = $bootstrap.Modal.getInstance(modal)

    bootstrapModal.hide()
  } catch (e) {
    console.error(e)
  }
}

async function deleteHost () {
  try {
    const data = await $fetch('/api/hosts', {
      method: 'delete',
      body: {
        host: deletingHost.value
      }
    })

    await refreshRawHosts()

    const modal = document.getElementById('hosts-remove-modal')
    const bootstrapModal = $bootstrap.Modal.getInstance(modal)

    bootstrapModal.hide()
  } catch (e) {
    console.error(e)
  }
}

function onAddClick () {
  validationErrors.value = {}
  newHostForm.ipAddress = '127.0.0.1'
  newHostForm.host = 'local.'
}

function onDeleteClick (host: string) {
  deletingHost.value = host
}
</script>


<style scoped></style>

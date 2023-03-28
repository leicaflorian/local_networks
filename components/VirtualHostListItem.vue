<script lang="ts" setup>
import { PropType } from '@vue/runtime-core'
import { VHost } from '~/@types/VHost'
import { ComputedRef } from 'vue'

const props = defineProps({
  vHost: {
    type: Object as PropType<VHost>,
    required: true
  }
})

const vHost: ComputedRef<VHost> = computed(() => props.vHost)
</script>

<template>
  <li class="list-group-item">
    <div class="flex-grow-1">
      <strong>ServerName</strong>: {{ vHost?.serverName }}<br>
      <strong>ServerAlias</strong>: {{ vHost?.serverAlias }}<br>
      <strong>ProxyPass</strong>: from <strong>{{ vHost?.proxyPass[0] }}</strong> to <strong>{{
        vHost?.proxyPass[1]
      }}</strong><br>
      <strong>ProxyPassReverse</strong>: from <strong>{{ vHost?.proxyPassReverse[0] }}</strong> to
      <strong>{{ vHost?.proxyPassReverse[1] }}</strong>
    </div>

    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#vhosts-remove-modal"
              @click="$emit('removeHost')">Remove
      </button>
    </div>
  </li>
</template>
<style scoped lang="scss">
.list-group-item {
  display:         flex;
  justify-content: space-between;
  align-items:     center;
  overflow:        hidden;

  .btn-group {
    opacity:    0;
    transform:  translateX(120%);
    transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
  }

  &:hover {
    .btn-group {
      opacity:   1;
      transform: translateX(0);
    }
  }
}
</style>

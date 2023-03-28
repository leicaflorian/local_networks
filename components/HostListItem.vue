<script lang="ts" setup>

</script>

<template>
  <li class="list-group-item">
    <div class="flex-grow-1">
      <slot></slot>
    </div>

    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#hosts-remove-modal"
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

<template>

  <ul class="nav nav-tabs">
    <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="#"
         data-bs-toggle="tab" data-bs-target="#hosts-tab-pane" type="button" role="tab" aria-controls="hosts-tab-pane"
         aria-selected="true">Hosts</a>
    </li>
    <li class="nav-item">
      <a class="nav-link"
         data-bs-toggle="tab" data-bs-target="#vhosts-tab-pane" type="button" role="tab" aria-controls="vhosts-tab-pane"
         aria-selected="true">Virtual Hosts</a>
    </li>
  </ul>

  <div class="tab-content" id="myTabContent">
    <div class="tab-pane fade show active" id="hosts-tab-pane" role="tabpanel" aria-labelledby="hosts-tab" tabindex="0">
      <Hosts></Hosts>
    </div>
    <div class="tab-pane fade" id="vhosts-tab-pane" role="tabpanel" aria-labelledby="vhosts-tab" tabindex="1">
      <VirtualHosts></VirtualHosts>
    </div>
  </div>


</template>

<script lang="ts">
export default defineComponent({
  name: 'index'
})
</script>

<style scoped>

</style>

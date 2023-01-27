<template>
  <div
    v-if="time_frame.includes('1y')"
    class="font-normal text-[12px] inline float-right pr-[3%]"
  >
    <button
      v-for="item in time_frame"
      :key="item.id"
      class="w-[50px] ml-[4px] py-[4px] rounded-lg bg-black"
      :class="[
        time_fetch == item.toString().toLowerCase()
          ? 'activeBtn'
          : 'disableBtn',
      ]"
      :disabled="disabled"
      @click="time_fetch = item.toString().toLowerCase()"
    >
      {{ item }}
    </button>
  </div>
  <div v-else class="font-normal text-[12px] inline float-right pr-[3%]">
    <button
      v-for="item in time_frame"
      :key="item.id"
      class="w-[70px] ml-[4px] py-[2px] rounded-lg"
      :class="[
        time_fetch == item.toString().toLowerCase()
          ? 'activeBtn'
          : 'disableBtn',
      ]"
      :disabled="disabled"
      @click="time_fetch = item.toString().toLowerCase()"
    >
      {{ item }}
    </button>
  </div>
</template>
<script>
export default {
  name: "time-frame",
  props: {
    time_frame: { type: Array },
    disabled: { type: Boolean },
  },
  data: (vm) => ({
    time_fetch: vm.time_frame[0].toString().toLowerCase(),
  }),
  watch: {
    time_fetch: {
      handler() {
        // console.log(this.time_fetch);
        this.$emit("set_time_frame", this.time_fetch);
      },
    },
  },
  methods: {},
};
</script>

<style scoped>
.activeBtn {
  background-color: rgb(64, 64, 68);
}
button.disableBtn:hover {
  background-color: rgb(55 65 81);
}
</style>

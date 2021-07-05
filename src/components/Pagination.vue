<template>
  <div class="flex flex-inline w-full my-5">
    <div class="w-1/3 pr-1" @click="changePage(--currentPage)">
      <button
        :disabled="currentPage == 1"
        class="disabled:opacity-50 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-xbox hover:bg-green-600"
      >
        &lt;&lt;&nbsp; Previous
      </button>
    </div>

    <div class="w-1/3 px-1">
      <div class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-xbox">
        {{ currentPage }}
        /
        {{ totalPages }}
      </div>
    </div>

    <div class="w-1/3 pl-1" @click="changePage(++currentPage)">
      <button
        :disabled="currentPage == totalPages"
        class="disabled:opacity-50 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-xbox hover:bg-green-600"
      >
        Next &nbsp;&gt;&gt;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: this.currentPage || 1
    }
  },
  props: ['totalPages', 'currentPage'],
  methods: {
    changePage(newPage) {
      this.$emit('changedPage', newPage)
    }
  }
}
</script>
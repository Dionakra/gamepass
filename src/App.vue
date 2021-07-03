<template>
  <main class="container mx-auto px-3">
    <div class="flex flex-wrap justify-center items-center">
      <div class="w-full flex justify-center">
        <!-- HEADER -->
        <div class="block space-y-3 w-full md:w-1/3 py-3">
          <!-- TITLE -->
          <div class="justify-center w-full">
            <h1 class="text-center text-3xl font-extrabold text-gray-900">
              GamePass Duration
            </h1>
          </div>
          <!-- END TITLE -->

          <!-- SEARCH -->
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="searchterm" class="sr-only">Search Term</label>
              <input
                v-model="searchTerm"
                id="searchterm"
                name="searchterm"
                type="text"
                required
                class="
                  appearance-none
                  relative
                  block
                  w-full
                  px-3
                  py-2
                  border border-gray-300
                  placeholder-gray-500
                  text-gray-900
                  rounded-md
                  focus:outline-none
                  focus:ring-indigo-500
                  focus:border-indigo-500
                  focus:z-10
                  sm:text-sm
                "
                placeholder="Search for your game!"
              />
            </div>
          </div>

          <div>
            <button
              @click="search"
              type="submit"
              class="
                group
                relative
                w-full
                flex
                justify-center
                py-2
                px-4
                border border-transparent
                text-sm
                font-medium
                rounded-md
                text-white
                bg-indigo-600
                hover:bg-indigo-700
                focus:outline-none
                focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              "
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3" />
              Search!
            </button>
          </div>
          <!-- END SEARCH -->
        </div>
        <!-- END HEADER -->
      </div>

      <Pagination
        :totalPages="totalPages"
        :currentPage="currentPage"
        @changedPage="(newPage) => (currentPage = newPage)"
      />

      <!-- RESULTS -->
      <div class="flex w-full" id="games">
        <div class="flex flex-wrap w-full" role="list">
          <div
            v-for="game in pageContent()"
            :key="game.id"
            class="
              cursor-pointer
              flex flex-col
              w-1/2
              md:w-1/3
              lg:w-1/4
              xl:w-1/5
              2xl:w-1/6
              px-1
              pb-3
            "
            role="listitem"
          >
            <div
              class="
                rounded
                overflow-hidden
                hover:shadow-lg
                border-r border-b border-l border-gray-300
                flex-1
              "
            >
              <img
                class="w-full"
                :src="game.img"
                :alt="game.title"
                :title="game.title"
                loading="lazy"
              />
              <div class="px-2 py-2">
                <div class="font-bold text-md">{{ game.title }}</div>
                <div class="text-sm text-gray-600">{{ game.category }}</div>
              </div>
              <div class="pl-3 space-y-3 pb-3">
                <div class="flex flex-inline h-5">
                  {{ game.duration }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END RESULTS-->

      <Pagination
        :totalPages="totalPages"
        :currentPage="currentPage"
        @changedPage="(newPage) => (currentPage = newPage)"
      />
    </div>
  </main>
</template>

<script>
import Pagination from "./components/Pagination.vue";
const ITEMS_PER_PAGE = 30;

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      // REST data
      games: [],
      loaded: false,
      // Pagination
      currentPage: 1,
      totalPages: 0,
      // Other
      searchTerm: undefined,
    };
  },
  created() {
    fetch(
      "https://raw.githubusercontent.com/Dionakra/gamepass/main/public/index.json"
    )
      .then((response) => response.json())
      .then((data) => {
        this.games = data.sort((a, b) => a.duration - b.duration);
        this.loaded = true;
      });
  },
  methods: {
    resetPage() {
      this.currentPage = 1;
    },
    pageContent() {
      const games = this.filterGames();
      this.totalPages = Math.floor(games.length / ITEMS_PER_PAGE) + 1;
      return games.slice(
        (this.currentPage - 1) * ITEMS_PER_PAGE,
        this.currentPage * ITEMS_PER_PAGE
      );
    },
    filterGames() {
      return this.games;
    },
  },
};
</script>

<template>
  <h1 class="text-3xl text-center font-bold text-gris">Find your next GamePass game by duration</h1>
  <div class="hidden md:block text-center mb-3 text-xs">
    <p>Games information extracted from <a class="text-xbox" href="https://www.xbox.com/en-US/xbox-game-pass/games" target="_blank" rel="noopener">Game Pass Library</a>.</p>
    <p>Duration information extracted from <a class="text-xbox" href="https://howlongtobeat.com/" target="_blank" rel="noopener">HowLongToBeat</a> (only Main Story).</p>
  </div>

  <div class="flex bg-white w-full flex-wrap md:flex-inline justify-center pb-4">
    <img class="hidden md:block h-36" src="/logo.svg" />
    <div class="ml-0 md:ml-16">
      <div class="flex flex-inline mb-3">
        <input v-model="searchTerm" type="text" class="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md" placeholder="Search for your game!" />
      </div>

      <div class="flex flex-inline justify-center">
        <button class="mx-2 text-white font-bold w-12 rounded-lg p-2 h-12" @click="addPlatform('PC')" :class="platforms.includes('PC') ? 'bg-xbox' : 'bg-gris'">
          <IconPC />
        </button>

        <button class="mx-2 text-white font-bold w-12 rounded-lg p-2 h-12" @click="addPlatform('XBOX')" :class="platforms.includes('XBOX') ? 'bg-xbox' : 'bg-gris'">
          <IconXbox />
        </button>

        <button class="mx-2 text-white font-bold w-12 rounded-lg p-2 h-12" @click="addPlatform('XCLOUD')" :class="platforms.includes('XCLOUD') ? 'bg-xbox' : 'bg-gris'">
          <IconXCloud />
        </button>
      </div>

      <div class="flex flex-inline justify-center space-x-2 mt-2 text-white font-semibold">
        <button @click="sortByDuration = true" class="rounded-md px-2 py-1" :class="sortByDuration ? 'bg-xbox' : 'bg-gris'">Shortest</button>
        <button @click="sortByDuration = false" class="rounded-md px-2 py-1" :class="sortByDuration ? 'bg-gris' : 'bg-xbox'">Newest</button>
      </div>
    </div>
  </div>

  <div class="bg-gris">
    <main class="container mx-auto px-3">
      <div class="flex flex-wrap justify-center items-center">
        <div class="text-center text-white mt-3 font-semibold">
          <p>
            Total Games: <span class="font-light">{{ filterGames().length }}</span>
          </p>
          <p>
            Total PlayTime:
            <span class="font-light">
              {{ playTime() }} hours <span class="text-xs">(~ {{ Math.round(playTime() / 24) }} days)</span></span
            >
          </p>
        </div>

        <Pagination :totalPages="totalPages" :currentPage="currentPage" @changedPage="(newPage) => (currentPage = newPage)" />

        <div class="flex flex-wrap w-full" role="list">
          <div v-for="game in pageContent()" :key="game.id" class="flex flex-col w-1/2 md:w-1/3 lg:w-1/5 xl:w-1/6 px-1 pb-4" role="listitem">
            <div class="rounded overflow-hidden flex-1 bg-white">
              <a class="cursor-pointer" target="_blank" rel="noopener" :href="'https://www.microsoft.com/en-us/store/p/' + game.linkTitle + '/' + game.id">
                <div class="relative">
                  <img
                    class="w-full"
                    :src="'https://raw.githubusercontent.com/Dionakra/gamepass/main/public/covers/' + game.id + '.jpeg'"
                    :alt="game.title"
                    :title="game.title"
                    loading="lazy"
                  />
                  <div class="absolute bg-xbox text-white shadow-md bottom-2 right-2 font-bold rounded-full h-11 w-11 pt-1 text-xl text-center">
                    <span class="align-middle">
                      {{ game.duration }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-inline justify-center my-1">
                  <div class="mx-2 text-white font-bold rounded-lg p-1 w-8 h-8" :class="game.platforms.includes('PC') ? 'bg-xbox' : 'bg-gris'">
                    <IconPC />
                  </div>
                  <div class="mx-2 text-white font-bold rounded-lg p-1 w-8 h-8" :class="game.platforms.includes('XBOX') ? 'bg-xbox' : 'bg-gris'">
                    <IconXbox />
                  </div>
                  <div class="mx-2 text-white font-bold rounded-lg p-1 w-8 h-8" :class="game.platforms.includes('XCLOUD') ? 'bg-xbox' : 'bg-gris'">
                    <IconXCloud />
                  </div>
                </div>
                <div class="border-l border-r">
                  <div class="px-2 mb-2">
                    <div class="font-bold text-md">{{ game.title }}</div>
                    <div class="text-sm text-gray-600">{{ game.category }}</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <Pagination :totalPages="totalPages" :currentPage="currentPage" @changedPage="(newPage) => (currentPage = newPage)" />
      </div>
    </main>
  </div>
</template>

<script>
import Pagination from './components/Pagination.vue'
import IconPC from './components/IconPC.vue'
import IconXbox from './components/IconXbox.vue'
import IconXCloud from './components/IconXCloud.vue'
const ITEMS_PER_PAGE = 30

export default {
  components: {
    Pagination,
    IconPC,
    IconXbox,
    IconXCloud
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
      platforms: [],
      sortByDuration: true
    }
  },
  created() {
    fetch('https://raw.githubusercontent.com/Dionakra/gamepass/main/public/index.json')
      .then((response) => response.json())
      .then((data) => {
        this.games = data
        this.loaded = true
      })
  },
  methods: {
    resetPage() {
      this.currentPage = 1
    },
    pageContent() {
      const games = this.filterGames()
      this.totalPages = Math.floor(games.length / ITEMS_PER_PAGE) + 1
      return games.slice((this.currentPage - 1) * ITEMS_PER_PAGE, this.currentPage * ITEMS_PER_PAGE)
    },
    filterGames() {
      return this.games
        .filter((game) => {
          let res = true
          if (this.searchTerm && this.searchTerm.trim() != '') {
            res = game.title.toLowerCase().includes(this.searchTerm.toLowerCase())
          }
          return res
        })
        .filter((game) => {
          if (this.platforms.length == 0) {
            return true
          }

          return game.platforms.filter((p) => this.platforms.includes(p)).length > 0
        })
        .sort((a, b) => {
          let res = 0
          if (this.sortByDuration) {
            res = (a.duration || 0) - (b.duration || 0)
          } else {
            res = b.startDate.localeCompare(a.startDate)
          }

          return res == 0 ? a.title.localeCompare(b.title) : res
        })
    },
    addPlatform(platform) {
      const index = this.platforms.indexOf(platform)
      if (index > -1) {
        this.platforms.splice(index, 1)
      } else {
        this.platforms.push(platform)
      }
      this.currentPage = 1
    },
    playTime() {
      return this.filterGames()
        .filter((x) => x.duration < 500)
        .reduce((acc, cur) => acc + cur.duration, 0)
    }
  }
}
</script>

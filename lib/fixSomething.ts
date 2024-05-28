import GamePassService from "./services/GamePassService"
import fs from "fs"
import GamePassProduct from "./models/GamePassProduct"

const FILE_PATH = __dirname + "/../public/index.json"

main()

async function main() {
  const gamePass = new GamePassService(FILE_PATH)
  const games: GamePassProduct[] = JSON.parse(gamePass.getOldProductsText())

  await gamePass.fetchGames()
  const ids = await gamePass.getAllIds()
  const details = await gamePass.fetchDetails(ids)

  console.log(details.filter(x => x.comingSoonConsole).map(x => x.title))

  for (let game of games) {
    const detail = details.find(x => x.id == game.id)

    if (detail) {
      game.comingSoonConsole = detail.comingSoonConsole || false
      game.comingSoonPC = detail.comingSoonPC || false
      game.leavingSoonConsole = detail.leavingSoonConsole || false
      game.leavingSoonPC = detail.leavingSoonPC || false
      game.localCoop = detail.localCoop
      game.localMultiplayer = detail.localMultiplayer
      game.onlineCoop = detail.onlineCoop
      game.onlineMultiplayer = detail.onlineMultiplayer
    }
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(games))

}

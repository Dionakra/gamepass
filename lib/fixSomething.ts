import GamePassService from "./services/GamePassService"
import HowLongToBeatService from "./services/HowLongToBeatService"
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
      game.comingSoonConsole = detail.comingSoonConsole
      game.comingSoonPC = detail.comingSoonPC
      game.leavingSoonConsole = detail.leavingSoonConsole
      game.leavingSoonPC = detail.leavingSoonPC
    }
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(games))

}

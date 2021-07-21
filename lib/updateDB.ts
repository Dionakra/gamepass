import GamePassService from "./services/GamePassService"
import HowLongToBeatService from "./services/HowLongToBeatService"
import fs from "fs"

const FILE_PATH = __dirname + "/../public/index.json"

main()

async function main() {
  const gamePass = new GamePassService(FILE_PATH)
  const hltb = new HowLongToBeatService()

  await gamePass.fetchGames()
  const ids = await gamePass.getNewIds()
  const details = await gamePass.fetchDetails(ids)
  const products = await gamePass.getFinalProducts(details)
  const withoutDuration = products.filter(p => !p.duration)

  for (let product of withoutDuration) {
    console.log(` Processing ${product.title}...`)
    product.duration = await hltb.getDuration(product.title)
  }

  if(gamePass.getOldProductsText() == JSON.stringify(products)){
    console.log("No change :)")
    return
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(products))

  const stillNoDuration = products.filter(x => !x.duration).map(x => x.title)

  if (stillNoDuration.length > 0) {
    console.log("****************")
    console.log("Products without duration")
    console.log(stillNoDuration)
    process.exit(-1)
  }
}

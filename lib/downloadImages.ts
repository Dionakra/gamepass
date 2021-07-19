import fs from "fs"
import sharp from "sharp"
import GamePassProduct from "./models/GamePassProduct"
import fetch from "node-fetch"

const WIDTH = 300
const DB_FILE = __dirname + "/../public/index.json"

downloadImages(WIDTH)

async function downloadImages(width: number) {
  const games: GamePassProduct[] = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"))

  for (let game of games) {
    if (game.img) {
      console.log(`Downloading ${game.title}`)
      const buffer = await fetch(game.img.replace("//", "https://")).then(response => response.buffer())
      await sharp(buffer).resize(width).jpeg().toFile(__dirname + "/../public/covers/" + game.id + ".jpeg")
      game.img = undefined
    }
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(games))
}
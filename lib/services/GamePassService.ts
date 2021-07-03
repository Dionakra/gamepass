import fetch from "node-fetch"
import GamePassProduct from "../models/GamePassProduct"
import fs from "fs"

export default class GamePassService {
  private xbox: string[] = []
  private pc: string[] = []
  private xcloud: string[] = []

  private oldProducts: GamePassProduct[] = []

  private CATEGORIES = {
    CONSOLE: "f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e",
    PC: "fdd9e2a7-0fee-49f6-ad69-4354098401ff",
    XCLOUD: "29a81209-df6f-41fd-a528-2ae6b91f719c"
  }

  // Things to remove from titles
  private titleRubbish: string[] = ["™", "®", "- Windows 10 Edition", ": Console Edition", "- Xbox One Edition", "Xbox Edition", "Xbox One & Xbox Series X|S",
    "Xbox One", "Xbox Series X|S", "Xbox Series X | S", "for Windows 10", "(PC)", "- PC", "PC", "- Windows Edition", "(Windows)", "Win10", "- Windows 10",
    "(Windows 10)", "Windows 10", "WIN10", " WINDOWS EDITION", ": Windows Edition", "Windows", "XB1", " - Microsoft Store Edition",
    ": https://partner.microsoft.com/en-us/dashboard/products/9NF83PRZK6K3/listingsChapters 1-3", "Explorer's Edition", "Complete Edition",
    ": Standard Edition", "- Standard Edition", "SEASON UPDATE STANDARD EDITION", "Game of the Year Edition", ": Standard", "- Game Preview", "Standard Edition",
    ": Reloaded", ": Definitive Edition", ": Legendary Edition", "(Game Preview)", ": Juggernaut Edition", " - Deluxe Edition", ": Complete Collection",
    ": Deluxe Edition", ": Cadet Edition", "- Ultimate Edition", ": Hero Edition"]


  constructor(dbPath: string) {
    const text = fs.readFileSync(dbPath, "utf-8")
    this.oldProducts = JSON.parse(text)
  }

  getOldProducts() {
    return this.oldProducts
  }

  async fetchGames(): Promise<void> {
    this.xbox = await this.fetchCategoryGames(this.CATEGORIES.CONSOLE)
    this.pc = await this.fetchCategoryGames(this.CATEGORIES.PC)
    this.xcloud = await this.fetchCategoryGames(this.CATEGORIES.XCLOUD)
  }

  private allIds(): string[] {
    return [...new Set([...this.xbox, ...this.pc, ...this.xcloud])]
  }

  getNewIds(): string[] {
    const oldProductIds = this.oldProducts.map(p => p.id)
    return this.allIds().filter(id => !oldProductIds.includes(id))
  }

  async fetchDetails(ids: string[]): Promise<GamePassProduct[]> {
    if (ids.length == 0) {
      return []
    }

    const data = await fetch("https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=" + ids.join(",") + "&market=GB&languages=en-en&MS-CV=DGU1mcuYo0WMMp+F.1")
      .then(response => response.json())

    return data.Products.map((game: any) => {
      const props = game.LocalizedProperties[0]
      return {
        id: game.ProductId,
        developer: props.DeveloperName,
        title: this.cleanTitle(props.ProductTitle),
        img: props.Images.find((image: any) => image.ImagePurpose == "Poster").Uri,
        category: game.Properties.Category,
        platforms: this.getPlatforms(game.ProductId)
      }
    })
  }

  getFinalProducts(products: GamePassProduct[]): GamePassProduct[] {
    const list: GamePassProduct[] = [...this.oldProducts].filter(x => this.allIds().includes(x.id))

    const finalProducts: GamePassProduct[] = []
    for (let product of [...list, ...products]) {
      const exists = finalProducts.find(x => x.title == product.title)

      if (exists) {
        exists.platforms = [...new Set([...exists.platforms, ...product.platforms])]
        exists.title = this.cleanTitle(exists.title)
      } else {
        finalProducts.push(product)
      }
    }

    return finalProducts.sort((a, b) => a.title.localeCompare(b.title))
  }

  private async fetchCategoryGames(category: string): Promise<string[]> {
    const data = await fetch("https://catalog.gamepass.com/sigls/v2?id=" + category + "&language=en-en&market=GB")
      .then(response => response.json())

    return data
      .map((x: { id: string }) => x.id)
      .filter((x: { id: string }) => x != undefined)
  }

  private cleanTitle(title: string): string {
    for (let rubbish of this.titleRubbish) {
      // Twice just in case
      title = title.replace(rubbish, "")
      title = title.replace(rubbish, "")
    }

    title = title.replace("FIFA 21 Standard Edition", "FIFA 21")

    return title.trim()
  }

  private getPlatforms(id: string): string[] {
    const platforms = []

    if (this.xbox.includes(id)) {
      platforms.push("XBOX")
    }
    if (this.pc.includes(id)) {
      platforms.push("PC")
    }
    if (this.xcloud.includes(id)) {
      platforms.push("XCLOUD")
    }
    return platforms
  }

}
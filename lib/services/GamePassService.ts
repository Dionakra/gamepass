import GamePassProduct, { Multiplayer } from "../models/GamePassProduct"
import fs from "fs"
import ProductComingLeaving from "../models/ProductComingLeaving"

export default class GamePassService {
  private xbox: string[] = []
  private pc: string[] = []
  private xcloud: string[] = []
  private comingSoonPC: string[] = []
  private leavingSoonPC: string[] = []
  private comingSoonConsole: string[] = []
  private leavingSoonConsole: string[] = []

  private oldProductsText: string
  private oldProducts: GamePassProduct[] = []

  private CATEGORIES = {
    CONSOLE: "f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e",
    PC: "609d944c-d395-4c0a-9ea4-e9f39b52c1ad",
    XCLOUD: "29a81209-df6f-41fd-a528-2ae6b91f719c",
    COMING_SOON_CONSOLE: "095bda36-f5cd-43f2-9ee1-0a72f371fb96",
    LEAVING_SOON_CONSOLE: "393f05bf-e596-4ef6-9487-6d4fa0eab987",
    COMING_SOON_PC: "4165f752-d702-49c8-886b-fb57936f6bae",
    LEAVING_SOON_PC: "d79ea370-cab3-486c-82ce-e1834c73401d"
  }

  private PLATFORMS = {
    PC: "PC",
    XBOX: "XBOX",
    XCLOUD: "XCLOUD"
  }

  // Things to remove from titles
  private titleRubbish: string[] = [" Cross-Gen Bundle", " Planetary Pack", " Cross-Gen Standard Edition", " - Turbocharged", " : MARCHING FIRE EDITION", " for Xbox One", " for Xbox Series X|S", " Definitive Edition", " Xbox", " for Xbox", "- Game Of The Year Edition",
    " - Digital Edition", " (Xbox Series X|S)", " for Windows + Launcher", " - 2008", " - PC Edition", " EA Play Edition", " - The Prince's Edition", " Preview", " Standard 40th Anniversary Edition", " (Xbox Series X|S & PC)", "(Xbox One)", " (Windows Version)", " - Xbox One Edition",
    " - The Complete Season (Episodes 1-5)", " - The Complete Season", " - Xbox Series X|S", " for Windows + Launcher", " (2010 Edition)", " (2012 Edition)", " Console", "™", "®", "- Windows 10 Edition", ": Console Edition", "- Xbox One Edition", "Xbox Edition", "Xbox One & Xbox Series X|S",
    "Xbox One", "Xbox Series X|S", "Xbox Series X | S", "for Windows 10", "(PC)", "- PC", "PC", "- Windows Edition", "(Windows)", "Win10", "- Windows 10",
    "(Windows 10)", "Windows 10", "WIN10", " WINDOWS EDITION", ": Windows Edition", "Windows", "XB1", " - Microsoft Store Edition",
    ": https://partner.microsoft.com/en-us/dashboard/products/9NF83PRZK6K3/listingsChapters 1-3", "Explorer's Edition", "Complete Edition",
    ": Standard Edition", "- Standard Edition", "SEASON UPDATE STANDARD EDITION", "Game of the Year Edition", ": Standard", "- Game Preview", "Standard Edition",
    ": Reloaded", ": Definitive Edition", ": Legendary Edition", "(Game Preview)", ": Juggernaut Edition", " - Deluxe Edition", ": Complete Collection",
    ": Deluxe Edition", ": Cadet Edition", "- Ultimate Edition", ": Hero Edition", "(Campaign)", "[Xbox]", "- Digital Version", "[Win10]",
    " Premium Edition", " Ultimate Edition", " Year 2 Edition", " Maximum Edition", " Digital Deluxe Edition", " N7 Digital Deluxe Edition", " Deluxe Edition",
    ": Complete Edition", " Special Edition", ": Celebration Edition", " Starter Pack", " Deluxe Party Edition",
    ": Ultimate Edition", " DELUXE EDITION", " Standard Edition", " Remastered Collection", "- Game of the Year Edition", ": Special Edition", "Anniversary Edition", "(Win)", "- Full Bloom Edition", "Remastered", "- Windows", ": Java & Bedrock Edition for PC", " for Windows"].sort((a, b) => b.length - a.length)

  constructor(dbPath: string) {
    const text = fs.readFileSync(dbPath, "utf-8")
    this.oldProductsText = text
    this.oldProducts = JSON.parse(text)
  }

  getOldProductsText(): string {
    return this.oldProductsText
  }

  async fetchGames(): Promise<void> {
    this.xbox = await this.fetchCategoryGames(this.CATEGORIES.CONSOLE)
    this.pc = await this.fetchCategoryGames(this.CATEGORIES.PC)
    this.xcloud = await this.fetchCategoryGames(this.CATEGORIES.XCLOUD)

    this.comingSoonConsole = await this.fetchCategoryGames(this.CATEGORIES.COMING_SOON_CONSOLE)
    this.leavingSoonConsole = await this.fetchCategoryGames(this.CATEGORIES.LEAVING_SOON_CONSOLE)
    this.comingSoonPC = await this.fetchCategoryGames(this.CATEGORIES.COMING_SOON_PC)
    this.leavingSoonPC = await this.fetchCategoryGames(this.CATEGORIES.LEAVING_SOON_PC)
  }

  getAllIds(): string[] {
    return [...new Set([...this.xbox, ...this.pc, ...this.xcloud, ...this.comingSoonConsole, ...this.leavingSoonConsole, ...this.comingSoonPC, ...this.leavingSoonPC])]
  }

  getNewIds(): string[] {
    const oldProductIds = this.oldProducts.map(p => p.id)
    return this.getAllIds().filter(id => !oldProductIds.includes(id))
  }

  async fetchDetails(ids: string[]): Promise<GamePassProduct[]> {
    if (ids.length == 0) {
      return []
    }

    const data = await fetch(`https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${ids.join(",")}&market=GB&languages=en-en&MS-CV=DGU1mcuYo0WMMp+F.1`)
      .then((response: { json: () => any }) => response.json())

    return data.Products.map((game: any) => {
      const props = game.LocalizedProperties[0]
      const id = game.ProductId

      const platforms = this.getPlatforms(id)
      const comingLeaving = this.getComingLeaving(id)
      const imgObj: any | undefined = props.Images.find((image: any) => image.ImagePurpose == "Poster")
      const attributes: any[] = game.Properties.Attributes

      return <GamePassProduct>{
        id: id,
        title: this.cleanTitle(props.ProductTitle),
        img: imgObj ? imgObj.Uri : undefined,
        category: game.Properties.Category,
        platforms: platforms,
        startDate: comingLeaving.startDate,
        linkTitle: props.ProductTitle.toLowerCase().replace(/\s/g, "-").replace(/[^a-z0-9-]/gi, ''),
        comingSoonConsole: comingLeaving.comingSoonConsole,
        leavingSoonConsole: comingLeaving.leavingSoonConsole,
        comingSoonPC: comingLeaving.comingSoonPC,
        leavingSoonPC: comingLeaving.leavingSoonPC,
        localCoop: this.hasProperty(attributes, 'XblLocalCoop'),
        localMultiplayer: this.hasProperty(attributes, 'XblOnlineCoop'),
        onlineCoop: this.hasProperty(attributes, 'XblLocalMultiPlayer'),
        onlineMultiplayer: this.hasProperty(attributes, 'XblOnlineMultiPlayer')
      }
    })
  }

  private hasProperty(properties: any[], name: string): Multiplayer | undefined {
    if (properties == null) {
      return undefined
    }

    const multi: any = properties.find(property => property.Name == name)

    if (multi != undefined) {
      return <Multiplayer>{
        min: multi.Minimum == null ? undefined : multi.Minimum,
        max: multi.Maximum == null ? undefined : multi.Maximum
      }
    } else {
      return undefined
    }
  }

  getFinalProducts(products: GamePassProduct[]): GamePassProduct[] {
    const list: GamePassProduct[] = [...this.oldProducts].filter(x => this.getAllIds().includes(x.id))

    const finalProducts: GamePassProduct[] = []
    for (let product of [...list, ...products]) {
      const comingLeaving = this.getComingLeaving(product.id)
      product.comingSoonPC = comingLeaving.comingSoonPC
      product.comingSoonConsole = comingLeaving.comingSoonConsole
      product.startDate = product.startDate || comingLeaving.startDate
      product.leavingSoonConsole = comingLeaving.leavingSoonConsole
      product.leavingSoonPC = comingLeaving.leavingSoonPC
      product.platforms = this.getPlatforms(product.id)

      const exists = finalProducts.find(x => x.title.toLowerCase() == product.title.toLowerCase())

      if (exists) {
        exists.platforms = [...new Set([...exists.platforms, ...product.platforms])]
        exists.title = this.cleanTitle(exists.title)
        exists.comingSoonConsole ||= product.comingSoonConsole
        exists.leavingSoonConsole ||= product.leavingSoonConsole
        exists.comingSoonPC ||= product.comingSoonPC
        exists.leavingSoonPC ||= product.leavingSoonPC
      } else {
        finalProducts.push(product)
      }
    }

    return finalProducts.sort((a, b) => a.title.localeCompare(b.title))
  }

  private getComingLeaving(id: string): ProductComingLeaving {
    const platforms = this.getPlatforms(id)
    const comingSoonPC = this.comingSoonPC.some(x => x == id)
    const comingSoonConsole = this.comingSoonConsole.some(x => x == id)

    let startDate = undefined
    if ((!comingSoonPC && platforms.includes(this.PLATFORMS.PC)) || (!comingSoonConsole && platforms.includes(this.PLATFORMS.XBOX))) {
      startDate = new Date().toISOString().substr(0, 10)
    }

    return <ProductComingLeaving>{
      id: id,
      comingSoonConsole: comingSoonConsole,
      comingSoonPC: comingSoonPC,
      startDate: startDate,
      leavingSoonConsole: this.leavingSoonConsole.some(x => x == id),
      leavingSoonPC: this.leavingSoonPC.some(x => x == id)
    }
  }

  private async fetchCategoryGames(category: string): Promise<string[]> {
    const data: any = await fetch(`https://catalog.gamepass.com/sigls/v2?id=${category}&language=en-en&market=GB`)
      .then(response => response.json())

    return data
      .map((x: { id: string }) => x.id)
      .filter((x: { id: string }) => x != undefined)
  }

  private cleanTitle(title: string): string {
    for (let rubbish of this.titleRubbish) {
      title = title.split(rubbish).join("").trim()
    }

    // Custom fuckeries
    title.replace("Dragon Age II", "Dragon Age 2")
    return title
  }

  private getPlatforms(id: string): string[] {
    const platforms = []

    if (this.xbox.includes(id) || this.comingSoonConsole.includes(id)) {
      platforms.push(this.PLATFORMS.XBOX)
    }
    if (this.pc.includes(id) || this.comingSoonPC.includes(id)) {
      platforms.push(this.PLATFORMS.PC)
    }
    if (this.xcloud.includes(id)) {
      platforms.push(this.PLATFORMS.XCLOUD)
    }

    return platforms
  }
}

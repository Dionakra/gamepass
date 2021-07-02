const fetch = require("node-fetch")
const fs = require("fs")

const GRACE_TIME = 500
const FILE_PATH = __dirname + "/../public/index.json"
const CATEGORIES = {
  CONSOLE: "f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e",
  PC: "fdd9e2a7-0fee-49f6-ad69-4354098401ff",
  XCLOUD: "29a81209-df6f-41fd-a528-2ae6b91f719c",
  EXPIRING_SOON_CONSOLE: "393f05bf-e596-4ef6-9487-6d4fa0eab987",
  EXPIRING_SOON_PC: "d79ea370-cab3-486c-82ce-e1834c73401d"
}

refreshGamePass()

async function refreshGamePass() {
  const [xbox, pc, xcloud, expiringConsole, expiringPC] = await Promise.all(Object.values(CATEGORIES).map(fetchGames))
  const productIds = [...new Set([...xbox, ...pc, ...xcloud, ...expiringConsole, ...expiringPC])]

  const previous = getPreviousGames()
  const prevIds = previous.map(x => x.id)

  const newIds = productIds.filter(p => !prevIds.includes(p))
  const stayingProducts = previous.filter(p => productIds.includes(p.id))

  for (let product of stayingProducts) {
    product.platforms = []
    if (xbox.includes(product.id)) {
      product.platforms.push("XBOX")
    }

    if (pc.includes(product.id)) {
      product.platforms.push("PC")
    }

    if (xcloud.includes(product.id)) {
      product.platforms.push("XCLOUD")
    }

    product.expiringConsole = expiringConsole.map(x => x.id).includes(product.id)
    product.expiringPC = expiringPC.map(x => x.id).includes(product.id)
  }

  const productsDetails = await fetchDetails(newIds)
  for (let product of productsDetails) {
    console.log(`Processing ${product.title}...`)
    if (xbox.includes(product.id)) {
      product.platforms.push("XBOX")
    }

    if (pc.includes(product.id)) {
      product.platforms.push("PC")
    }

    if (xcloud.includes(product.id)) {
      product.platforms.push("XCLOUD")
    }

    product.expiringConsole = expiringConsole.map(x => x.id).includes(product.id)
    product.expiringPC = expiringPC.map(x => x.id).includes(product.id)

    const prev = previous.find(x => x.title == product.title && x.id != product.id)
    if (prev) {
      product.platforms = [...new Set([...product.platforms, ...prev.platforms])]
      continue
    }

    product.timeToComplete = await getHowLongToBeatScore(product.title)
    await sleep(GRACE_TIME)
  }

  const products = [...stayingProducts, ...productsDetails]

  const uniqueProducts = products
    .sort((a, b) => {
      const res = a.title.localeCompare(b.title)
      return res == 0 ? a.id.localeCompare(b.id) : res
    })
    .map(product => {
      const sameTitle = products.find(x => x.title == product.title && x.id != product.id)

      if (sameTitle != undefined) {
        product.platforms = [...new Set([...product.platforms, ...sameTitle.platforms])]
      }
      return product
    }).filter((product, index) => {
      return index == products.findIndex(p => p.title == product.title)
    })

  fs.writeFileSync(FILE_PATH, JSON.stringify(uniqueProducts))

  const noTime = uniqueProducts.filter(x => !x.timeToComplete)
  if (noTime.length > 0) {
    noTime.forEach(x => console.log(x.title))
    process.exit(-1)
  }

}

/*
##     ## ######## #### ##        ######  
##     ##    ##     ##  ##       ##    ## 
##     ##    ##     ##  ##       ##       
##     ##    ##     ##  ##        ######  
##     ##    ##     ##  ##             ## 
##     ##    ##     ##  ##       ##    ## 
 #######     ##    #### ########  ######  
*/
function getPreviousGames() {
  const content = fs.readFileSync(FILE_PATH, "utf-8")
  return JSON.parse(content)
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Remove all things related to PC versions
function cleanTitle(title) {
  return title
    .replace("™", "")
    .replace("®", "")
    .replace("- Windows 10 Edition", "")
    .replace(": Console Edition", "")
    .replace("- Xbox One Edition", "")
    .replace("Xbox Edition", "")
    .replace("Xbox One & Xbox Series X|S", "")
    .replace("Xbox One", "")
    .replace("Xbox Series X|S", "")
    .replace("Xbox Series X | S", "")
    .replace("for Windows 10", "")
    .replace("(PC)", "")
    .replace("- PC", "")
    .replace("PC", "")
    .replace("- Windows Edition", "")
    .replace("(Windows)", "")
    .replace("Win10", "")
    .replace("- Windows 10", "")
    .replace("(Windows 10)", "")
    .replace("Windows 10", "")
    .replace("WIN10", "")
    .replace(" WINDOWS EDITION", "")
    .replace(": Windows Edition", "")
    .replace("Windows", "")
    .replace("XB1", "")
    .replace(" - Microsoft Store Edition", "")
    .replace("™", "")
    .replace(": https://partner.microsoft.com/en-us/dashboard/products/9NF83PRZK6K3/listingsChapters 1-3", "")
    .replace("FIFA 21 Standard Edition", "FIFA 21")
    .trim()
}

/*
##     ## ########   #######  ##     ## 
 ##   ##  ##     ## ##     ##  ##   ##  
  ## ##   ##     ## ##     ##   ## ##   
   ###    ########  ##     ##    ###    
  ## ##   ##     ## ##     ##   ## ##   
 ##   ##  ##     ## ##     ##  ##   ##  
##     ## ########   #######  ##     ## 
*/
function fetchGames(category) {
  return new Promise(resolve => {
    fetch("https://catalog.gamepass.com/sigls/v2?id=" + category + "&language=en-en&market=GB")
      .then(response => response.json())
      .then(data => {
        const ids = data.map(x => x.id).filter(x => x != undefined)
        resolve(ids)
      });
  })
}

function fetchDetails(ids) {
  return new Promise(resolve => {
    if (ids.length == 0) {
      resolve([])
    } else {
      fetch("https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=" + ids.join(",") + "&market=GB&languages=en-en&MS-CV=DGU1mcuYo0WMMp+F.1")
        .then(response => response.json())
        .then(data => {
          const info = data.Products.map(game => {
            const props = game.LocalizedProperties[0]
            return {
              id: game.ProductId,
              developer: props.DeveloperName,
              title: cleanTitle(props.ProductTitle),
              img: props.Images.find(image => image.ImagePurpose == "Poster").Uri,
              category: game.Properties.Category,
              platforms: []
            }
          })

          resolve(info)
        })
    }
  })
}

/*
##     ##  #######  ##      ## ##        #######  ##    ##  ######   ########  #######  ########  ########    ###    ######## 
##     ## ##     ## ##  ##  ## ##       ##     ## ###   ## ##    ##     ##    ##     ## ##     ## ##         ## ##      ##    
##     ## ##     ## ##  ##  ## ##       ##     ## ####  ## ##           ##    ##     ## ##     ## ##        ##   ##     ##    
######### ##     ## ##  ##  ## ##       ##     ## ## ## ## ##   ####    ##    ##     ## ########  ######   ##     ##    ##    
##     ## ##     ## ##  ##  ## ##       ##     ## ##  #### ##    ##     ##    ##     ## ##     ## ##       #########    ##    
##     ## ##     ## ##  ##  ## ##       ##     ## ##   ### ##    ##     ##    ##     ## ##     ## ##       ##     ##    ##    
##     ##  #######   ###  ###  ########  #######  ##    ##  ######      ##     #######  ########  ######## ##     ##    ##    
*/
function getHowLongToBeatScore(title) {
  return new Promise(async resolve => {
    fetch("https://howlongtobeat.com/search_results?page=1", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "body": "queryString=" + title + "&t=games&sorthead=popular&sortd=Normal Order&plat=&length_type=main&length_min=&length_max=&v=&f=&g=&detail=&randomize=0",
      "method": "POST"
    }).then(response => response.text()).then(response => {
      const playTime = parseHowLongToBeatHTML(response)

      resolve(playTime)
    });
  })
}

function parseHowLongToBeatHTML(str) {
  const regex = /<div.*?Main Story.*?<div.*?>(.*?)<\/div>/ms;
  let result = str.match(regex)

  if (result == null) {
    const soloRegex = /<div.*?Solo.*?<div.*?>(.*?)<\/div>/ms;
    result = str.match(soloRegex)

    if (result == null) {
      const vsRegex = /<div.*?Vs.*?<div.*?>(.*?)<\/div>/ms;
      result = str.match(vsRegex)
    }
  }

  if (result != null) {
    return parseFloat(result[1].replace("Hours", "").replace("&#189;", ".5").trim())
  } else {
    return undefined
  }
}
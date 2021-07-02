import fetch from "node-fetch"

export default class HowLongToBeatService {
  constructor() {
  }

  async getDuration(title: string): Promise<Number | undefined> {
    const html = await fetch("https://howlongtobeat.com/search_results?page=1", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "body": "queryString=" + title + "&t=games&sorthead=popular&sortd=Normal Order&plat=&length_type=main&length_min=&length_max=&v=&f=&g=&detail=&randomize=0",
      "method": "POST"
    }).then(response => response.text())

    return this.parseHowLongToBeatHTML(html)
  }

  private parseHowLongToBeatHTML(str: string): Number | undefined {
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

}
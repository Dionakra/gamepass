export default class HowLongToBeatService {
  constructor() {
  }

  async getDuration(title: string): Promise<Number | undefined> {
    const response = await fetch("https://howlongtobeat.com/api/search", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "Referer": "https://howlongtobeat.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"searchType\":\"games\",\"searchTerms\":[\"" + title + "\"],\"searchPage\":1,\"size\":20,\"searchOptions\":{\"games\":{\"userId\":0,\"platform\":\"\",\"sortCategory\":\"popular\",\"rangeCategory\":\"main\",\"rangeTime\":{\"min\":null,\"max\":null},\"gameplay\":{\"perspective\":\"\",\"flow\":\"\",\"genre\":\"\"},\"rangeYear\":{\"min\":\"\",\"max\":\"\"},\"modifier\":\"\"},\"users\":{\"sortCategory\":\"postcount\"},\"lists\":{\"sortCategory\":\"follows\"},\"filter\":\"\",\"sort\":0,\"randomizer\":0},\"useCache\":false}",
      "method": "POST"
    }).then(response => response.json())

    let duration: Number | undefined = undefined

    if (response && response.data && response.data.length > 0) {
      if (response.data[0].comp_main) {
        duration = Math.round(response.data[0].comp_main / 3600)
      }
    }

    return duration;
  }

}
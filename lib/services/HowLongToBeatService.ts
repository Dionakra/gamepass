export default class HowLongToBeatService {
  constructor() {
  }

  async getDuration(title: string): Promise<Number | undefined> {
    let duration: Number | undefined = undefined

    const response = await fetch("https://howlongtobeat.com/api/ouch/86d5ef1971943765", {
      "headers": {
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "referer": "https://howlongtobeat.com/?q=indiana",
        "content-type": "application/json",
        "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
      },
      "body": "{\"searchType\":\"games\",\"searchTerms\":[\"" + title + "\"],\"searchPage\":1,\"size\":20,\"searchOptions\":{\"games\":{\"userId\":0,\"platform\":\"\",\"sortCategory\":\"popular\",\"rangeCategory\":\"main\",\"rangeTime\":{\"min\":null,\"max\":null},\"gameplay\":{\"perspective\":\"\",\"flow\":\"\",\"genre\":\"\",\"difficulty\":\"\"},\"rangeYear\":{\"min\":\"\",\"max\":\"\"},\"modifier\":\"\"},\"users\":{\"sortCategory\":\"postcount\"},\"lists\":{\"sortCategory\":\"follows\"},\"filter\":\"\",\"sort\":0,\"randomizer\":0},\"useCache\":true}",
      "method": "POST"
    }).then(response => response.json())

    if (response && response.data && response.data.length > 0) {
      if (response.data[0].comp_main) {
        duration = Math.round(response.data[0].comp_main / 3600)
      }
    }

    return duration;
  }

}
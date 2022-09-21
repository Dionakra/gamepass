import fetch from "node-fetch"

export default class HowLongToBeatService {
  constructor() {
  }

  async getDuration(title: string): Promise<Number | undefined> {
    const response = await fetch("https://howlongtobeat.com/api/search", {
      "headers": {
        "accept": "*/*",
        "accept-language": "es,en-GB;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "Referer": "https://howlongtobeat.com/?q=",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": "{\"searchType\":\"games\",\"searchTerms\":[\"" + title + "\"],\"searchPage\":1,\"size\":20,\"searchOptions\":{\"games\":{\"userId\":0,\"platform\":\"\",\"sortCategory\":\"popular\",\"rangeCategory\":\"main\",\"rangeTime\":{\"min\":0,\"max\":0},\"gameplay\":{\"perspective\":\"\",\"flow\":\"\",\"genre\":\"\"},\"modifier\":\"\"},\"users\":{\"sortCategory\":\"postcount\"},\"filter\":\"\",\"sort\":0,\"randomizer\":0}}",
      "method": "POST"
    }).then(response => response.json())

    let duration: Number | undefined = undefined

    if(response && response.data && response.data.length > 0){
      if(response.data[0].comp_main){
        duration = Math.round(response.data[0].comp_main / 3600)
      }
    }

    console.log(duration)

    return duration;
  }

  whatever() {
    fetch("https://howlongtobeat.com/api/search", {
      "headers": {
        "accept": "*/*",
        "accept-language": "es,en-GB;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Google Chrome\";v=\"105\", \"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"105\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": "_awl=2.1630343707.0.4-ea2a6b99-7f32f91d8e8bfc03b65c1efc22a62442-6763652d6575726f70652d7765737431-612d121b-1; zdconsent=optin; OptanonAlertBoxClosed=2022-08-16T18:04:24.156Z; eupubconsent-v2=CPdy5LAPdy5LAAcABBENChCgAP_AAH_AACiQI8Nf_X__b2_j-_5_f_t0eY1P9_7__-0zjhfdl-8N3f_X_L8X52M7vF36pq4KuR4Eu3LBIQdlHOHcTUmw6okVryPsbk2cr7NKJ7PEmnMbOydYGH9_n1_zuZKY7_____7z_v-v___3__f_7-3f3__p_3_-__e_V_99zfn9_____9vP___9v-_9__________3_7BHYAkw1biALsyxwZtowigRAjCsJDqBQAUUAwtEBhA6uCnZXAT6wgYAIBQBOBECHEFGDAIAABIAkIiAkCPBAIgCIBAACABUAhAAxsAgsALAwCAAUA0LFGKAIQJCDIgIilMCAqRIKCeyoQSg70NMIQ6zwAoNH_FQgI1kDFYEQkLByHBEgJeLJA8xRvkAIwQoBRKgAAAAA.f_gAD_gAAAAA; OptanonConsent=isGpcEnabled=0&datestamp=Wed+Sep+21+2022+22%3A17%3A33+GMT%2B0200+(hora+de+verano+de+Europa+central)&version=6.34.0&isIABGlobal=false&consentId=427e7198-7bbb-41a1-80e3-69817892b290&interactionCount=1&landingPath=NotLandingPage&groups=C0004%3A1%2CC0002%3A1%2CC0003%3A1%2CC0001%3A1%2CSTACK42%3A1&hosts=H1%3A1%2CH16%3A1%2CH17%3A1%2CH35%3A1%2CH36%3A1%2CH132%3A1%2CH52%3A1%2Ckoq%3A1%2CH198%3A1%2CH70%3A1%2CH85%3A1%2CH87%3A1%2CH224%3A1%2CH589%3A1%2CH621%3A1&genVendors=&geolocation=ES%3BAN&AwaitingReconsent=false",

      },
      "body": "{\"searchType\":\"games\",\"searchTerms\":[\"stray\"],\"searchPage\":1,\"size\":20,\"searchOptions\":{\"games\":{\"userId\":0,\"platform\":\"\",\"sortCategory\":\"popular\",\"rangeCategory\":\"main\",\"rangeTime\":{\"min\":0,\"max\":0},\"gameplay\":{\"perspective\":\"\",\"flow\":\"\",\"genre\":\"\"},\"modifier\":\"\"},\"users\":{\"sortCategory\":\"postcount\"},\"filter\":\"\",\"sort\":0,\"randomizer\":0}}",
      "method": "POST"
    });
  }

}
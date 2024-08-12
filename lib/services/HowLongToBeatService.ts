export default class HowLongToBeatService {
  constructor() {
  }

  async getDuration(title: string): Promise<Number | undefined> {
    let duration: Number | undefined = undefined

    try {
      const response = await fetch("https://howlongtobeat.com/api/search/5683ebd079f1c360", {
        "headers": {
          "cookie": "zdconsent=optin; OptanonAlertBoxClosed=2024-08-12T10:47:43.367Z; eupubconsent-v2=CQDPAvAQDPAvAAcABBENBBFwAP_gAEPgACiQKYtV_G__bWlr8X73aftkeY1P9_h77sQxBhfJE-4FzLvW_JwXx2ExNA36tqIKmRIAu3bBIQNlHJDUTVCgaogVryDMak2coTNKJ6BkiFMRO2dYCF5vmwtj-QKY5vr993dx2B-t_dr83dzyz4VHn3a5_2a0WJCdA5-tDfv9bROb-9IOd_58v4v8_F_rE2_eT1l_tevp7D9-cts7_XW-9_fff79Ln_-uB_--Cl4BJhoVEAZZEhIQaBhBAgBUFYQEUCAAAAEgaICAEwYFOwMAl1hIgBACgAGCAEAAKMgAQAACQAIRABAAUCAACAQKAAMACAYCABgYAAwAWAgEAAIDoEKYEECgWACRmREKYEIQCQQEtlQgkAQIK4QhFngQQCImCgAABIAKwABAWCwOJJASsSCBLiDaAAAgAQCCACoRSdmAIIAzZaq8WTaMrSAtHzBc9pgGAAAA.f_wACHwAAAAA; OptanonConsent=isGpcEnabled=0&datestamp=Mon+Aug+12+2024+12%3A47%3A48+GMT%2B0200+(Central+European+Summer+Time)&version=202406.1.0&browserGpcFlag=0&isIABGlobal=false&consentId=35a10b58-7913-4bd3-a355-297634103a7a&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A1%2CC0002%3A1%2CC0004%3A1%2CV2STACK42%3A1&hosts=H36%3A1%2CH1101%3A1%2CH198%3A1%2CH621%3A1%2CH589%3A1%2CH1%3A1%2CH2%3A1%2Clie%3A1%2CH993%3A1%2CH4%3A1%2CH11%3A1%2CH16%3A1%2CH17%3A1%2CH196%3A1%2CH23%3A1%2CH26%3A1%2CH32%3A1%2CH35%3A1%2CH38%3A1%2CH1191%3A1%2CH39%3A1%2CH43%3A1%2CH375%3A1%2CH45%3A1%2CH211%3A1%2CH290%3A1%2CH132%3A1%2CH49%3A1%2CH51%3A1%2CH52%3A1%2Ckoq%3A1%2CH57%3A1%2CH58%3A1%2Ccpg%3A1%2CH66%3A1%2CH67%3A1%2CH70%3A1%2CH73%3A1%2Cfgs%3A1%2CH78%3A1%2CH184%3A1%2CH79%3A1%2CH1189%3A1%2CH810%3A1%2CH85%3A1%2CH302%3A1%2CH87%3A1%2CH547%3A1%2CH224%3A1%2CH970%3A1%2CH93%3A1&genVendors=&intType=1&geolocation=ES%3B&AwaitingReconsent=false",
        },
        "body": "{\"searchType\":\"games\",\"searchTerms\":[\"" + title + "\"],\"searchPage\":1,\"size\":20,\"searchOptions\":{\"games\":{\"userId\":0,\"platform\":\"\",\"sortCategory\":\"popular\",\"rangeCategory\":\"main\",\"rangeTime\":{\"min\":null,\"max\":null},\"gameplay\":{\"perspective\":\"\",\"flow\":\"\",\"genre\":\"\"},\"rangeYear\":{\"min\":\"\",\"max\":\"\"},\"modifier\":\"\"},\"users\":{\"sortCategory\":\"postcount\"},\"lists\":{\"sortCategory\":\"follows\"},\"filter\":\"\",\"sort\":0,\"randomizer\":0},\"useCache\":true}",
        "method": "POST"
      }).then(response => response.json())

      if (response && response.data && response.data.length > 0) {
        if (response.data[0].comp_main) {
          duration = Math.round(response.data[0].comp_main / 3600)
        }
      }
    } catch (err) {
      // Whatever
    }

    return duration;
  }

}
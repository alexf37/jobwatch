export async function scrapeWellsFargo() {
  const res = await fetch(
    "https://www.wellsfargojobs.com/en/jobs/?search=&country=United+States+of+America&team=Client+Management&pagesize=20&gad_source=1&gad_campaignid=21229779796&gbraid=0AAAAABfgKTd78af4Sv7OZs80EiT3T7dT9",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        priority: "u=0, i",
        "sec-ch-ua": '"Not.A/Brand";v="99", "Chromium";v="136"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        cookie:
          "ASP.NET_SessionId=3kchzmwlrbfltaa2q1midb3u; OptanonConsent=isGpcEnabled=0&datestamp=Sun+May+25+2025+00%3A14%3A18+GMT-0400+(Eastern+Daylight+Time)&version=202408.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=235d49ef-fec1-419c-92f4-3f7c12d5f0fe&interactionCount=1&isAnonUser=1&landingPath=https%3A%2F%2Fwww.wellsfargojobs.com%2Fen%2Fjobs%2F%3Fsearch%3D%26country%3DUnited+States+of+America%26team%3DClient+Management%26pagesize%3D20%26gad_source%3D1%26gad_campaignid%3D21229779796%26gbraid%3D0AAAAABfgKTd78af4Sv7OZs80EiT3T7dT9%23results&groups=BG21%3A1%2CC0001%3A1%2CC0003%3A1%2CC0002%3A1%2CSSPD_BG%3A1%2CC0004%3A1",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
    }
  );
}

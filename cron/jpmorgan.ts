export async function scrapeJpmorgan() {
  const res = await fetch(
    "https://jpmc.fa.oraclecloud.com/hcmRestApi/resources/latest/recruitingCEJobRequisitions?onlyData=true&expand=requisitionList.workLocation,requisitionList.otherWorkLocations,requisitionList.secondaryLocations,flexFieldsFacet.values,requisitionList.requisitionFlexFields&finder=findReqs;siteNumber=CX_1001,facetsList=LOCATIONS%3BWORK_LOCATIONS%3BWORKPLACE_TYPES%3BTITLES%3BCATEGORIES%3BORGANIZATIONS%3BPOSTING_DATES%3BFLEX_FIELDS,limit=25,keyword=%22meme%22,sortBy=RELEVANCY",
    {
      headers: {
        accept: "*/*",
        "accept-language": "en",
        "content-type":
          "application/vnd.oracle.adf.resourceitem+json;charset=utf-8",
        "ora-irc-language": "en",
        "sec-ch-ua": '"Not.A/Brand";v="99", "Chromium";v="136"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie:
          "ORA_FUSION_PREFS=v1.0~bG9jYWxlPWVufmRlZmF1bHRMYW5ndWFnZU1hcmtlcj10cnVl; CX_1001_cookieConsentEnabled=true; ORA_CX_SITE_NUMBER=CX_1001; CX_1001_cookieDeclineAll=true; ORA_FND_SESSION_US2GL1EC_F=DEFAULT_PILLAR:BsVsqIfvZua93Ntx9MQHBIWLVklzBFgX99BwXUfqulfFAJRoFxhvyYQqdpYSaWhw:1748146647367",
        Referer:
          "https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/jobs",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );
}

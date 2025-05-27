import z from "zod";
import type { Listing } from "./types";

const schema = z.object({
  items: z.array(
    z.object({
      requisitionList: z.array(
        z.object({
          Id: z.string(),
          Title: z.string(),
          PrimaryLocationCountry: z.string(),
          JobFamily: z.string(),
          ShortDescriptionStr: z.string(),
          PrimaryLocation: z.string(),
        })
      ),
    })
  ),
});

export async function scrapeJpmorgan() {
  const allJobs = [];
  let offset = 0;
  while (true) {
    const res = await fetch(
      `https://jpmc.fa.oraclecloud.com/hcmRestApi/resources/latest/recruitingCEJobRequisitions?onlyData=true&expand=requisitionList.workLocation,requisitionList.otherWorkLocations,requisitionList.secondaryLocations,flexFieldsFacet.values,requisitionList.requisitionFlexFields&finder=findReqs;siteNumber=CX_1001,facetsList=LOCATIONS%3BWORK_LOCATIONS%3BWORKPLACE_TYPES%3BTITLES%3BCATEGORIES%3BORGANIZATIONS%3BPOSTING_DATES%3BFLEX_FIELDS,limit=200,lastSelectedFacet=CATEGORIES,locationId=300000000289738,selectedCategoriesFacet=300000086153134%3B300000086143853%3B300000086153391%3B300000086153065%3B300000086152826%3B300000086250151%3B300000086249697%3B300000086251667,sortBy=POSTING_DATES_DESC,offset=${offset}`,
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
            "https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/jobs?lastSelectedFacet=CATEGORIES&locationId=300000000289738&selectedCategoriesFacet=300000086153134%3B300000086143853%3B300000086153391%3B300000086153065%3B300000086152826%3B300000086250151%3B300000086249697%3B300000086251667",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );
    const data = schema.parse(await res.json());
    const listings = data.items[0]?.requisitionList ?? [];
    if (listings.length === 0) {
      break;
    }
    const jobListings: Listing[] = [];
    listings.forEach((requisition) => {
      jobListings.push({
        title: `${requisition.Title} (${requisition.JobFamily})`,
        location: requisition.PrimaryLocation,
        description: requisition.ShortDescriptionStr,
        link: `https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/job/${requisition.Id}`,
        company: "JPMorgan Chase",
      });
    });
    allJobs.push(...jobListings);
    offset += 200;
  }
  return allJobs;
}

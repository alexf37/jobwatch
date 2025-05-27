import z from "zod";
import { JSDOM } from "jsdom";
import type { Listing } from "./types";

const schema = z.object({
  filters: z.string(),
  results: z.string(),
  hasJobs: z.boolean(),
  hasContent: z.boolean(),
});

export async function scrapeCiti() {
  const allJobs = [];
  let page = 1;
  while (true) {
    console.log(`Scraping page ${page}`);
    const res = await fetch(
      `https://jobs.citi.com/search-jobs/results?ActiveFacetID=0&CurrentPage=${page}&RecordsPerPage=1000&TotalContentResults=&Distance=50&RadiusUnitType=0&Keywords=Investment+Banking&Location=New+York%2C+NY&Latitude=40.71427&Longitude=-74.00597&ShowRadius=True&IsPagination=False&CustomFacetName=&FacetTerm=&FacetType=0&SearchResultsModuleName=SearchResults+-+Technology&SearchFiltersModuleName=Search+Filters&SortCriteria=0&SortDirection=0&SearchType=1&LocationType=4&LocationPath=6252001-5128638-5128581&OrganizationIds=287&PostalCode=&ResultsType=0&fc=&fl=&fcf=&afc=&afl=&afcf=&TotalContentPages=NaN`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json; charset=utf-8",
          "sec-ch-ua": '"Not.A/Brand";v="99", "Chromium";v="136"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          cookie: "CookieBehavior=US|Implied; CookieConsent=0",
          Referer:
            "https://jobs.citi.com/search-jobs/Investment%20Banking/New%20York%2C%20NY/287/1/4/6252001-5128638-5128581/40x71427/-74x00597/50/2",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: null,
        method: "GET",
      }
    );
    const data = schema.parse(await res.json());
    if (!data.hasJobs) {
      break;
    }
    const document = new JSDOM(data.results).window.document;
    const jobListElement = document.querySelector("#search-results-list > ul");
    if (!jobListElement) {
      throw new Error("Job list element not found");
    }
    const jobElements = document.querySelectorAll(
      "#search-results-list > ul > li"
    );
    if (jobElements.length === 0) {
      return [];
    }
    const jobListings: Listing[] = [];
    jobElements.forEach((e) => {
      const linkElem = e.querySelector("a");
      if (!linkElem) return;
      const link = linkElem.href;
      const title =
        linkElem.querySelector("h3")?.textContent ?? "No title listed";
      const location =
        e.querySelector(".job-location")?.textContent ?? undefined;
      jobListings.push({
        title,
        location,
        link,
        company: "Citi",
      });
    });
    allJobs.push(...jobListings);
    page++;
  }
  return allJobs;
}

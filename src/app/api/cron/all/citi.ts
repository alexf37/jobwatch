export async function scrapeCiti() {
  const res = await fetch(
    "https://jobs.citi.com/search-jobs/results?ActiveFacetID=0&CurrentPage=1&RecordsPerPage=1000&TotalContentResults=&Distance=50&RadiusUnitType=0&Keywords=Investment+Banking&Location=New+York%2C+NY&Latitude=40.71427&Longitude=-74.00597&ShowRadius=True&IsPagination=False&CustomFacetName=&FacetTerm=&FacetType=0&SearchResultsModuleName=SearchResults+-+Technology&SearchFiltersModuleName=Search+Filters&SortCriteria=0&SortDirection=0&SearchType=1&LocationType=4&LocationPath=6252001-5128638-5128581&OrganizationIds=287&PostalCode=&ResultsType=0&fc=&fl=&fcf=&afc=&afl=&afcf=&TotalContentPages=NaN",
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
}

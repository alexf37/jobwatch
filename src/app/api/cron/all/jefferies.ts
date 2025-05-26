// done
// has a captcha
import { JSDOM } from "jsdom";
import type { Listing } from "./types";

export async function scrapeJefferies() {
  const res = await fetch(
    "https://jefferies.tal.net/vx/lang-en-GB/mobile-0/appcentre-ext/brand-4/user-540395/xf-fd8c9394c102/candidate/jobboard/vacancy/2/adv/?f_Item_Opportunity_59801_lk=519869&f_Item_Opportunity_60426_lk=520148&ftq=",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "sec-ch-ua": '"Not.A/Brand";v="99", "Chromium";v="136"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
    }
  );
  const html = await res.text();
  // use jsdom to parse the html, looking for the #tile-results-list id'd element
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const jobList = document.getElementById("tile-results-list");
  if (!jobList) {
    throw new Error("Job list not found");
  }
  const jobElements = document.querySelectorAll("#tile-results-list li");

  const jobs: Listing[] = [];
  jobElements.forEach((e) => {
    const linkElem = e.querySelector("a");
    if (!linkElem) return;
    const link = linkElem.getAttribute("href")!;
    const title = linkElem.textContent!.trim();
    jobs.push({
      title,
      link,
      company: "Jefferies",
    });
  });
  return jobs;
}

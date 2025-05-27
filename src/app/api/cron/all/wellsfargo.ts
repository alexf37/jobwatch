import { JSDOM } from "jsdom";
import type { Listing } from "./types";

export async function scrapeWellsFargo() {
  const res = await fetch(
    "https://www.wellsfargojobs.com/en/jobs/?page=1&search=&country=United+States+of+America&team=Investments+%26+Trading&team=Research&team=Strategy+%26+Execution&pagesize=50"
  );
  const html = await res.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const pageCountRaw = document.querySelector(
    "#results > nav > ul > li:nth-last-child(2) > a"
  )?.textContent;
  let pageCount = 1;
  if (pageCountRaw) {
    pageCount = parseInt(pageCountRaw);
  }
  const expectedTotal = parseInt(
    document.querySelector("#results > div.row > div > p > strong:nth-child(3)")
      ?.textContent!
  );
  console.log(pageCount, expectedTotal);
  const requestPromises = [];
  for (let i = 1; i <= pageCount; i++) {
    requestPromises.push(
      fetch(
        `https://www.wellsfargojobs.com/en/jobs/?page=${i}&search=&country=United+States+of+America&team=Investments+%26+Trading&team=Research&team=Strategy+%26+Execution&pagesize=50`
      )
    );
  }
  const responses = await Promise.all(requestPromises);
  const allJobs: Listing[] = [];
  for (const response of responses) {
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const list = document.querySelector("#js-job-search-results");
    if (!list) {
      continue;
    }
    const jobElements = list.querySelectorAll("#js-job-search-results > div");
    for (const jobElement of jobElements) {
      const titleElem = jobElement.querySelector("h2 > a");
      const title = titleElem?.textContent;
      const link = titleElem?.getAttribute("href");
      if (!title || !link) continue;
      const locationElem = jobElement.querySelector(
        "div > ul > li:nth-child(1)"
      );
      const location = locationElem?.textContent?.trim();
      const deptElem = jobElement.querySelector("div > ul > li:nth-child(2)");
      const dept = deptElem?.textContent?.trim();
      if (!dept) continue;
      if (!["Investments & Trading", "Research"].includes(dept)) continue;
      allJobs.push({
        title,
        link,
        location: location ?? undefined,
        company: "Wells Fargo",
      });
    }
  }
  if (allJobs.length !== expectedTotal) {
    console.log(`Expected ${expectedTotal} jobs, got ${allJobs.length} jobs`);
  }
  return allJobs;
}

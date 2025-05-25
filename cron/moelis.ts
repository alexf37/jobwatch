// done
import z from "zod";
import type { Listing } from "./types";

const schema = z.object({
  total: z.number(),
  jobPostings: z.array(
    z.object({
      title: z.string(),
      externalPath: z.string(),
      locationsText: z.string().optional(),
      postedOn: z.string(),
      bulletFields: z.array(z.string()),
    })
  ),
});

export async function scrapeMoelis() {
  const allJobs = [];
  let offset = 0;
  while (true) {
    const res = await fetch(
      "https://moelis.wd1.myworkdayjobs.com/wday/cxs/moelis/University-Hires/jobs",
      {
        headers: {
          accept: "application/json",
          "accept-language": "en-US",
          "content-type": "application/json",
          priority: "u=1, i",
          "sec-ch-ua": '"Not.A/Brand";v="99", "Chromium";v="136"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        body: `{"appliedFacets":{},"limit":20,"offset":${offset},"searchText":""}`,
        method: "POST",
      }
    );
    const json = await res.json();
    const parsed = schema.parse(json);
    allJobs.push(...parsed.jobPostings);
    if (parsed.total <= allJobs.length) {
      break;
    }
    offset += 20;
  }
  const jobs: Listing[] = allJobs.map((job) => {
    return {
      title: job.title,
      link: job.externalPath,
      location: job.locationsText,
    };
  });
  return jobs;
}

// done
import z from "zod";
import type { Listing } from "./types";

const schema = z.object({
  jobsList: z.array(
    z.object({
      postingTitle: z.string(),
      lob: z.string(),
      jcrURL: z.string(),
      postedDate: z.string(),
      city: z.string(),
      state: z.string(),
      country: z.string(),
      minYearsOfExperience: z.number(),
      maxYearsOfExperience: z.number(),
      externalUrl: z.string(),
      locationString: z.string(),
      primaryLocation: z.string(),
      location: z.string(),
      timeType: z.string(),
      applyByDate: z.string(),
    })
  ),
});
export async function scrapeBofa() {
  const res = await fetch(
    "https://careers.bankofamerica.com/services/campusjobssearchservlet?start=0&rows=1000&search=getAllJobs",
    {
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua": '"Not.A/Brand";v="99", "Chromium";v="136"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        Referer:
          "https://careers.bankofamerica.com/en-us/students/job-search?ref=search&rows=1000&search=getAllJobs",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );
  const json = schema.parse(await res.json());
  const jobs: Listing[] = json.jobsList.map((job) => {
    return {
      title: job.postingTitle,
      link: job.jcrURL,
      location: job.location,
    };
  });
  return jobs;
}

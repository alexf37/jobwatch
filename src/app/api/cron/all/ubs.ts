// done
import z from "zod";
import type { Listing } from "./types";

const schema = z.object({
  JobsCount: z.number(),
  Jobs: z.object({
    Job: z.array(
      z.object({
        Link: z.string(),
        Questions: z.array(
          z.object({
            QuestionName: z.string(),
            Value: z.string(),
          })
        ),
      })
    ),
  }),
});

export async function scrapeUbs() {
  const allJobs = [];
  let page = 1;
  while (true) {
    const res = await fetch(
      "https://jobs.ubs.com/TgNewUI/Search/Ajax/ProcessSortAndShowMoreJobs",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json;charset=UTF-8",
          "sec-ch-ua": '"Not.A/Brand";v="99", "Chromium";v="136"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        body: `{"partnerId":"25008","siteId":"5131","keyword":"","location":"","keywordCustomSolrFields":"FORMTEXT21,AutoReq,Department,JobTitle","locationCustomSolrFields":"FORMTEXT2,FORMTEXT23,Location","linkId":"15232","Latitude":0,"Longitude":0,"facetfilterfields":{"Facet":[]},"powersearchoptions":{"PowerSearchOption":[{"VerityZone":"FORMTEXT23","Type":"multi-select","OptionCodes":[]},{"VerityZone":"FORMTEXT2","Type":"multi-select","OptionCodes":[]},{"VerityZone":"FORMTEXT21","Type":"multi-select","OptionCodes":[]},{"VerityZone":"Department","Type":"select","OptionCodes":[]},{"VerityZone":"FORMTEXT28","Type":"single-select","OptionCodes":[]},{"VerityZone":"AutoReq","Type":"text","Value":null},{"VerityZone":"JobTitle","Type":"text","Value":null},{"VerityZone":"FORMTEXT27","Type":"single-select","OptionCodes":[]},{"VerityZone":"FORMTEXT53","Type":"single-select","OptionCodes":[]},{"VerityZone":"LastUpdated","Type":"date","Value":null},{"VerityZone":"languagelist","Type":"multi-select","OptionCodes":[]}]},"SortType":"LastUpdated","pageNumber":${page},"encryptedSessionValue":"^2omj8BGybsoddbnw_slp_rhc_vszulZQM8dtQD2oYZm2QAWWFG9ahDeE8wBHr5FTeY3VgOiqbCLVthToOyJN/fZyyPEdXm3sHnm/tFeraKAyXFpkjoY="}`,
        method: "POST",
      }
    );
    const parsed = schema.parse(await res.json());
    const jobs = parsed.Jobs.Job.map((job) => {
      const title =
        job.Questions.find((q) => q.QuestionName === "jobtitle")?.Value ??
        "No title found";
      const link = job.Link;
      const location = job.Questions.find(
        (q) => q.QuestionName === "formtext23"
      )?.Value;
      const department = job.Questions.find(
        (q) => q.QuestionName === "formtext21"
      )?.Value;
      return {
        title,
        link,
        location,
        department,
      };
    });
    allJobs.push(...jobs);
    if (parsed.JobsCount <= allJobs.length) {
      break;
    }
    page++;
  }
  const jobs: Listing[] = allJobs.map((job) => {
    return {
      title: job.title,
      link: job.link,
      location: job.location,
    };
  });
  return jobs;
}

// console.log(await scrapeUbs());

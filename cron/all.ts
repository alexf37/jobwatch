import { scrapeCiti } from "./citi";
import { scrapeEvercore } from "./evercore";
import { scrapeJefferies } from "./jefferies";
import { scrapeJpmorgan } from "./jpmorgan";
import { scrapeMoelis } from "./moelis";
import { scrapeUbs } from "./ubs";
import { scrapeWellsFargo } from "./wellsfargo";
import { scrapeBofa } from "./bofa";
import { scrapeGuggenheim } from "./guggenheim";
import crypto from "crypto";

async function scrapeAll() {
  return (
    await Promise.allSettled([
      scrapeBofa(),
      scrapeGuggenheim(),
      //   scrapeJefferies(),
      scrapeMoelis(),
      scrapeUbs(),
    ])
  ).flat();
}

const results = await scrapeAll();

const successful = results
  .filter((r) => r.status === "fulfilled")
  .map((p) => p.value)
  .flat();

// console.log(successful);

// hash the successful jobs using node crypto
const hashes = successful.map((j) =>
  crypto.createHash("sha256").update(JSON.stringify(j)).digest("base64")
);

console.log(hashes);

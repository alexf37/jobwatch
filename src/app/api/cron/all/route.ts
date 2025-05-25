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
import { db } from "@/server/db";

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

export async function GET() {
  const [results, existingListings] = await Promise.all([
    scrapeAll(),
    db.listing.findMany(),
  ]);

  const successful = results
    .filter((r) => r.status === "fulfilled")
    .map((p) => p.value)
    .flat();

  // console.log(successful);

  // hash the successful jobs using node crypto
  const listingsWithHashes = successful.map((j) => ({
    id: crypto.createHash("sha256").update(JSON.stringify(j)).digest("base64"),
    ...j,
  }));

  // diff existing listings with listingsWithHashes
  const outdatedListings = existingListings.filter(
    (l) => !listingsWithHashes.some((l2) => l2.id === l.id)
  );

  const newListings = listingsWithHashes.filter(
    (l) => !existingListings.some((l2) => l2.id === l.id)
  );

  const deletePromise = db.listing.deleteMany({
    where: {
      id: {
        in: outdatedListings.map((l) => l.id),
      },
    },
  });
  const createPromise = db.listing.createMany({
    data: newListings,
  });

  await Promise.all([deletePromise, createPromise]);

  return new Response("OK");
}

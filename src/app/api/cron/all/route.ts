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

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

import JobAlertEmail from "@/components/email-template";
import { Resend } from "resend";
import { env } from "@/env";
import type { Listing } from "./types";
import z from "zod";

const resend = new Resend(env.RESEND_API_KEY);

async function sendEmail(newListings: Listing[]) {
  if (newListings.length === 0) {
    return;
  }
  console.log("sending email");
  const { data, error } = await resend.emails.send({
    from: "Alex's Job Hunter <alex@jobwatch-noreply.alexfoster.dev>",
    to: ["dabsketicito2@gmail.com", "frh4ps@virginia.edu"],
    subject: `${newListings.length} new job listing${newListings.length === 1 ? "" : "s"} for you`,
    react: JobAlertEmail({
      jobListings: newListings,
      aggregatorSiteUrl: "https://jobwatch.alexfoster.dev",
      recipientName: "Atharva",
    }),
  });

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json(data);
}

async function verifyListing(listing: Listing) {
  const listingForAI = {
    title: listing.title,
    description: listing.description,
    location: listing.location,
  };
  try {
    const response = await generateObject({
      model: openai("gpt-4.1-mini"),
      prompt: `You are a screener employed by a job listing aggregation site whose purpose is to ensure that all job listings adhere to the following criteria:
        1. The listing is for a full time job (not part time, internship, temporary, or a summer-only position).
        2. The listing is for a job in investment banking specifically. Use your best judgement for what qualifies as investment banking, and if you are unsure, assume it does qualify. I don't mind false positives but I don't want false negatives.
        3. The position is in the United States and in English.
        4. The listing is for a 2026 position specifically. Do NOT accept any 2025 positions. 2027 is okay if you find it.
        5. The listing is for an analyst position, not an associate position. If the listing doesn't specify, use your best judgement. Again, I don't mind false positives but I don't want false negatives. Just don't accept any which are obviously not analyst positions.
    
        ALL of the above criteria must be met for the listing to be accepted.
    
        Here is the listing for you to verify right now:
        ${JSON.stringify(listingForAI)}
    
        Please return a JSON object with a single boolean field, \`valid\`, set according to whether the listing meets all of the criteria or not.
        Use the \`reasoning\` field to reason through your decision. Put the reasoning field before the \`valid\` field in the JSON you output.
        `,
      schema: z.object({
        reasoning: z.string(),
        valid: z.boolean(),
      }),
      maxRetries: 5,
    });
    return response.object.valid;
  } catch (err: unknown) {
    return true;
  }
}

async function scrapeAll() {
  return (
    await Promise.allSettled([
      scrapeBofa(),
      scrapeGuggenheim(),
      //   scrapeJefferies(),
      scrapeMoelis(),
      scrapeUbs(),
      scrapeCiti(),
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

  const newListings = await Promise.all(
    listingsWithHashes
      .filter((l) => !existingListings.some((l2) => l2.id === l.id))
      .map(async (l) => ({
        ...l,
        valid: await verifyListing(l),
      }))
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

  const emailPromise = sendEmail(newListings.filter((l) => l.valid));

  await Promise.all([deletePromise, createPromise, emailPromise]);

  return Response.json({
    success: true,
  });
}

await GET();

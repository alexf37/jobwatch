import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import type { Listing } from "@/app/api/cron/all/types";

interface EmailProps {
  jobListings: Listing[];
  aggregatorSiteUrl: string;
  recipientName?: string;
}

const JobAlertEmail = ({
  jobListings,
  aggregatorSiteUrl,
  recipientName,
}: EmailProps) => {
  const listingCount = jobListings.length;
  const previewText = `${listingCount} New Job ${listingCount === 1 ? "Alert" : "Alerts"} for You`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] mx-auto my-0 p-[24px] max-w-[600px]">
            <Section>
              <Heading className="text-[24px] font-bold text-gray-800 mt-[16px] mb-[8px]">
                {listingCount} New Job{" "}
                {listingCount === 1 ? "Opportunity" : "Opportunities"}
              </Heading>
              <Text className="text-[16px] text-gray-700 my-[16px]">
                {recipientName ? `Hey ${recipientName}! Here's` : "Hey! Here's"}{" "}
                {listingCount === 1
                  ? "a new job listing"
                  : `${listingCount} new job listings`}{" "}
                for you:
              </Text>
            </Section>

            {jobListings.map((job, index) => (
              <Section
                key={index}
                className="bg-gray-50 rounded-[8px] p-[20px] border-solid border-[1px] border-gray-200 mb-[16px]"
              >
                <Heading className="text-[20px] font-bold text-gray-800 mt-0 mb-[8px]">
                  {job.title}
                </Heading>
                <Text className="text-[16px] font-medium text-gray-700 mt-0 mb-[4px]">
                  {job.company}
                </Text>
                {job.location && (
                  <Text className="text-[14px] text-gray-600 mt-0 mb-[16px]">
                    📍 {job.location}
                  </Text>
                )}
                {job.description && (
                  <Text className="text-[14px] text-gray-700 mt-[16px] mb-[16px]">
                    {job.description}
                  </Text>
                )}

                <Row>
                  <Column>
                    <Button
                      className="bg-blue-600 text-white font-bold py-[12px] px-[20px] rounded-[4px] text-[14px] no-underline text-center box-border"
                      href={job.link}
                    >
                      View Job Details
                    </Button>
                  </Column>
                </Row>
              </Section>
            ))}

            <Section className="mt-[24px]">
              <Text className="text-[16px] text-gray-700 mb-[16px]">
                Want to see all open job opportunities (including ones from
                previous emails)? They're all listed on jobwatch.alexfoster.dev,
                which you can access by clicking the button below.
              </Text>
              <Button
                className="bg-gray-800 text-white font-bold py-[12px] px-[20px] rounded-[4px] text-[14px] no-underline text-center box-border"
                href={aggregatorSiteUrl}
              >
                Explore More Jobs
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default JobAlertEmail;

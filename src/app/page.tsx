import { db } from "@/server/db";
import Listings from "@/components/Listings";

export default async function HomePage() {
  const allListings = await db.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const supportedCompanies = [
    "Bank of America",
    "Guggenheim",
    "Moelis",
    "UBS",
    "Citi",
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-black mb-4">
            Job Listings
          </h1>
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-700 mb-3">
              Currently supported:
            </h2>
            <div className="flex flex-wrap gap-2">
              {supportedCompanies.map((company) => (
                <span
                  key={company}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Render the Listings component */}
        <Listings allListings={allListings} />
      </div>
    </main>
  );
}

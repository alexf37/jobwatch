import { db } from "@/server/db";

export default async function HomePage() {
  const listings = await db.listing.findMany({
    where: {
      valid: true,
    },
  });
  const supportedCompanies = ["Bank of America", "Guggenheim", "Moelis", "UBS"];
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

        {/* Listings */}
        <div className="space-y-4">
          {listings.map((listing) => (
            <a
              key={listing.id}
              href={listing.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="border border-gray-200 rounded-lg p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-medium text-black group-hover:text-gray-700 transition-colors">
                      {listing.title}
                    </h2>
                    {listing.location && (
                      <p className="text-sm text-gray-500 mt-1">
                        {listing.location}
                      </p>
                    )}
                    {listing.description && (
                      <p className="text-gray-600 mt-3 line-clamp-2">
                        {listing.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Empty state */}
        {listings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No listings available at the moment.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

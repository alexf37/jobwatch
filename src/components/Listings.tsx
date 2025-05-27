"use client";

import { type Listing } from "@prisma/client";
import { useState } from "react";

// Define the Listing type based on your Prisma schema
// Assuming your Listing model has at least these fields:
// id: string (or number)
// title: string
// link: string
// location: string | null
// description: string | null
// valid: boolean
// createdAt: Date (or string)

interface ListingsProps {
  allListings: Listing[];
}

export default function Listings({ allListings }: ListingsProps) {
  const [showInvalid, setShowInvalid] = useState(false);

  const filteredListings = showInvalid
    ? allListings
    : allListings.filter((listing) => listing.valid);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">Job Postings</h2>
        <div className="flex items-center">
          <label
            htmlFor="showInvalidToggle"
            className="mr-2 text-sm font-medium text-gray-700"
          >
            Show Invalid Listings
          </label>
          <button
            type="button"
            id="showInvalidToggle"
            onClick={() => setShowInvalid(!showInvalid)}
            className={`${
              showInvalid ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            role="switch"
            aria-checked={showInvalid}
          >
            <span className="sr-only">Show Invalid Listings</span>
            <span
              aria-hidden="true"
              className={`${
                showInvalid ? "translate-x-5" : "translate-x-0"
              } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>
      </div>

      {/* Listings */}
      {filteredListings.length > 0 ? (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <a
              key={listing.id}
              href={listing.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block group ${!listing.valid ? "opacity-60 hover:opacity-80" : ""}`}
            >
              <div
                className={`border border-gray-200 rounded-lg p-6 transition-all duration-200 hover:border-gray-300 hover:shadow-sm ${!listing.valid ? "bg-gray-50" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-black transition-colors">
                      {listing.title}
                      {!listing.valid && (
                        <span className="ml-2 text-xs font-semibold text-red-600">
                          (Invalid)
                        </span>
                      )}
                    </h3>
                    {listing.company && (
                      <p className="text-sm text-gray-700 font-medium mt-1">
                        {listing.company}
                      </p>
                    )}
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
                    <p className="text-xs text-gray-400 mt-2">
                      Discovered on:{" "}
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400 transition-colors"
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No listings available for the current filter.
          </p>
        </div>
      )}
    </div>
  );
}

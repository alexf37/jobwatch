-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

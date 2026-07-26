-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "testimonial" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "photo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "sentiment" TEXT NOT NULL DEFAULT 'Unknown',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Testimonial" ("company", "createdAt", "email", "id", "name", "photo", "rating", "status", "testimonial", "updatedAt") SELECT "company", "createdAt", "email", "id", "name", "photo", "rating", "status", "testimonial", "updatedAt" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to drop the `Date` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_dateId_fkey";

-- DropTable
DROP TABLE "Date";

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "weekday" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

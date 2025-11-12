/*
  Warnings:

  - You are about to drop the `Challenge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SchoolClassChallenge" DROP CONSTRAINT "SchoolClassChallenge_challengeId_fkey";

-- DropTable
DROP TABLE "public"."Challenge";

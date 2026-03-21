/*
  Warnings:

  - A unique constraint covering the columns `[eventFeedbackId]` on the table `FeedbackRequest` will be added. If there are existing duplicate values, this will fail.
  - Made the column `eventFeedbackId` on table `FeedbackRequest` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "FeedbackRequest" DROP CONSTRAINT "FeedbackRequest_eventFeedbackId_fkey";

-- AlterTable
ALTER TABLE "FeedbackRequest" ALTER COLUMN "eventFeedbackId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackRequest_eventFeedbackId_key" ON "FeedbackRequest"("eventFeedbackId");

-- AddForeignKey
ALTER TABLE "FeedbackRequest" ADD CONSTRAINT "FeedbackRequest_eventFeedbackId_fkey" FOREIGN KEY ("eventFeedbackId") REFERENCES "EventFeedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

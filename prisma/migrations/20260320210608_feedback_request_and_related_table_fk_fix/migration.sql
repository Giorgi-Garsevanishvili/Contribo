-- DropForeignKey
ALTER TABLE "EventFeedback" DROP CONSTRAINT "EventFeedback_id_fkey";

-- AddForeignKey
ALTER TABLE "FeedbackRequest" ADD CONSTRAINT "FeedbackRequest_eventFeedbackId_fkey" FOREIGN KEY ("eventFeedbackId") REFERENCES "EventFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

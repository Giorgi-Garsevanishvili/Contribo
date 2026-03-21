-- DropForeignKey
ALTER TABLE "FeedbackRequest" DROP CONSTRAINT "FeedbackRequest_eventFeedbackId_fkey";

-- AddForeignKey
ALTER TABLE "EventFeedback" ADD CONSTRAINT "EventFeedback_id_fkey" FOREIGN KEY ("id") REFERENCES "FeedbackRequest"("eventFeedbackId") ON DELETE RESTRICT ON UPDATE CASCADE;

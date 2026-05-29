-- AlterTable
ALTER TABLE "MemberStatusLog" ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "PositionHistory" ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "RatingHistory" ADD COLUMN     "regionId" TEXT;

-- AddForeignKey
ALTER TABLE "RatingHistory" ADD CONSTRAINT "RatingHistory_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionHistory" ADD CONSTRAINT "PositionHistory_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberStatusLog" ADD CONSTRAINT "MemberStatusLog_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

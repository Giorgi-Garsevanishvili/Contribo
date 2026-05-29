-- AlterTable
ALTER TABLE "HrWarning" ADD COLUMN     "regionId" TEXT;

-- AddForeignKey
ALTER TABLE "HrWarning" ADD CONSTRAINT "HrWarning_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

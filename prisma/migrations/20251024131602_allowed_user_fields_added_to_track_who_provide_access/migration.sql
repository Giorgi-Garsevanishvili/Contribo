-- AlterTable
ALTER TABLE "AllowedUser" ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'system';

-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

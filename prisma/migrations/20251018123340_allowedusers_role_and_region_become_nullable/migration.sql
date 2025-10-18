-- DropForeignKey
ALTER TABLE "public"."AllowedUser" DROP CONSTRAINT "AllowedUser_regionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AllowedUser" DROP CONSTRAINT "AllowedUser_roleId_fkey";

-- AlterTable
ALTER TABLE "AllowedUser" ALTER COLUMN "roleId" DROP NOT NULL,
ALTER COLUMN "regionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

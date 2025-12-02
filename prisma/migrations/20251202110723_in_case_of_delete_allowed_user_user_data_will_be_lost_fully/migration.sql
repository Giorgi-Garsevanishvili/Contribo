-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_email_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_email_fkey" FOREIGN KEY ("email") REFERENCES "AllowedUser"("email") ON DELETE CASCADE ON UPDATE CASCADE;

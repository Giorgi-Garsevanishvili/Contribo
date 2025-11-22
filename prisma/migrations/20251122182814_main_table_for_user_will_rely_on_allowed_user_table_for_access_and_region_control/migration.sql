-- AddForeignKey
ALTER TABLE "AllowedUser" ADD CONSTRAINT "AllowedUser_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

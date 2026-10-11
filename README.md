# 🧩 Contribo

**Contribo** is an internal management platform designed to organize events, roles, and user participation efficiently.  
It aims to simplify collaboration, automate routine tasks like feedback collection and email notifications, and maintain clear records of contributions within an organization.

---

## 🚧 Project Status

> **Note:** Contribo is currently under active development.  
> Core database models and backend structure are being defined and tested.

---

## 🧱 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** NextAuth.js / Auth.js
- **Deployment:** Vercel or Netlify; the target platform is not finalized.

---

## 🛠️ Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

   `DATABASE_URL` must be configured first because Prisma reads it during client generation.

2. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

   GOOGLE_ID="your-google-oauth-client-id"
   GOOGLE_SECRET="your-google-oauth-client-secret"

   INITIAL_USER_EMAIL="your-email@example.com"

   AUTH_SECRET="your-long-random-secret"
   AUTH_TRUST_HOST="true"
   ```

   Replace the example values with your own. Keep `.env` private and never commit real credentials. Review `AUTH_TRUST_HOST` for your hosting and authentication setup before production.

3. Apply the development database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Seed the database:

   ```bash
   npx prisma db seed
   ```

   The seed uses `DATABASE_URL` to choose the database. It creates initial roles, regions, event roles, and other reference data, and adds the email in `INITIAL_USER_EMAIL` as an allowed user with the roles configured in the seed data. The seed can be run again safely.

5. Start the development server:

   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

| Variable             | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string used by Prisma.                              |
| `GOOGLE_ID`          | Google OAuth client ID.                                                   |
| `GOOGLE_SECRET`      | Google OAuth client secret.                                               |
| `INITIAL_USER_EMAIL` | Email added as the initial allowed user when seeding.                     |
| `AUTH_SECRET`        | Secret used by authentication.                                            |
| `AUTH_TRUST_HOST`    | Authentication host-trust setting; review for the deployment environment. |

Use separate database credentials for development, testing, and production. Confirm `DATABASE_URL` points to the intended database before running migrations or seeding.

---

## 🗂️ Database Overview (Core Models)

- `User` – stores user information, status, and history
- `Event` – includes event details, time, and feedback
- `EventAssignment` – connects users to roles within specific events
- `EventsRole` – defines available roles for events
- `EventFeedback` – collects participants’ comments and evaluations
- `RatingHistory`, `PositionHistory`, `MemberStatusLog` – track user-related changes over time
- And more...

---

## 🔒 GDPR & Data Handling

The schema includes soft-deletion fields for users and uses cascading deletion on selected relations.
Review data-retention and deletion behavior before production use;
this project has not been independently assessed for GDPR compliance.

---

## 🧠 Future Plans

- Secure email template system for automated notifications
- Project Test suites

---

**Author:** Giorgi Garsevanishvili  
**Project Name:** Contribo  
**Status:** In Development 🚀

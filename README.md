# 🧩 Contribo

**Contribo** is an internal management platform designed to organize events, roles, and user participation efficiently.  
It aims to simplify collaboration, automate routine tasks like feedback collection and email notifications, and maintain clear records of contributions within an organization.

---

## 🚧 Project Status

> **Note:** Contribo is currently under active development.  
> Core database models and backend structure are being defined and tested.

---

## 🎯 Main Features (Planned / In Progress)

- **User Management**  
  Each user can have roles, ratings, and historical records of their position or membership changes.

- **Event System**  
  Create and manage events with detailed information:
  - Multiple role assignments per event
  - Feedback collection from participants
  - Automated follow-up notifications after event completion

- **Rating & History Tracking**  
  Every rating change, position update, or member status modification is stored with timestamps and responsible users.

- **Scheduled Emails (Planned)**  
  Automatic follow-up emails are sent 3 days after each event ends using external cron jobs (e.g., [cron-job.org](https://cron-job.org/en/)) and **Nodemailer**.

---

## 🧱 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Database:** PostgreSQL (via [Prisma ORM](https://www.prisma.io/))
- **Authentication:** NextAuth.js
- **Deployment:** Netlify (frontend) Or Vercel
- **Email Automation:** Nodemailer + external cron service (planned)
- **Language:** TypeScript

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

Contribo follows privacy-first principles:
- Minimal personal data storage  
- Data deletions cascade where appropriate  
- Soft-deletion support for users (`deleted`, `deletedAt` fields)

---

## ⚙️ Development Notes

- All features are currently being structured and tested in local environments.  
- Cron-based automation and email delivery will be integrated after core event flow completion.  
- Deployment and monitoring configurations will follow once the base logic is finalized.

---

## 🧠 Future Plans

- Admin dashboard for managing users, roles, and events  
- In-app analytics for participation and contribution  
- Secure email template system for automated notifications  
- Integration with organization-level authentication (OAuth providers)
- AI based analyze for event summaries 
- And many more... 

---

**Author:** Giorgi Garsevanishvili  
**Project Name:** Contribo  
**Status:** In Development 🚀

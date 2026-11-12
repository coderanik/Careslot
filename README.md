# CareSlot

**Clinic Appointment Booking Agent**  
Team demo | PS3 | SRM Agentic AI Hackathon

## The problem

Patients of a multi-speciality clinic call the front desk just to book, move or cancel appointments. Lines stay busy and desk staff cannot keep up.

## What our app does

- Lets patient **Arjun Mehta (P001)** ask for care in plain English
- Suggests the right department from symptoms (never diagnoses or suggests medicine)
- Shows free slots and books, reschedules or cancels appointments
- Marks a slot booked exactly once; cancelling frees it again
- Includes a stretch **doctor day view** for the signed-in doctor’s schedule
- Protects the app with a team passcode, then issues a **JWT** with `role` + `userId`

## Live demo

- **Vercel link:** https://careslot-agent.vercel.app
- **Passcode:** set in Vercel as `APP_PASSCODE` (same value as local `.env.local`)
- **Demo prompts:**
  - `I have a skin rash, book me with a doctor on Friday morning.`
  - `Move my appointment to the next free slot.`
  - `Which Tamil-speaking doctors are free tomorrow?`

> Add `GEMINI_API_KEY` in `.env.local` and Vercel project env, then redeploy / restart to enable the agent chat.

## Agent tools

| Tool name | What it does | Reads or writes |
| --- | --- | --- |
| `searchDoctors` | Match department / language / issue to doctors | Read |
| `getAvailableSlots` | List free slots for a doctor and date | Read |
| `bookAppointment` | Book a free slot for P001 | Write |
| `rescheduleAppointment` | Move a booking to another free slot | Write |
| `cancelAppointment` | Cancel a booking and free the slot | Write |
| `getMyAppointments` | List the logged-in patient’s appointments | Read |

## Database tables

- `departments` — specialties and common issues the agent can match
- `doctors` — clinicians, fees, languages, rooms
- `slots` — bookable times; `is_booked` enforces single booking
- `patients` — demo patients including P001 Arjun Mehta
- `appointments` — booked / cancelled / completed visits

## Tech stack

Next.js · React · TypeScript · Tailwind CSS · Supabase · Gemini API (function calling) · Zod · Vercel · JWT role-based sessions (`jose`)

## Team

| Role | Name |
| --- | --- |
| Team Lead | |
| Frontend | |
| Backend / API | |
| Database | |
| AI / Agent | |

## Run it locally

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the keys (`GEMINI_API_KEY`, Supabase URL + secret key, `APP_PASSCODE`, `APP_JWT_SECRET`)
3. In Supabase SQL Editor, run `seed/ps3_clinic_appointments.sql`
4. `npm run dev`
5. Open http://localhost:3000 — sign in as **Patient** (Arjun Mehta) or **Doctor** (e.g. DR01)

## Auth model

1. Team passcode gates access (protects Gemini quota).
2. On success the server signs an HS256 JWT (`APP_JWT_SECRET`) with claims: `role` (`patient` | `doctor`), `userId`, `name`.
3. The JWT is stored in an httpOnly cookie (`careslot_session`).
4. `proxy.ts` verifies the JWT on every page/API. Write tools always use the patient id from the JWT, never from the model.

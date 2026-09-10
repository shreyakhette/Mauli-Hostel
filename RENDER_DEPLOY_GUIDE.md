# 🌸 Production Deployment Guide for Render (render.com)
## Sakhi Girls Hostel Management System

This guide walks you through deploying the full-stack **Sakhi Girls Hostel Management System** (Spring Boot 3.3.4 + React 18 / Vite + PostgreSQL) to [Render](https://render.com).

---

## 🏗 System Topology on Render

```
                    ┌─────────────────────────┐
                    │  Sakhi Frontend (React) │
                    │   Render Static Site    │
                    │ https://sakhi-*.render  │
                    └───────────┬─────────────┘
                                │ HTTPS API Calls
                                ▼
                    ┌─────────────────────────┐
                    │  Sakhi Backend (Spring) │
                    │   Docker Web Service    │
                    │ https://sakhi-*.render  │
                    └───────────┬─────────────┘
                                │ JDBC (Port 5432)
                                ▼
                    ┌─────────────────────────┐
                    │   Render PostgreSQL     │
                    │    Managed Database     │
                    └─────────────────────────┘
```

---

## 🚀 Option 1: 1-Click Blueprint Deployment (Recommended)

Render provides Infrastructure-as-Code via the bundled `render.yaml` file. This automatically configures the PostgreSQL Database, Backend Web Service, and Frontend Static Site together.

### Step 1: Push Code to GitHub
Push your repository to GitHub (public or private):
```bash
git add .
git commit -m "feat: configure cloud production deployment for Render"
git push origin main
```

### Step 2: Create Blueprint on Render
1. Log in to [dashboard.render.com](https://dashboard.render.com).
2. In the top navigation bar, click **New +** and select **Blueprint**.
3. Connect your GitHub repository (`Mauli-Hostel` / `hostel`).
4. Render will detect the `render.yaml` file automatically.
5. Review the resources to be created:
   - **`sakhi-hostel-db`** (PostgreSQL Database)
   - **`sakhi-hostel-backend`** (Web Service - Docker)
   - **`sakhi-hostel-frontend`** (Static Site)
6. Click **Apply**.
7. Render will provision the database, build the backend Docker container, build the frontend Vite bundle, and deploy both services!

---

## 🛠 Option 2: Manual Dashboard Deployment

If you prefer deploying services manually step-by-step using the Render Web Dashboard, follow these instructions:

### Step 1: Create Managed PostgreSQL Database
1. Go to **Dashboard** > **New +** > **PostgreSQL**.
2. Configure settings:
   - **Name**: `sakhi-hostel-db`
   - **Database**: `sakhi_hostel_db`
   - **User**: `sakhi_user`
   - **Region**: Choose the closest region to your users (e.g., `Oregon (US West)` or `Frankfurt (EU)`).
   - **Plan**: `Free`
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g., `postgres://sakhi_user:...@dpg-.../sakhi_hostel_db`).

---

### Step 2: Create Backend Web Service (Spring Boot)
1. Go to **Dashboard** > **New +** > **Web Service**.
2. Select **Build and deploy from a Git repository** and pick your repository.
3. Configure settings:
   - **Name**: `sakhi-hostel-backend`
   - **Language / Runtime**: `Docker`
   - **Region**: Same region as your database.
   - **Branch**: `main`
   - **Root Directory**: `backend` *(or leave blank if using root Dockerfile)*
   - **Dockerfile Path**: `Dockerfile` *(or `backend/Dockerfile` if Root Directory is left blank)*
   - **Instance Type**: `Free`
4. Expand **Advanced** and add the following **Environment Variables**:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | `postgres` | Activates PostgreSQL configuration profile |
| `DATABASE_URL` | *(Reference your PostgreSQL Database or paste Internal DB URL)* | Render connection string |
| `PORT` | `8080` | Port for Spring Boot container |
| `JWT_SECRET` | *(Click Generate or paste a 256-bit secret key)* | Secret key for signing JWT tokens |
| `JWT_EXPIRATION` | `86400000` | Token expiration in ms (24 hours) |
| `CORS_ALLOWED_ORIGINS` | `https://sakhi-hostel-frontend.onrender.com` | Frontend URL allowed to make requests |

5. Set **Health Check Path** to `/api/emergency/public`.
6. Click **Create Web Service**.
7. Wait for the build to finish. Once deployed, note down your backend URL (e.g., `https://sakhi-hostel-backend.onrender.com`).

---

### Step 3: Create Frontend Static Site (React + Vite)
1. Go to **Dashboard** > **New +** > **Static Site**.
2. Connect your Git repository.
3. Configure settings:
   - **Name**: `sakhi-hostel-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. In **Environment Variables**, add:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://sakhi-hostel-backend.onrender.com` | Your deployed backend URL from Step 2 |

5. In **Redirects / Rewrites** tab:
   - Click **Add Rule**
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(This ensures client-side routes like `/student/dashboard` do not return 404 when refreshed).*
6. Click **Create Static Site**.

---

## 🔑 Default Credentials & Initial Data

Upon the first boot on PostgreSQL, `DataInitializationService` automatically seeds the full hostel baseline dataset:

### Chief Warden Account
- **Username**: `warden`
- **Password**: `Warden@Sakhi2026`
- **Name**: Kranti Bhoyar
- **Role**: `ROLE_WARDEN`
- **Access**: Full administration, room allocations, attendance roll call, leave approvals, complaint resolution, visitor passes.

### Pre-Seeded Resident Students
- **Student 1**: Ananya Sharma (`ananya.sharma@sakhihostel.com` / `Student@Sakhi2026`) - Room 203, Bed 2
- **Student 2**: Priya Sharma (`priya.sharma@sakhihostel.com` / `Student@Sakhi2026`) - Room 203, Bed 1
- **Student 3**: Sneha Patil (`sneha.patil@sakhihostel.com` / `Student@Sakhi2026`) - Room 203, Bed 3

### Baseline Infrastructure
- **Rooms**: 100 rooms across 4 floors (Rooms 101 to 425)
- **Beds**: 400 total beds (4 beds per room)
- **Current Occupancy**: 363 beds occupied (90.75%), 37 available
- **Emergency Directory**: Police, Hospital, Fire, Security Gate, Warden hotline

---

## 🔍 Verification & Testing

Once both services show **Live**:

1. **Verify Backend Health**:
   Visit in your browser:
   `https://sakhi-hostel-backend.onrender.com/api/emergency/public`
   You should receive a JSON array containing emergency contacts.

2. **Verify Frontend UI**:
   Visit `https://sakhi-hostel-frontend.onrender.com`
   - Log in using `warden` / `Warden@Sakhi2026`.
   - Verify the Chief Warden Dashboard displays 100 rooms, 400 beds, occupancy stats, and recent activities.
   - Navigate to `/warden/rooms` to view visual bed allocations.
   - Refresh the browser page on `/warden/rooms` to confirm SPA rewriting works without 404.

---

## 💡 Important Production Notes for Render Free Tier

1. **Free Tier Cold Starts**:
   - On the Render Free tier, Web Services spin down after 15 minutes of inactivity.
   - The first request after spinning down may take 40–50 seconds to boot up (cold start). Subsequent requests respond in milliseconds.
   - To eliminate cold starts, upgrade the Web Service to Render's **Starter** tier ($7/mo).

2. **PostgreSQL Database Retention**:
   - Render's Free tier PostgreSQL expires after 30 days. For long-term production, upgrade to a paid PostgreSQL instance ($7/mo) or point `DATABASE_URL` to a free persistent provider like [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).

3. **Updating CORS for Custom Domains**:
   - If you bind a custom domain (e.g., `hostel.yourdomain.com`), simply add it to the `CORS_ALLOWED_ORIGINS` environment variable in the backend web service settings on Render (e.g. `https://hostel.yourdomain.com,https://sakhi-hostel-frontend.onrender.com`).

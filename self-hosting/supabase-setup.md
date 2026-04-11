---
title: "Supabase Setup"
description: "Create and configure the Supabase project that InfraAudit uses for authentication."
icon: "database"
---


InfraAudit uses Supabase for authentication, OAuth flows, and JWT signing. This page walks through the project setup, OAuth configuration, and the values you need for the `.env` file.

## Create the project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose your organization, give the project a name (e.g. `infraudit`), set a database password, and pick a region.
4. Click **Create new project**. Wait ~2 minutes for provisioning.

## Get the required credentials

From the project dashboard, go to **Settings → API**:

| Value | Where to find it | Environment variable |
|---|---|---|
| Project URL | Top of the API settings page | `SUPABASE_URL` |
| anon/public key | Under "Project API keys" | `SUPABASE_ANON_KEY` |
| service_role key | Under "Project API keys" | `SUPABASE_SERVICE_ROLE_KEY` |
| JWT Secret | Settings → API → JWT Settings | `SUPABASE_JWT_SECRET` |

> **Warning:** The `service_role` key has admin access to your database. Treat it like a password — don't commit it to source control.

## Configure OAuth providers (optional)

InfraAudit's frontend supports Google and GitHub OAuth login. To enable them:

### Google OAuth

1. In the [Google Cloud Console](https://console.cloud.google.com), create an OAuth 2.0 client ID (Web application type).
2. Add your frontend URL to **Authorized redirect URIs**: `https://your-supabase-project.supabase.co/auth/v1/callback`.
3. Copy the **Client ID** and **Client secret**.
4. In Supabase: **Authentication → Providers → Google**. Paste the Client ID and Secret. Enable the provider.

### GitHub OAuth

1. At [github.com/settings/applications/new](https://github.com/settings/applications/new), create a new OAuth App.
2. Set **Authorization callback URL** to `https://your-supabase-project.supabase.co/auth/v1/callback`.
3. Copy the **Client ID** and **Client Secret**.
4. In Supabase: **Authentication → Providers → GitHub**. Paste the values. Enable the provider.

## Email auth (default)

Email + password login is enabled by default. No additional Supabase configuration is required. Users sign up directly through the InfraAudit frontend.

## Site URL

Set the Supabase **Site URL** to your frontend URL so the auth redirects work:

1. Go to **Authentication → URL Configuration**.
2. Set **Site URL** to `http://localhost:5173` for local dev, or your production frontend URL.

## Row Level Security

InfraAudit uses Supabase only for authentication (not for data storage — the backend uses its own Postgres instance). You don't need to configure any RLS policies in Supabase.

## Summary: values to copy into `.env`

```env
SUPABASE_URL=https://xxxxxxxxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your-jwt-secret-here
```

The JWT Secret is the most critical value. The backend uses it to verify every incoming JWT. If it's wrong, all authenticated requests will return `401`.

## Next steps

- [Docker Compose](/self-hosting/docker-compose) — start the full stack
- [Configuration reference](/self-hosting/configuration) — full environment variable list

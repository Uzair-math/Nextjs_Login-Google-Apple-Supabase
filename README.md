# Supabase Auth + Next.js Boilerplate

A modern Next.js 15 application featuring full authentication flows with Google and Apple Login using Supabase. This project includes user persistence in a custom `users` table and a secure route handler for managing sessions.

## Features

- **Authentication**: Social login with Google and Apple.
- **User Management**: Automatic user creation in `public.users` table via Supabase Triggers.
- **Security**: Row Level Security (RLS) policies enabled.
- **Responsive UI**: Built with Tailwind CSS and Radix UI components.

## Prerequisites

- Node.js (v18 or higher)
- A Supabase Project

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd supabase-auth-nextjs-google-boilerplate
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

## Supabase Configuration

### 1. Database Setup
Run the `supabase_setup.sql` script in your Supabase SQL Editor. This script handles:
- Creating the `public.users` table.
- Enabling RLS policies.
- Setting up a Trigger to automatically copy new users from `auth.users` to `public.users`.

### 2. Enable Auth Providers
Go to the **Authentication** -> **Providers** section in your Supabase Dashboard:

- **Google**:
  - Enable Google provider.
  - Add your **Client ID** and **Client Secret** (from Google Cloud Console).
  
- **Apple**:
  - Enable Apple provider.
  - Add your **Service ID**, **Team ID**, **Key ID**, and **Private Key** file contents.

### 3. Configure Redirect URLs
Ensure your redirect URL is set correctly in Supabase/Google/Apple:
- Local Development: `http://localhost:3000/auth/callback`

## Running the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `app/auth/`: Contains login page (`login/page.tsx`) and callback handler (`callback/route.ts`).
- `components/`: Reusable UI components.
- `lib/supabase/`: Client and Server Supabase utilities.
- `supabase_setup.sql`: Database initialization script.

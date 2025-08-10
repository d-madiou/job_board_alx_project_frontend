# Job Application Platform (Frontend)

## Overview

This is the frontend for a job application platform built with React and Tailwind CSS, designed to interact with a Django REST API backend. The application allows users to browse job listings, view detailed job information, and submit applications for jobs. It provides a modern, responsive user interface with a focus on usability and seamless navigation.

## Features

- **Job Listings**: Displays a list of jobs with key details like title, company, location, job type, salary, and experience level.
- **Job Details**: Shows comprehensive job information, including description, category, posted date, and application status.
- **Application Form**: Enables authenticated users to submit job applications with details such as cover letter, resume URL, portfolio URL, LinkedIn profile, contact information, experience, expected salary, and availability date.
- **Responsive Design**: Built with Tailwind CSS for a consistent, mobile-friendly user experience.
- **Authentication**: Supports JWT-based authentication for secure application submissions (requires users to log in).
- **Navigation**: Uses React Router for client-side routing to navigate between job listings, job details, and application forms.

## Tech Stack

- **React**: JavaScript library for building the user interface.
- **React Router**: For client-side routing.
- **Tailwind CSS**: For styling and responsive design.
- **Heroicons**: For icons used in job cards and details.
- **Vite**: Build tool for fast development and production builds.
- **Fetch API**: For making HTTP requests to the Django backend.


## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Django Backend: Ensure the backend is running at `https://jobboardalxprojectbackend-production.up.railway.app` (or set `VITE_API_BASE_URL` in `.env`).

### Installation

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd job-application-frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add the backend API URL:
   ```env
   VITE_API_BASE_URL=https://jobboardalxprojectbackend-production.up.railway.app
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```

   The app will be available at `https://jobboardalxprojectbackend-production.up.railway.app` (Vite default port).

5. **Build for Production:**
   ```bash
   npm run build
   ```
   or
   ```bash
   yarn build
   ```

   The production-ready files will be in the `dist/` directory.

## Usage

### Browse Jobs

- Visit the homepage (`/`) to view a list of available jobs displayed as cards.
- Each card shows the job title, company, location, job type, salary, experience level, and posted date.

### View Job Details

- Click on a job card to navigate to the job details page (`/:slug/`).
- View detailed information, including the job description, category, and status.

### Apply for a Job

- On the job details page, click "Apply Now" to navigate to the application form (`/:slug/apply/`).
- Log in to your account to access the form (requires authentication).
- Fill out the form with your cover letter, resume URL, portfolio URL (optional), LinkedIn URL (optional), contact information, years of experience, expected salary, and availability date.
- Submit the form to send your application to the backend.

### View Applications

- After submitting an application, you are redirected to the "My Applications" page (`/my-applications/`), where you can view your submitted applications (requires backend implementation).

## Routing

The frontend uses React Router to manage client-side routes:

- `/`: Displays the job list (JobList component).
- `/:slug/`: Shows detailed job information (JobDetails component).
- `/:slug/apply/`: Renders the job application form (JobApplicationForm component).
- `/my-applications/`: Displays the user's submitted applications (not implemented in provided code).

## Authentication

- The application form requires users to be authenticated.
- JWT tokens are stored in localStorage (key: `authToken`) after login.
- The JobApplicationForm component includes the `Authorization: Bearer <token>` header in API requests.
- If no token is found, users are redirected to the login page (`/login`, not implemented in provided code).

## Backend Integration

The frontend interacts with a Django REST API at `https://jobboardalxprojectbackend-production.up.railway.app` (configurable via `VITE_API_BASE_URL`). Key endpoints:

- `GET /api/jobs/`: Fetch the list of jobs.
- `GET /api/jobs/<slug>/`: Fetch details for a specific job.
- `POST /api/applications/apply/`: Submit a job application (requires authentication).
- `GET /api/applications/my-applications/`: Fetch the user's applications.

Ensure the backend is configured with CORS to allow requests from the frontend origin (e.g., `http://localhost:5173`).

## Styling

- **Tailwind CSS**: Used for responsive, utility-first styling.
- **Color Scheme**:
  - Primary: `#54990b` (green, used for buttons and highlights).
  - Text: `#F0F0F0` (light gray for primary text), `#A0A0A0` (gray for secondary text).
  - Background: `rgba(255, 255, 255, 0.05)` for card backgrounds, `#3F7A8C` for company logo placeholders.
- **Icons**: Heroicons for location, job type, salary, and other UI elements.

## Known Issues

- **Authentication**: The application form requires a valid JWT token. Ensure a login system is implemented to provide tokens.
- **Missing Components**: The JobList and login components are assumed but not provided in the codebase.
- **Error Handling**: Backend errors (e.g., duplicate applications) may require additional frontend validation.

## Future Improvements

- Implement a login page to handle user authentication.
- Add a JobList component to display job cards.
- Enhance error handling to display specific backend validation errors.
- Add support for file uploads (e.g., resume) if the backend supports it.
- Implement the "My Applications" page to show application statuses.

## Contributing

Contributions are welcome! Please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## Developer

Thierno Madiou Diallo for Alx prodev frontend
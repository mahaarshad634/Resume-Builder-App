# Resume Builder

A production-style resume builder built with **React** and **Firebase**. Create, edit, duplicate, and manage multiple resumes with a live preview, 12 color palettes, dark mode, and a choice of visual templates — all secured per-user with Firebase Authentication and Firestore.

Built as a learning project to strengthen React component architecture, routing, state management, and Firebase integration through a real, end-to-end application — deployed live on Vercel.

**Live app:** [resume-builder-app-one.vercel.app](https://resume-builder-app-one.vercel.app)

---

## ✨ Features

### Authentication
- Sign up, log in, and reset password via email/password
- Sign in with **Google** and **GitHub**
- Protected routes — users can only access their own resumes
- Clear, non-leaking error messaging when an email is already registered with a different sign-in method

### Resume Management
- Create resumes and manage them from the dashboard
- **Duplicate and Delete** available directly from the Resume Editor toolbar, alongside the resume you're actively working on
- All data stored and synced in real time with Firestore
- Auto-save — changes save automatically as you type
- Search resumes by title from the dashboard

### Resume Editor
- Nine reusable sections: Personal Information, Professional Summary, Education, Experience, Skills, Projects, Certifications, Languages, and Social Links
- Live preview that updates instantly as you edit
- Multiple templates (**Classic**, **Modern**, **Bold**) — the same data rendered in completely different layouts
- **12 color palettes** to personalize each resume's accent colors, independent of app-wide light/dark mode
- **Dark mode toggle** — persists across sessions via localStorage; the resume document itself always stays print-friendly/light regardless of app theme
- Download your resume as a **PDF with real, clickable hyperlinks** (social links, project links) — generated with jsPDF, matching whichever template and palette is currently selected

### UX & Polish
- Loading and error states handled consistently across the app, including skeleton loaders on the dashboard
- Unsaved-changes warning before leaving the editor
- Entrance animations and micro-interactions (buttons, inputs, staggered card loading)
- Fully responsive — works on desktop, tablet, and mobile, including dropdown menus that stay within the viewport on narrow screens
- Custom theme — serif/sans typography pairing, consistent spacing system

### Code Quality
- ESLint configured for the full stack (React, React Hooks, Vitest/Node globals) with zero unresolved warnings
- Errors are logged to the console before being shown to the user as friendly messages, so real Firebase errors are never silently discarded
- Vitest + React Testing Library configured for component tests, with an example suite for the Signup form (rendering + validation)

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React (Vite) |
| Routing | React Router |
| Forms | React Hook Form |
| UI Components | React Bootstrap |
| Icons | lucide-react |
| Backend / Auth / Database | Firebase (Authentication + Firestore) |
| PDF Export | jsPDF (native clickable link annotations) |
| Testing | Vitest, React Testing Library |
| Linting | ESLint (flat config) |
| Deployment | Vercel |

---

## 📸 Screenshots

<!-- Add screenshots here, e.g.: -->
<!-- ![Dashboard](./screenshots/dashboard.png) -->
<!-- ![Resume Editor](./screenshots/editor.png) -->
<!-- ![Live Preview - Modern Template](./screenshots/modern-template.png) -->

---

## 📁 Folder Structure

```
resume-builder/
├── src/
│   ├── components/          # Shared, reusable UI (Loader, ErrorMessage, ConfirmModal,
│   │                        #   ThemeToggle, ColorPalette, SkeletonCard, AuthLayout)
│   ├── context/              # AuthContext, ThemeContext — global app state
│   ├── features/
│   │   ├── auth/              # Login, Signup, ForgotPassword forms
│   │   │   └── __tests__/      # Component tests (Vitest + Testing Library)
│   │   └── resume/
│   │       ├── sections/       # 9 resume section components
│   │       ├── templates/      # Classic, Modern, Bold + template registry
│   │       ├── ResumeForm.jsx
│   │       ├── ResumePreview.jsx
│   │       └── ResumeCard.jsx
│   ├── hooks/                # useResume, useDebounce
│   ├── pages/                 # Login, Signup, ForgotPassword, Dashboard, ResumeEditor
│   ├── routes/                # AppRoutes, ProtectedRoute
│   ├── services/              # firebase.js, resumeService.js
│   ├── utils/                 # defaultResumeData.js, exportResumePdf.js
│   ├── test/                  # setup.js — Vitest/Testing Library setup
│   ├── App.jsx
│   └── main.jsx
├── .env                      # Firebase config (not committed)
├── .npmrc                    # legacy-peer-deps=true (React 19 compatibility)
├── eslint.config.js           # Flat ESLint config with browser/node/test globals
├── vercel.json                # SPA rewrite config for client-side routing
└── package.json
```

---

## 🔥 Firestore Data Model

```
users (collection)
  └── {uid}
       └── resumes (subcollection)
            └── {resumeId}
                 ├── title
                 ├── templateId
                 ├── themeColors { primary, primaryHover, accent, bg, surface, border }
                 ├── personalInfo { fullName, email, phone, address, jobTitle }
                 ├── summary
                 ├── education []
                 ├── experience []
                 ├── skills []
                 ├── projects []
                 ├── certifications []
                 ├── languages []
                 ├── socialLinks []
                 ├── createdAt
                 └── updatedAt
```

Resumes are nested under each user's own document, so Firestore security rules can enforce ownership directly from the path:

```
match /users/{userId}/resumes/{resumeId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- A Firebase project with **Authentication** (Email/Password, Google, GitHub) and **Firestore** enabled

### 1. Clone the repository
```bash
git clone https://github.com/mahaarshad634/Resume-Builder-App.git
cd Resume-Builder-App
```

### 2. Install dependencies
```bash
npm install
```
> This project pins `react@19`, which conflicts with some dev dependencies' peer requirements. A `.npmrc` with `legacy-peer-deps=true` is included so `npm install` works out of the box, both locally and on Vercel.

### 3. Set up environment variables
Create a `.env` file in the project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
You can find these values in your Firebase project settings under **Project Settings → Your apps**.

### 4. Run the app
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 5. Run tests
```bash
npm test
```

### 6. Run the linter
```bash
npm run lint
```

---

## 🧩 Available Templates

| Template | Style |
|---|---|
| **Classic** | Single-column, traditional resume layout |
| **Modern** | Two-column layout with a colored sidebar (initials avatar, tag-style skills, timeline for experience/education), color follows the selected palette |
| **Bold** | Colored header banner with accented section dividers |

New templates can be added by creating a component in `src/features/resume/templates/` and registering it in `templateRegistry.js` — the Live Preview updates automatically. Matching PDF export layouts are added separately in `src/utils/exportResumePdf.js`, since PDF generation is hand-drawn with jsPDF rather than a DOM screenshot (this keeps links in the exported PDF genuinely clickable).

---

## 🚢 Deployment

Deployed on **Vercel**. Two things needed for a working SPA deployment on Vercel:
- `vercel.json` with a catch-all rewrite to `index.html`, so client-side routes (e.g. `/dashboard`, `/resume/:id`) don't 404 on direct load or refresh
- `.npmrc` with `legacy-peer-deps=true`, so Vercel's build step can resolve dependencies despite the React 19 peer-dependency conflicts

---

## 📄 License

This project is for educational purposes.

---

## 👤 Author

**Maha Arshad**
GitHub: [@mahaarshad634](https://github.com/mahaarshad634)
# Resume Builder

A production-style resume builder built with **React** and **Firebase**. Create, edit, duplicate, and manage multiple resumes with a live preview and a choice of visual templates — all secured per-user with Firebase Authentication and Firestore.

Built as a learning project to strengthen React component architecture, routing, state management, and Firebase integration through a real, end-to-end application.

---

## ✨ Features

### Authentication
- Sign up, log in, and reset password via email/password
- Sign in with **Google** and **GitHub**
- Protected routes — users can only access their own resumes

### Resume Management
- Create, edit, duplicate, and delete multiple resumes
- All data stored and synced in real time with Firestore
- Auto-save — changes save automatically as you type
- Search resumes by title from the dashboard

### Resume Editor
- Nine reusable sections: Personal Information, Professional Summary, Education, Experience, Skills, Projects, Certifications, Languages, and Social Links
- Live preview that updates instantly as you edit
- Multiple templates (**Classic**, **Modern**, **Bold**, **Minimal**) — the same data rendered in completely different layouts
- Download your resume as a PDF

### UX & Polish
- Loading and error states handled consistently across the app
- Unsaved-changes warning before leaving the editor
- Fully responsive — works on desktop, tablet, and mobile
- Custom theme — teal color palette, serif/sans typography pairing

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | React (Vite) |
| Routing | React Router |
| Forms | React Hook Form |
| UI Components | React Bootstrap |
| Backend / Auth / Database | Firebase (Authentication + Firestore) |
| PDF Export | react-to-print |

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
│   ├── components/          # Shared, reusable UI (Loader, ErrorMessage, ConfirmModal)
│   ├── context/              # AuthContext — global auth state
│   ├── features/
│   │   ├── auth/              # Login, Signup, ForgotPassword forms
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
│   ├── utils/                 # defaultResumeData.js
│   ├── App.jsx
│   └── main.jsx
├── .env                      # Firebase config (not committed)
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

---

## 🧩 Available Templates

| Template | Style |
|---|---|
| **Classic** | Single-column, traditional resume layout |
| **Modern** | Two-column layout with a dark sidebar for contact info, skills, and languages |
| **Bold** | Colored header banner with accented section dividers |

New templates can be added by creating a component in `src/features/resume/templates/` and registering it in `templateRegistry.js` — no other code changes required.

---

## 📄 License

This project is for educational purposes.

---

## 👤 Author

**Maha Arshad**
GitHub: [@mahaarshad634](https://github.com/mahaarshad634)
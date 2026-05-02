# 🏖️ Vacation Shopping List

A realtime collaborative vacation shopping list with voting and a checklist.  
Built with **React (Vite) + Firebase (Firestore + Auth + Hosting)**.

---

## Project Structure

```
shopping-list/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AddItemForm.jsx        # Input to add new items
│   │   ├── VotingItemCard.jsx     # Single card in voting list
│   │   ├── ApprovedItemCard.jsx   # Single card in approved list
│   │   ├── VotingList.jsx         # Voting section
│   │   └── ApprovedList.jsx       # Approved section
│   ├── hooks/
│   │   ├── useAuth.js             # Anonymous Firebase Auth
│   │   └── useItems.js            # Realtime Firestore listener
│   ├── pages/
│   │   └── Home.jsx               # Main page layout
│   ├── services/
│   │   └── itemService.js         # All Firestore read/write logic
│   ├── App.jsx                    # Root component + header
│   ├── firebase.js                # Firebase initialization
│   ├── index.css                  # Tailwind + Google Fonts
│   └── main.jsx                   # React entry point
├── .env.example                   # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 1. Firebase Project Setup

1. Go to https://console.firebase.google.com and create a new project (or use an existing one).

2. **Enable Anonymous Authentication**
   - Go to **Build > Authentication > Sign-in method**
   - Click **Anonymous** and enable it

3. **Create a Firestore Database**
   - Go to **Build > Firestore Database**
   - Click **Create database**, choose **test mode**, pick a region

4. **Register a Web App**
   - Go to **Project Settings** (gear icon) > **Your apps** > click **</>** (Web)
   - Give it a name and click **Register app**
   - Copy the `firebaseConfig` object values for the next step

5. **Firestore Security Rules** (paste in **Firestore > Rules**):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read, create, update: if request.auth != null;
    }
  }
}
```

---

## 2. Environment Variables

```bash
# Copy the template
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project values:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> All variables are prefixed `VITE_` so Vite exposes them to the browser.

---

## 3. Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. Open multiple tabs to see realtime collaboration in action.

---

## 4. Build for Production

```bash
npm run build
```

Output goes to `dist/`.

---

## 5. Deploy to Firebase Hosting

```bash
# Install Firebase CLI (once)
npm install -g firebase-tools

# Log in
firebase login

# Initialize hosting in the project root
firebase init hosting
# > Public directory: dist
# > Single-page app: Yes
# > Automatic builds with GitHub: No

# Build + deploy
npm run build
firebase deploy --only hosting
```

Your app will be live at `https://your-project.web.app`.

---

## How It Works

| Action | What happens |
|---|---|
| App opens | Anonymous sign-in triggered automatically |
| Add item | Firestore doc created: `status: "voting"`, `votes: 0` |
| Upvote | Transaction increments `votes`, appends `userId` to `voters`; if `votes >= 3` sets `status: "approved"` atomically |
| Reaches 3 votes | All clients see item move to Approved in realtime via `onSnapshot` |
| Check bought | `bought` field toggled |
| Assign item | `assignedTo` field updated inline |

---

## Firestore Data Model — collection `items`

```json
{
  "name": "Sunscreen",
  "status": "voting",
  "votes": 2,
  "voters": ["uid1", "uid2"],
  "bought": false,
  "assignedTo": "",
  "createdAt": "<Timestamp>"
}
```

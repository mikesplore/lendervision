import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDDRVG4T1lboU9Fa4haklAQztv495VRe7E",
  authDomain: "quickstore-9f66e.firebaseapp.com",
  projectId: "quickstore-9f66e",
  storageBucket: "quickstore-9f66e.firebasestorage.app",
  messagingSenderId: "944274985446",
  appId: "1:944274985446:web:6304e6443456ee11f28627",
  measurementId: "G-283NGX2YD7"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  // Client-side initialization
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
  
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.log("Analytics not available:", error);
  }
} else {
  // Server-side - create dummy objects
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { app, auth, db, analytics };

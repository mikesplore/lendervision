import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  User,
  UserCredential
} from "firebase/auth";
import { auth } from "./firebase";

export const signUpWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    if (!auth) {
      throw new Error("Firebase auth is not initialized");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error("Signup error:", error);
    throw new Error(error.message || "Failed to sign up");
  }
};

export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    if (!auth) {
      throw new Error("Firebase auth is not initialized");
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error("Sign in error:", error);
    throw new Error(error.message || "Failed to sign in");
  }
};

export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Failed to log out");
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || "Failed to send password reset email");
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

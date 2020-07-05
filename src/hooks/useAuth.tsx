import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import firebase, { User } from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../firebaseConfig';


firebase.initializeApp(firebaseConfig);

interface IProps {
    children: ReactNode;
}

type AuthProvider = {
    user: firebase.User | null;
    signin: (email: string, password: string) => Promise<firebase.User | null>;
    signup: (email: string, password: string) => Promise<firebase.User | null>;
    signout: () => Promise<void>
    sendPasswordResetEmail: (email: string) => Promise<boolean>;
    confirmPasswordReset: (code: string, password: string) => Promise<boolean>;
}

const authContext = createContext<AuthProvider|undefined>(undefined)

export function ProvideAuth({ children }:IProps) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}


function useProvideAuth():AuthProvider{
    const [user, setUser] = useState<User | null>(null);

    const signin = (email:string, password:string) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email:string, password:string) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        setUser(response.user);
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
      });
  };

  const sendPasswordResetEmail = (email:string) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (code:string, password:string) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset
  };

}



export const useAuth = () => {
  return useContext(authContext);
};
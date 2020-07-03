import {createContext} from 'react';

type  UserContextType = { 
    firebaseUserID: string | null;
    setFirebaseUserID: (newID: string | null) => void;
}
const user = createContext<UserContextType | undefined>(undefined);


export default user; 
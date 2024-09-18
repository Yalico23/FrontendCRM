import React, { useState, ReactNode, Dispatch, SetStateAction, createContext, useEffect } from 'react';

interface AuthContextType {
  token: string;
  auth: boolean;
}

interface CRMProviderProps {
  children: ReactNode;
}

type CRMContextType = [AuthContextType, Dispatch<SetStateAction<AuthContextType>>];

const CRMContext = createContext<CRMContextType>([
  { token: '', auth: false },
  () => {}
]);

const CRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthContextType>(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : { token: '', auth: false };
  });

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  return (
    <CRMContext.Provider value={[auth, setAuth]}>
      {children}
    </CRMContext.Provider>
  );
};

export {
  CRMContext,
  CRMProvider
};

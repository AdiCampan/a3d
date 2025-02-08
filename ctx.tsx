import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore"; // 🔹 Importar Firestore
import { auth, db } from "./firebase"; // 🔹 Importar Firestore y Auth

const SessionContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: any | null;
  isLoading: boolean;
  trabajadores: any[];
  heramientas: any[];
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  trabajadores: [],
  heramientas: [],
});

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trabajadores, setTrabajadores] = useState([]); // 🔹 Estado para los trabajadores
  const [heramientas, setHeramientas] = useState([]);

  useEffect(() => {
    // 🔹 Escuchar cambios en la autenticación
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setSession(user);
      setIsLoading(false);
    });

    // 🔹 Escuchar cambios en la colección "trabajadores"
    const unsubscribeTrabajadores = onSnapshot(
      collection(db, "trabajadores"),
      (snapshot) => {
        const trabajadoresData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrabajadores(trabajadoresData);
      },
      (error) => {
        console.error("Error al obtener trabajadores:", error);
      }
    );

    const unsubscribeHerramientas = onSnapshot(
      collection(db, "heramientas"),
      (snapshot) => {
        const heramientasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHeramientas(heramientasData);
      },
      (error) => {
        console.error("Error al obtener herramientas:", error);
      }
    );

    return () => {
      unsubscribeHerramientas();
      unsubscribeAuth();
      unsubscribeTrabajadores();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        trabajadores,
        heramientas,
        signOut: () => signOut(auth),
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

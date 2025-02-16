import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore"; // 🔹 Importar Firestore
import { auth, db } from "./firebase"; // 🔹 Importar Firestore y Auth
import React from "react";

const SessionContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: any | null;
  isLoading: boolean;
  trabajadores: any[];
  heramientas: any[];
  obras: any[];
  fichajes: any[];
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  trabajadores: [],
  heramientas: [],
  obras: [],
  fichajes: [],
});

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trabajadores, setTrabajadores] = useState([]); // 🔹 Estado para los trabajadores
  const [heramientas, setHeramientas] = useState([]);
  const [obras, setObras] = useState([]);
  const [fichajes, setFichajes] = useState([]);

  useEffect(() => {
    // 🔹 Escuchar cambios en la autenticación
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setSession(user);
      setIsLoading(false);
    });

    // Escuchar obras  //
    const unsubscribeObras = onSnapshot(
      collection(db, "obras"),
      (snapshot) => {
        const obrasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setObras(obrasData);
      },
      (error) => {
        console.error("Error al obtener obras:", error);
      }
    );

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

    //Escuchar heramientas//
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

    //Escuchar fichajes//
    const unsubscribeFichajes = onSnapshot(
      collection(db, "fichajes"),
      (snapshot) => {
        const fichajesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFichajes(fichajesData);
      },
      (error) => {
        console.error("Error al obtener fichajes:", error);
      }
    );

    // const fetchFichajes = async () => {
    //   const auth = getAuth();
    //   const user = auth.currentUser;
    //   try {
    //     const fichajesRef = collection(db, "fichajes");

    //     // 🔹 Obtener solo los fichajes de los últimos 30 días
    //     const hoy = new Date();
    //     const hace30Dias = new Date(hoy);
    //     hace30Dias.setDate(hoy.getDate() - 30);
    //     const fechaFiltro = hace30Dias.toISOString().split("T")[0]; // "YYYY-MM-DD"

    //     const q = query(
    //       fichajesRef,
    //       where("trabajadorId", "==", session.uid),
    //       where("fecha", ">=", fechaFiltro),
    //       orderBy("fecha", "desc") // 🔹 Ordenar por fecha (más reciente primero)
    //     );

    //     const snapshot = await getDocs(q);

    //     const fichajesData = snapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       ...doc.data(),
    //     }));

    //     setFichajes(fichajesData);
    //   } catch (error) {
    //     console.error("Error obteniendo fichajes:", error);
    //   }
    // };

    return () => {
      unsubscribeFichajes();
      unsubscribeObras();
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
        obras,
        fichajes,

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

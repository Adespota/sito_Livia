import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/authContext";
import { firestore } from "@/app/firebase";
import { query, where, getDocs, collection } from "firebase/firestore";
import { setRole } from '/src/reducer/features/roleSlice';



const useUserRedirect = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useAuth();
    const emailCurrentUser = user && user.user ? user.user.email : '';

    useEffect(() => {
        const fetchData = async () => {
            if (emailCurrentUser) {
                try {
                    const professionistiQuery = query(
                        collection(firestore, 'userProfessionisti'),
                        where("email", "==", emailCurrentUser)
                    );
                    const clientiQuery = query(
                        collection(firestore, 'userClienti'),
                        where("email", "==", emailCurrentUser)
                    );

                    const [professionistiSnapshot, clientiSnapshot] = await Promise.all([
                        getDocs(professionistiQuery),
                        getDocs(clientiQuery)
                    ]);

                    let userFound = false;

                    professionistiSnapshot.forEach((doc) => {
                        const userData = doc.data();
                        const { ruolo } = userData;
                        if (ruolo === "Professionista") {
                            dispatch(setRole("Professionista"));
                            if (typeof window !== 'undefined') {
                                router.push("/dashboardAdmin");
                            }
                            userFound = true;
                        }
                    });

                    clientiSnapshot.forEach((doc) => {
                        const userData = doc.data();
                        const { ruolo } = userData;
                        if (ruolo === "Cliente") {
                            dispatch(setRole("Cliente"));
                            if (typeof window !== 'undefined') {
                                router.push("/dashboard");
                            }
                            userFound = true;
                        }
                    });

                    if (!userFound) {
                        console.log("Ruolo sconosciuto");
                    }

                } catch (error) {
                    console.error("Errore di autenticazione:", error);
                }
            }
        };

        fetchData();
    }, [emailCurrentUser, dispatch, router]);

    return null;
};

export default useUserRedirect;

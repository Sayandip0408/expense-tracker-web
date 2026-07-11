import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react'
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    type User,
} from 'firebase/auth'
import {
    collection,
    doc,
    onSnapshot,
    query,
    setDoc,
    where,
} from 'firebase/firestore'
import { auth, db } from '../firebase.ts'
import type { Gender, UserDoc } from '../types'

const AVATAR_MALE =
    'https://res.cloudinary.com/dgb69w56a/image/upload/v1736219943/expense-tracker/g3ftoyoy8zdw19fo90hm.png'
const AVATAR_FEMALE =
    'https://res.cloudinary.com/dgb69w56a/image/upload/v1736219942/expense-tracker/d62cxzgxhshhvpwa741g.png'

interface SignupArgs {
    name: string
    email: string
    password: string
    gender: Gender
}

interface AuthContextValue {
    user: User | null
    userDoc: UserDoc | null
    userDocId: string | null
    authLoading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (args: SignupArgs) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [userDoc, setUserDoc] = useState<UserDoc | null>(null)
    const [userDocId, setUserDocId] = useState<string | null>(null)
    const [authLoading, setAuthLoading] = useState(true)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setAuthLoading(false)
        })
        return unsub
    }, [])

    useEffect(() => {
        if (!user?.email) {
            setUserDoc(null)
            setUserDocId(null)
            return
        }
        const q = query(collection(db, 'users'), where('email', '==', user.email))
        const unsub = onSnapshot(q, (snap) => {
            if (!snap.empty) {
                setUserDoc(snap.docs[0].data() as UserDoc)
                setUserDocId(snap.docs[0].id)
            } else {
                setUserDoc(null)
                setUserDocId(null)
            }
        })
        return unsub
    }, [user?.email])

    async function login(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email.trim(), password.trim())
    }

    async function signup({ name, email, password, gender }: SignupArgs) {
        const cred = await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password.trim(),
        )
        const image = gender === 'Male' ? AVATAR_MALE : AVATAR_FEMALE
        await setDoc(doc(db, 'users', cred.user.uid), {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
            gender,
            balance: 0,
            user_id: cred.user.uid,
            dp: image,
        } satisfies UserDoc)
    }

    async function logout() {
        await signOut(auth)
    }

    const value: AuthContextValue = {
        user,
        userDoc,
        userDocId,
        authLoading,
        login,
        signup,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

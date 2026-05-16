import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store'
import type { Profile } from '../lib/supabase'

interface AuthContextValue {
  user: Profile | null
  isLoading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  isAdmin: () => boolean
  isStorekeeper: () => boolean
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Step 1: restore session immediately from localStorage (handles page reload)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email!, session.user.user_metadata)
      } else {
        setIsLoading(false)
      }
    })

    // Step 2: keep listening for subsequent auth changes (login, logout, OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email!, session.user.user_metadata)
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = (userId: string, email: string, meta?: any) => {
    const provisional: Profile = {
      id: userId,
      email,
      full_name: meta?.full_name || meta?.name || email.split('@')[0],
      phone: undefined,
      avatar_url: meta?.avatar_url || meta?.picture || undefined,
      role: 'user',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Set provisional user immediately — header updates right away without waiting for DB
    setUser(provisional)
    setIsLoading(false)

    // Then fetch the real profile in the background (gets correct role, full_name, etc.)
    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (data) {
          if (!data.is_active) {
            await supabase.auth.signOut()
            setUser(null)
            return
          }
          setUser(data as Profile)
          return
        }
        if (error?.code === 'PGRST116') {
          await supabase.from('profiles').insert({
            id: userId,
            email,
            full_name: provisional.full_name,
            role: 'user',
            is_active: true,
          })
        }
        // provisional already set — nothing more to do
      } catch {
        // DB unreachable — provisional user is already shown, that's fine
      }
    })()
  }

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error as Error | null }
    } catch (err: any) {
      return { error: new Error(err?.message ?? 'Sign in failed') }
    }
  }

  const signUp = async (email: string, password: string, fullName: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      return { error: error as Error | null }
    } catch (err: any) {
      return { error: new Error(err?.message ?? 'Sign up failed') }
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
    } finally {
      setUser(null)
    }
  }

  const signInWithGoogle = async (): Promise<void> => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: Error | null }> => {
    if (!user) return { error: new Error('Not authenticated') }
    // Strip privileged fields — role and is_active can only be changed by admins
    // via the Supabase admin API, never from the client profile form.
    const { role: _r, is_active: _a, id: _i, email: _e, created_at: _c, ...safeUpdates } = updates as any
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...safeUpdates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
      if (!error) setUser({ ...user, ...safeUpdates })
      return { error: error as Error | null }
    } catch (err: any) {
      return { error: new Error(err?.message ?? 'Update failed') }
    }
  }

  const isAdmin = () => user?.role === 'admin'
  const isStorekeeper = () => user?.role === 'storekeeper' || user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, signInWithGoogle, isAdmin, isStorekeeper, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// src/pages/AuthPage.tsx
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export const AuthPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl">
                <h2 className="text-2xl font-bold text-center text-white mb-8">Welcome to AdIntel</h2>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme="dark"
                    providers={['github', 'google']} // Example providers
                    socialLayout="horizontal"
                />
            </div>
        </div>
    );
};

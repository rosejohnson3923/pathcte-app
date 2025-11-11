import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@pathcte/shared';

export default function AuthConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        console.log('[AuthConfirm] Token hash:', tokenHash);
        console.log('[AuthConfirm] Type:', type);

        if (!tokenHash || !type) {
          setStatus('error');
          setMessage('Invalid confirmation link. Please try signing up again.');
          return;
        }

        // Verify the email confirmation token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as 'signup' | 'recovery' | 'invite' | 'email_change',
        });

        console.log('[AuthConfirm] Verification result:', { data, error });

        if (error) {
          console.error('[AuthConfirm] Verification error:', error);
          setStatus('error');
          setMessage(error.message || 'Failed to confirm email. The link may have expired.');
          return;
        }

        if (data?.user) {
          console.log('[AuthConfirm] Email confirmed successfully for user:', data.user.id);
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting to dashboard...');

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Email confirmation failed. Please try again.');
        }
      } catch (err) {
        console.error('[AuthConfirm] Unexpected error:', err);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-4">
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="bg-bg-primary rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          {status === 'loading' && (
            <div>
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-primary mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Confirming Email</h2>
              <p className="text-text-secondary">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Email Confirmed!</h2>
              <p className="text-text-secondary">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">Confirmation Failed</h2>
              <p className="text-text-secondary mb-4">{message}</p>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

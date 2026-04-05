'use client';
/**
 * EscalacaoIdeal — DESATIVADO
 * A escalação agora é feita exclusivamente no Tigre FC Fantasy League.
 * Este componente redireciona o usuário para a nova experiência.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EscalacaoIdeal() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/tigre-fc');
  }, [router]);

  // Tela de transição enquanto o redirect acontece
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      fontFamily: "'Barlow Condensed', system-ui, sans-serif",
    }}>
      <img
        src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png"
        alt="Tigre FC"
        style={{ width: 64, height: 64, objectFit: 'contain', opacity: 0.9 }}
      />
      <div style={{ fontSize: 13, fontWeight: 900, color: '#F5C400', letterSpacing: 4, textTransform: 'uppercase' }}>
        Redirecionando para o Tigre FC...
      </div>
    </div>
  );
}

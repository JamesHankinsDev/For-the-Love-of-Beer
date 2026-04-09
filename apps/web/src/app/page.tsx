export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        For the Love of Beer
      </h1>
      <h2 style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Brewery Dashboard
      </h2>
      <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
        Welcome to the brewery owner dashboard. Sign in to manage your brewery profile,
        customize your stamp design, and track visitor engagement.
      </p>
      <button
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        Sign In
      </button>
    </main>
  );
}

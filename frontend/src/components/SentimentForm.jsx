import { useState } from 'react';

export default function SentimentForm() {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5050/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>AI Sentiment Checker</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          placeholder="Enter a sentence..."
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          style={{ width: '100%', padding: '10px' }}
        />
        <button type="submit" disabled={loading} style={{ marginTop: '10px' }}>
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h4>Sentiment: <span style={{ textTransform: 'capitalize' }}>{result.sentiment}</span></h4>
          <p><strong>Source:</strong> {result.source}</p>
        </div>
      )}
    </div>
  );
}

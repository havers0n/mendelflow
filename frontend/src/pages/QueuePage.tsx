import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const QUEUE_PLACE = 'office1';

export default function QueuePage() {
  const [phone, setPhone] = useState('');
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedNumber = localStorage.getItem('queueNumber');
    if (savedNumber) {
      setQueueNumber(Number(savedNumber));
      checkPosition(Number(savedNumber));
    }
  }, []);

  useEffect(() => {
    if (queueNumber) {
      localStorage.setItem('queueNumber', queueNumber.toString());
    }
  }, [queueNumber]);

  const joinQueue = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch('https://xzzhjkhoepwikhdyauzy.supabase.co/functions/v1/smart-responder', {
      method: 'POST',
      body: JSON.stringify({ place: QUEUE_PLACE, phone }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      setError('Ошибка при постановке в очередь');
      setLoading(false);
      return;
    }
    const data = await res.json();
    setQueueNumber(data.number);
    setLoading(false);
    checkPosition(data.number);
  };

  const checkPosition = async (number?: number) => {
    setLoading(true);
    setError(null);
    const myNumber = number ?? queueNumber;
    if (!myNumber) return;
    const { data, error } = await supabase
      .from('queue')
      .select('number, status')
      .eq('place', QUEUE_PLACE)
      .eq('status', 'waiting')
      .order('number', { ascending: true });

    if (error) {
      setError('Ошибка при получении очереди');
      setLoading(false);
      return;
    }
    const numbers = data?.map((item: any) => item.number) || [];
    console.log('numbers:', numbers, 'myNumber:', myNumber);
    const pos = numbers.map(Number).indexOf(Number(myNumber));
    setPosition(pos >= 0 ? pos : null);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, borderRadius: 12, boxShadow: '0 2px 12px #eee' }}>
      <h2>Электронная очередь</h2>
      {!queueNumber ? (
        <>
          <input
            type="tel"
            placeholder="Ваш телефон"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{ width: '100%', padding: 8, fontSize: 18, marginBottom: 12, borderRadius: 6, border: '1px solid #ccc' }}
          />
          <button
            onClick={joinQueue}
            disabled={loading || !phone}
            style={{ width: '100%', padding: 12, fontSize: 18, borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none' }}
          >
            {loading ? 'Постановка...' : 'Встать в очередь'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </>
      ) : (
        <>
          <div style={{ fontSize: 22, margin: '16px 0' }}>
            Ваш номер: <b>{queueNumber}</b>
          </div>
          <div style={{ fontSize: 18, marginBottom: 12 }}>
            {position === 0
              ? 'Ваша очередь подошла! Подойдите к стойке.'
              : position !== null
                ? `Перед вами: ${position} человек(а)`
                : 'Вы не в очереди.'}
          </div>
          <button
            onClick={() => checkPosition()}
            style={{ width: '100%', padding: 10, fontSize: 16, borderRadius: 6, background: '#eee', border: '1px solid #ccc' }}
          >
            Обновить статус
          </button>
          <div style={{ marginTop: 16, color: '#888', fontSize: 15 }}>
            Ожидайте SMS, когда подойдёт ваша очередь.
          </div>
        </>
      )}
    </div>
  );
} 
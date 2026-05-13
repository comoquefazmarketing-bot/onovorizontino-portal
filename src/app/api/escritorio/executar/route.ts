// Proxy seguro: recebe chamadas do cliente, injeta AGENTS_SECRET e encaminha ao agente.
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function POST(req: NextRequest) {
  try {
    const { path, method, params, body } = await req.json() as {
      path: string;
      method: 'GET' | 'POST';
      params?: Record<string, string | number>;
      body?: Record<string, unknown>;
    };

    if (!path?.startsWith('/api/agents/')) {
      return NextResponse.json({ error: 'Caminho inválido.' }, { status: 400 });
    }

    const url = new URL(path, BASE);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    }

    const upstream = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AGENTS_SECRET ?? ''}`,
        'x-cron-secret': process.env.CRON_SECRET ?? '',
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await upstream.json().catch(() => ({ ok: upstream.ok, status: upstream.status }));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

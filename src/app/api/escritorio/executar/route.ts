// Proxy seguro: recebe chamadas do cliente, injeta auth headers e encaminha ao agente.
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { path, method, params, body } = await req.json() as {
      path: string;
      method: 'GET' | 'POST';
      params?: Record<string, string | number>;
      body?: Record<string, unknown>;
    };

    const ALLOWED = ['/api/agents/', '/api/tigre-fc/sofascore-'];
    if (!ALLOWED.some(prefix => path?.startsWith(prefix))) {
      return NextResponse.json({ error: 'Caminho inválido.' }, { status: 400 });
    }

    // Deriva BASE da própria request — funciona em dev e produção sem variável extra
    const reqUrl = new URL(req.url);
    const BASE = `${reqUrl.protocol}//${reqUrl.host}`;

    const url = new URL(path, BASE);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    }

    const secret = process.env.AGENTS_SECRET ?? '';
    const cron   = process.env.CRON_SECRET   ?? '';

    const upstream = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type':    'application/json',
        'Authorization':   `Bearer ${secret}`,
        'x-cron-secret':   cron,
        'x-webhook-secret': secret,
        'x-agents-secret':  secret,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await upstream.json().catch(() => ({ ok: upstream.ok, status: upstream.status }));
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

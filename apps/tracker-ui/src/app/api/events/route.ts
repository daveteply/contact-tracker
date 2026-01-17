import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const response = await fetch(
      `${dotnetApiUrl}${request.nextUrl.pathname}${request.nextUrl.search}`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch events' }, { status: response.status });
    }
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const body = await request.json();

    const response = await fetch(`${dotnetApiUrl}${request.nextUrl.pathname}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return Response.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

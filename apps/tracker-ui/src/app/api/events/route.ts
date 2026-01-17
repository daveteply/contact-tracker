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

// In apps/tracker-ui/src/app/api/events/route.ts
export async function POST(request: NextRequest) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const body = await request.json();

    console.log('Sending to C# API:', JSON.stringify(body, null, 2)); // ← Add this

    const response = await fetch(`${dotnetApiUrl}${request.nextUrl.pathname}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('C# API response status:', response.status); // ← Add this
    console.log('C# API response headers:', Object.fromEntries(response.headers)); // ← Add this

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      console.log('Error response content-type:', contentType); // ← Add this

      // Check if it's JSON or HTML
      const text = await response.text();
      console.log('Error response body (first 500 chars):', text.substring(0, 500)); // ← Add this

      return Response.json({ error: 'Failed to create event' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

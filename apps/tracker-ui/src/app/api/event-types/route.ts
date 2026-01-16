export async function GET(request: Request) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const response = await fetch(`${dotnetApiUrl}/api/event-types`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch event types' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching event types:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

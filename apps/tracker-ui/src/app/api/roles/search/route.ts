import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');

    const response = await fetch(`${dotnetApiUrl}/api/roles/search?q=${q}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return Response.json({ error: 'Role not found' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching role:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

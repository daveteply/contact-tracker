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
      return Response.json({ error: 'Company not found' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching company:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

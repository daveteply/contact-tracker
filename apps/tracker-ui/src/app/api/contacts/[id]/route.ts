import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const response = await fetch(`${dotnetApiUrl}${request.nextUrl.pathname}/${params.id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return Response.json({ error: 'Contact not found' }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const body = await request.json();

    const response = await fetch(`${dotnetApiUrl}${request.nextUrl.pathname}`, {
      method: 'PATCH',
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
    return Response.json(data);
  } catch (error) {
    console.error('Error updating contact:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const response = await fetch(`${dotnetApiUrl}${request.nextUrl.pathname}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to delete contact' }, { status: response.status });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

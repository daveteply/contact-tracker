import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }

    const response = await fetch(`${dotnetApiUrl}${request.nextUrl.pathname}`, {
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
    console.error('Error updating Contact:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
  if (!dotnetApiUrl) {
    throw new Error('DOTNET_API_BASE_URL environment variable is not set');
  }

  try {
    const response = await fetch(`${dotnetApiUrl}${request.nextUrl.pathname}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return Response.json(
        { success: false, message: 'Failed to delete Contact' },
        { status: response.status },
      );
    }

    return Response.json({ success: true, message: 'Contact deleted!' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting Contact:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

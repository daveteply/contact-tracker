export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }

    const { id } = await params;

    const response = await fetch(`${dotnetApiUrl}/api/companies/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Company not found' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching company:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(`${dotnetApiUrl}/api/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return Response.json(result, { status: response.status });
  } catch (error) {
    console.error('Error updating company:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }

    const { id } = await params;

    const response = await fetch(`${dotnetApiUrl}/api/companies/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to delete company' },
        { status: response.status },
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting company:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

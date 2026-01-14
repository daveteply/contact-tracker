import { ApiResult, CompanyReadDto } from '@contact-tracker/api-models';

export async function GET(request: Request) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const response = await fetch(`${dotnetApiUrl}/api/companies`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch companies' }, { status: response.status });
    }

    const result = (await response.json()) as ApiResult<CompanyReadDto[]>;

    if (!result.success) {
      return Response.json(
        {
          error: result.message || 'Failed to fetch companies',
          errors: result.errors,
        },
        { status: 400 },
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const dotnetApiUrl = process.env.DOTNET_API_BASE_URL;
    if (!dotnetApiUrl) {
      throw new Error('DOTNET_API_BASE_URL environment variable is not set');
    }
    const body = await request.json();

    const response = await fetch(`${dotnetApiUrl}/api/companies`, {
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
    console.error('Error creating company:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// EMPTY FILE TO PREVENT BUILD ERRORS
// THE ACTUAL API IS NOW AT THE ROOT /api/admin.php OR MANAGED LOCALLY
export const dynamic = 'force-static';

export async function GET() {
  return new Response(JSON.stringify({ message: "API disabled for static export" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

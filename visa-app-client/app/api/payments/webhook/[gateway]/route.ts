import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5000/api/v1";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ gateway: string }> }
) {
    const { gateway } = await params;
    const url = new URL(req.url);
    const tx = url.searchParams.get("tx") || "";

    // Extract body for forwarding depending on content-type
    let bodyData;
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        bodyData = Object.fromEntries(formData.entries());
    } else if (contentType.includes("application/json")) {
        bodyData = await req.json();
    } else {
        bodyData = await req.text();
    }

    // Forward the webhook to the backend
    try {
        const backendRes = await fetch(`${BACKEND_URL}/payments/webhook/${gateway}?tx=${tx}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
        });

        if (backendRes.ok) {
            // Redirect to the success frontend page
            return NextResponse.redirect(new URL("/payments?payment_status=success", req.url), 303);
        } else {
            return NextResponse.redirect(new URL("/payments?payment_status=failed", req.url), 303);
        }
    } catch (error) {
        console.error("Webhook proxy error:", error);
        return NextResponse.redirect(new URL("/payments?payment_status=error", req.url), 303);
    }
}

export async function GET(
    req: NextRequest
) {
    // Stripe redirects with GET request to the success_url.
    // We can just redirect to the frontend payment summary since the actual webhook is verified by Stripe behind the scenes
    // or we can optionally trigger a verification. For UX, just redirecting to success is enough.
    return NextResponse.redirect(new URL("/payments?payment_status=success", req.url), 303);
}

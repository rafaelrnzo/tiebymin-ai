import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, feedback, resultId } = body;

    // For now, we'll just log the feedback to the console.
    // In a real application, you would save this to a database.
    console.log("Received feedback:", { rating, feedback, resultId });

    return NextResponse.json({ message: "Feedback received" }, { status: 200 });
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { message: "Error processing feedback" },
      { status: 500 }
    );
  }
}
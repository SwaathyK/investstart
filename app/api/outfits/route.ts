import { NextResponse } from "next/server";
import { outfits } from "@/data/avatar";

export async function GET() {
  return NextResponse.json({ outfits });
}

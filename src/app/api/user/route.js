import { connectDb } from "@/database/dbConnection";
import userModel from "@/database/models/userModel";


export async function GET(req) {
  await connectDb();

  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const user = await userModel.findOne({ email });

  if (user) return new Response(null, { status: 200 });
  return new Response(null, { status: 404 });
}

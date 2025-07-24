import db from "../../../db";
import { advocates } from "../../../db/schema";
import { or, ilike, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  if (search?.trim()) {
    const searchTerm = `%${search.toLowerCase()}%`;

    const data = await db
      .select()
      .from(advocates)
      .where(
        or(
          ilike(advocates.firstName, searchTerm),
          ilike(advocates.lastName, searchTerm),
          ilike(advocates.city, searchTerm),
          ilike(advocates.degree, searchTerm),
          // Search in specialties JSON array
          sql`lower(${advocates.specialties}::text) LIKE ${searchTerm}`,
          // Search in years of experience (convert to text)
          sql`${advocates.yearsOfExperience}::text LIKE ${`%${search}%`}`
        )
      );

    return Response.json({ data });
  } else {
    const data = await db.select().from(advocates);
    return Response.json({ data });
  }
}

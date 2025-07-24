import db from "../../../db";
import { advocates } from "../../../db/schema";
import { or, ilike, sql, count } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  // Ensure page is at least 1 and limit is reasonable
  const currentPage = Math.max(1, page);
  const pageSize = Math.min(Math.max(1, limit), 100); // Cap at 100 items per page
  const offset = (currentPage - 1) * pageSize;

  // Build the where condition
  const whereCondition = search?.trim()
    ? or(
        ilike(advocates.firstName, `%${search.toLowerCase()}%`),
        ilike(advocates.lastName, `%${search.toLowerCase()}%`),
        ilike(advocates.city, `%${search.toLowerCase()}%`),
        ilike(advocates.degree, `%${search.toLowerCase()}%`),
        // Search in specialties JSON array
        sql`lower(${
          advocates.specialties
        }::text) LIKE ${`%${search.toLowerCase()}%`}`,
        // Search in years of experience (convert to text)
        sql`${advocates.yearsOfExperience}::text LIKE ${`%${search}%`}`
      )
    : undefined;

  // Get total count and data
  const [totalResult, data] = await Promise.all([
    // Get total count
    whereCondition
      ? db.select({ count: count() }).from(advocates).where(whereCondition)
      : db.select({ count: count() }).from(advocates),

    // Get paginated data
    whereCondition
      ? db
          .select()
          .from(advocates)
          .where(whereCondition)
          .limit(pageSize)
          .offset(offset)
          .orderBy(advocates.id)
      : db
          .select()
          .from(advocates)
          .limit(pageSize)
          .offset(offset)
          .orderBy(advocates.id),
  ]);

  const totalCount = totalResult[0].count;
  const totalPages = Math.ceil(totalCount / pageSize);

  return Response.json({
    data,
    pagination: {
      page: currentPage,
      limit: pageSize,
      total: totalCount,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    },
  });
}

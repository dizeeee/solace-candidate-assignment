import db from "../../../../db";
import { advocates } from "../../../../db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const {
      firstName,
      lastName,
      city,
      degree,
      specialties,
      yearsOfExperience,
      phoneNumber,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !city ||
      !degree ||
      !Array.isArray(specialties) ||
      !yearsOfExperience ||
      !phoneNumber
    ) {
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate phone number (must be a number)
    const phone = Number(phoneNumber);
    if (isNaN(phone)) {
      return Response.json(
        { error: "Phone number must be a valid number" },
        { status: 400 }
      );
    }

    // Validate years of experience (must be a positive integer)
    const years = Number(yearsOfExperience);
    if (isNaN(years) || years < 0 || !Number.isInteger(years)) {
      return Response.json(
        { error: "Years of experience must be a positive integer" },
        { status: 400 }
      );
    }

    const newAdvocate = await db
      .insert(advocates)
      .values({
        firstName,
        lastName,
        city,
        degree,
        specialties,
        yearsOfExperience: years,
        phoneNumber: phone,
      })
      .returning();

    return Response.json({ data: newAdvocate[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating advocate:", error);
    return Response.json(
      { error: "Failed to create advocate" },
      { status: 500 }
    );
  }
}

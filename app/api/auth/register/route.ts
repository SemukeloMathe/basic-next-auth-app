import { connectDB } from "@/app/helpers/server-helpers";
import prisma from "@/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
  try {
    // What do we want to do inside the try block ?
    // 1. We want to get the data from the user, so name, email & password
    // 2. Store that data inside the database, so want to connect to the
    // database, store and disconnect from the db
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Invalid Data" }, { status: 422 }); // status code 422 is unprocessable data.
    }
    // 3. Generate hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // 4. Connect to the database
    await connectDB();
    // 5. Create the user in the database
    const user = await prisma.user.create({
      data: { email, name, hashedPassword },
    });
    //6. return created user
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    // 7. If error, log error and return response code 500
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  } finally {
    // 8. Disconnect from database.
    await prisma.$disconnect();
  }
};

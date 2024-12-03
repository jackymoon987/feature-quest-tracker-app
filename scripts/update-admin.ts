import { db } from "../db";
import { users } from "@db/schema";
import { eq } from "drizzle-orm";

async function updateUserToAdmin() {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({ isAdmin: true })
      .where(eq(users.username, "test@test.com"))
      .returning();

    if (updatedUser) {
      console.log("User updated successfully:", updatedUser.username);
    } else {
      console.log("User test@test.com not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }

  process.exit(0);
}

updateUserToAdmin();

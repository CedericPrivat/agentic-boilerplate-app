import { eq } from "drizzle-orm";

import { user } from "@/db/schema/auth";

import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository {
  async findById(id: string) {
    const result = await this.db.query.user.findFirst({
      where: eq(user.id, id),
    });
    return result;
  }

  async findByEmail(email: string) {
    const result = await this.db.query.user.findFirst({
      where: eq(user.email, email),
    });
    return result;
  }
}

export const userRepository = new UserRepository();

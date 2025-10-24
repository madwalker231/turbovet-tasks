import { UserRole } from "@turbovet-tasks/data-models";

export interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
  organizationId: string;
}

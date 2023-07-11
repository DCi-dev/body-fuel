import type { Session } from "next-auth";

// Mock session object
export const mockSession: Session = {
  user: {
    id: "test-user-id",
    name: "test-user-name",
    email: "test-user-email",
    image: "test-user-image",
  },
  expires: new Date().toISOString(),
};

import { beforeEach, describe, expect, it, vi } from "vitest";

const { requireRoleMock, findManyMock } = vi.hoisted(() => ({
  requireRoleMock: vi.fn(),
  findManyMock: vi.fn(),
}));

vi.mock("@/lib/serverAuth", () => ({
  requireRole: requireRoleMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    allowedUser: {
      findMany: findManyMock,
    },
  },
}));

import { GET } from "@/app/api/console/allowedUsers/route";
import { NextRequest } from "next/server";

describe("Console endpoints - allowed users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows a QIRVEX user to get all allowed users", async () => {
    const allowedUsers = [
      {
        id: "user-1",
        email: "volunteer@example.com",
        roles: [],
        region: null,
        createdBy: null,
      },
    ];

    requireRoleMock.mockResolvedValue({
      user: { userId: "admin-1" },
    });

    findManyMock.mockResolvedValue(allowedUsers);

    const request = new NextRequest(
      "http://localhost/api/console/allowedUsers",
    );

    const response = await GET(request);
    const body = await response.json();

    expect(requireRoleMock).toHaveBeenCalledWith("QIRVEX");
    expect(findManyMock).toHaveBeenCalledWith({
      include: {
        roles: true,
        region: true,
        createdBy: true,
      },
    });

    expect(response.status).toBe(200);
    expect(body).toEqual(allowedUsers);
  });

  it("returns 401 when the user is not authenticated", async () => {
    requireRoleMock.mockRejectedValue(
      Object.assign(new Error("Unauthorized"), {
        status: 401,
      }),
    );

    const request = new NextRequest(
      "http://localhost/api/console/allowedUsers",
    );

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(findManyMock).not.toHaveBeenCalled();
  });

  it("returns 403 when the user does not have the QIRVEX role", async () => {
    requireRoleMock.mockRejectedValue(
      Object.assign(new Error("Forbidden"), {
        status: 403,
      }),
    );

    const request = new NextRequest(
      "http://localhost/api/console/allowedUsers",
    );

    const response = await GET(request);

    expect(response.status).toBe(403);
    expect(findManyMock).not.toHaveBeenCalled();
  });
});

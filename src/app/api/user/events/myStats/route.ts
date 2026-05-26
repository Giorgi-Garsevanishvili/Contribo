import { FeedbackRequestStatus } from "@/generated/enums";
import { EventWhereInput } from "@/generated/models";
import { handleError } from "@/lib/errors/handleErrors";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/serverAuth";
import { NextRequest, NextResponse } from "next/server";

type EventStatus = "LIVE" | "ENDED" | "UPCOMING";

type EventResponse = {
  status: EventStatus;
  id: string;
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;
  rating: number | null;

  region: {
    name: string;
  } | null;

  createdBy: {
    name: string | null;
  } | null;

  updatedBy: {
    name: string | null;
  } | null;

  assignments: {
    user: {
      name: string | null;
      image: string | null;
    } | null;

    role: {
      name: string;
    } | null;
  }[];

  availabilities: {
    _count: {
      availabilityEntries: number;
    };

    availabilityEntries: {
      user: {
        name: string | null;
        image: string | null;
      };
    }[];

    role: {
      name: string;
    };

    totalSlots: number;
  }[];
};

type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type DashboardStats = {
  totalEvents: number;
  assignedEvents: number;
  attendedEvents: number;
  upcomingEvents: number;
  endedEvents: number;
  liveEvents: number;
  totalDurationHours: string;
  totalAvailableSlots: number;
};

type EventFeedbackType = {
  id: string;
  userId: string | null;
  updatedAt: Date | null;
  createdAt: Date;
  updatedById: string | null;
  rating: number | null;
  feedback: string | null;
  eventId: string;
  requestStatus: FeedbackRequestStatus;
  requestedAt: Date;
  respondedAt: Date | null;
  responded: boolean;
};

type ApiResponse = {
  data: EventResponse[];
  pagination: PaginationMeta;
  stats: DashboardStats;
  eventFeedbacks: EventFeedbackType[];
};

export const GET = async (req: NextRequest) => {
  try {
    const thisUser = await requireRole("REGULAR");

    const userId = thisUser.user.userId!;
    const regionId = thisUser.user.regionId;

    const { searchParams } = new URL(req.url);

    // ---------------------------------------
    // PAGINATION
    // ---------------------------------------

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));

    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "10")),
    );

    const skip = (page - 1) * limit;

    // ---------------------------------------
    // FILTERS
    // ---------------------------------------

    const assigneeFilter = searchParams.get("assignee");
    const searchQuery = searchParams.get("search");
    const fromDateFilter = searchParams.get("fromDate");
    const tillDateFilter = searchParams.get("tillDate");
    const statusFilter = searchParams.get("status");

    const now = new Date();

    // ---------------------------------------
    // BASE ACCESS FILTER
    // ---------------------------------------

    const baseWhereClause: EventWhereInput = {
      regionId,

      OR: [
        {
          assignments: {
            some: {
              userId,
            },
          },
        },

        {
          availabilities: {
            some: {
              availabilityEntries: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      ],
    };

    // ---------------------------------------
    // DYNAMIC FILTERS
    // ---------------------------------------

    const andFilters: EventWhereInput[] = [];

    // Assignee
    if (assigneeFilter) {
      andFilters.push({
        OR: [
          {
            assignments: {
              some: {
                userId: assigneeFilter,
              },
            },
          },

          {
            availabilities: {
              some: {
                availabilityEntries: {
                  some: {
                    userId: assigneeFilter,
                  },
                },
              },
            },
          },
        ],
      });
    }

    // Search
    if (searchQuery?.trim()) {
      andFilters.push({
        OR: [
          {
            name: {
              contains: searchQuery.trim(),
              mode: "insensitive",
            },
          },

          {
            description: {
              contains: searchQuery.trim(),
              mode: "insensitive",
            },
          },
        ],
      });
    }

    // From Date
    if (fromDateFilter) {
      andFilters.push({
        startTime: {
          gte: new Date(fromDateFilter),
        },
      });
    }

    // Till Date
    if (tillDateFilter) {
      andFilters.push({
        endTime: {
          lte: new Date(tillDateFilter),
        },
      });
    }

    // Status
    if (statusFilter === "LIVE") {
      andFilters.push({
        startTime: {
          lte: now,
        },

        endTime: {
          gte: now,
        },
      });
    }

    if (statusFilter === "ENDED") {
      andFilters.push({
        endTime: {
          lt: now,
        },
      });
    }

    if (statusFilter === "UPCOMING") {
      andFilters.push({
        startTime: {
          gt: now,
        },
      });
    }

    if (statusFilter === "FUTURE") {
      const future = new Date(now);

      future.setDate(future.getDate() + 7);

      andFilters.push({
        startTime: {
          gte: now,
          lte: future,
        },
      });
    }

    // ---------------------------------------
    // FINAL WHERE CLAUSE
    // ---------------------------------------

    const whereClause: EventWhereInput = {
      ...baseWhereClause,

      ...(andFilters.length > 0 && {
        AND: andFilters,
      }),
    };

    // ---------------------------------------
    // DATABASE QUERIES
    // ---------------------------------------

    const [totalCount, events, statsEvents, eventFeedbacks] =
      await prisma.$transaction([
        prisma.event.count({
          where: whereClause,
        }),

        prisma.event.findMany({
          where: whereClause,

          select: {
            id: true,
            name: true,
            location: true,
            startTime: true,
            endTime: true,
            rating: true,

            region: {
              select: {
                name: true,
              },
            },

            createdBy: {
              select: {
                name: true,
              },
            },

            updatedBy: {
              select: {
                name: true,
              },
            },

            assignments: {
              select: {
                role: {
                  select: {
                    name: true,
                  },
                },

                user: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            },

            availabilities: {
              select: {
                role: {
                  select: {
                    name: true,
                  },
                },

                totalSlots: true,

                availabilityEntries: {
                  select: {
                    user: {
                      select: {
                        name: true,
                        image: true,
                      },
                    },
                  },
                },

                _count: {
                  select: {
                    availabilityEntries: {
                      where: {
                        status: "ACTIVE",
                      },
                    },
                  },
                },
              },
            },
          },

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: limit,
        }),

        prisma.event.findMany({
          where: baseWhereClause,

          select: {
            startTime: true,
            endTime: true,

            assignments: {
              where: {
                userId,
              },

              select: {
                id: true,
              },
            },

            availabilities: {
              select: {
                totalSlots: true,

                _count: {
                  select: {
                    availabilityEntries: {
                      where: {
                        status: "ACTIVE",
                      },
                    },
                  },
                },

                availabilityEntries: {
                  where: {
                    userId,
                  },

                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        }),

        prisma.eventFeedback.findMany({
          where: { userId: thisUser.user.userId, requestStatus: "PENDING" },
        }),
      ]);

    // ---------------------------------------
    // EVENT STATUS
    // ---------------------------------------

    const dataWithStatus: EventResponse[] = events.map((event) => {
      let status: EventStatus;

      if (now < event.startTime) {
        status = "UPCOMING";
      } else if (now >= event.startTime && now <= event.endTime) {
        status = "LIVE";
      } else {
        status = "ENDED";
      }

      return {
        ...event,
        status,
      };
    });

    // ---------------------------------------
    // STATS
    // ---------------------------------------

    const assignedEvents = statsEvents.filter(
      (event) => event.assignments.length > 0,
    ).length;

    const attendedEvents = statsEvents.filter((event) =>
      event.availabilities.some(
        (availability) => availability.availabilityEntries.length > 0,
      ),
    ).length;

    const upcomingEvents = statsEvents.filter(
      (event) => event.startTime > now,
    ).length;

    const endedEvents = statsEvents.filter(
      (event) => event.endTime < now,
    ).length;

    const liveEvents = statsEvents.filter(
      (event) => event.startTime <= now && event.endTime >= now,
    ).length;

    const totalDurationMs = statsEvents.reduce((sum, event) => {
      return sum + (event.endTime.getTime() - event.startTime.getTime());
    }, 0);

    const totalAvailableSlots = statsEvents.reduce((total, event) => {
      const availableSlots = event.availabilities.reduce(
        (slotTotal, availability) => {
          const activeEntries = availability._count.availabilityEntries;

          return slotTotal + (availability.totalSlots - activeEntries);
        },
        0,
      );

      return total + availableSlots;
    }, 0);

    // ---------------------------------------
    // PAGINATION
    // ---------------------------------------

    const totalPages = Math.ceil(totalCount / limit);

    const pagination: PaginationMeta = {
      currentPage: page,
      totalPages,
      totalCount,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    // ---------------------------------------
    // RESPONSE
    // ---------------------------------------

    const response: ApiResponse = {
      data: dataWithStatus,

      pagination,

      stats: {
        totalEvents: statsEvents.length,
        assignedEvents,
        attendedEvents,
        upcomingEvents,
        endedEvents,
        liveEvents,

        totalDurationHours: (totalDurationMs / (1000 * 60 * 60)).toFixed(1),

        totalAvailableSlots,
      },

      eventFeedbacks,
    };

    return NextResponse.json(
      {
        records: response,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    const { message, status } = handleError(error);

    return NextResponse.json(
      {
        message,
      },
      {
        status,
      },
    );
  }
};

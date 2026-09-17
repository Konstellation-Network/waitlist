import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface QueueRow {
  id: string;
  email: string;
  priorityTier: number;
  status: string;
  intent: string | null;
  chainsUsed: string[];
  firstThing: string | null;
  source: string | null;
  country: string | null;
  emailVerifiedAt: Date | null;
  surveyCompletedAt: Date | null;
  createdAt: Date;
}

export interface QueueResponse {
  total: number;
  limit: number;
  offset: number;
  tiers: Record<'0' | '1' | '2' | '3', number>;
  intents: Record<string, number>;
  queue: QueueRow[];
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async queue(limit: number, offset: number): Promise<QueueResponse> {
    const [queue, tierRows, intentRows, total] = await Promise.all([
      this.prisma.signup.findMany({
        select: {
          id: true,
          email: true,
          priorityTier: true,
          status: true,
          intent: true,
          chainsUsed: true,
          firstThing: true,
          source: true,
          country: true,
          emailVerifiedAt: true,
          surveyCompletedAt: true,
          createdAt: true,
        },
        orderBy: [{ priorityTier: 'desc' }, { createdAt: 'asc' }],
        take: limit,
        skip: offset,
      }),
      this.prisma.signup.groupBy({ by: ['priorityTier'], _count: true }),
      this.prisma.signup.groupBy({ by: ['intent'], _count: true }),
      this.prisma.signup.count(),
    ]);

    const tiers: QueueResponse['tiers'] = { '0': 0, '1': 0, '2': 0, '3': 0 };
    for (const r of tierRows) {
      const key = String(r.priorityTier) as keyof QueueResponse['tiers'];
      if (key in tiers) tiers[key] = r._count;
    }

    const intents: Record<string, number> = {};
    for (const r of intentRows) {
      intents[r.intent ?? 'none'] = r._count;
    }

    return { total, limit, offset, tiers, intents, queue };
  }
}

// __mocks__/prisma.ts
import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended'

export const prisma = mockDeep<PrismaClient>()
export type PrismaMock = DeepMockProxy<PrismaClient>

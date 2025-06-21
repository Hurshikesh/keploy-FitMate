import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { prisma } from '../lib/prisma.js'

const history = new OpenAPIHono()

const recommendationSchema = z.object({
  id: z.number(),
  meals: z.array(
    z.object({
      name: z.string(),
      calories: z.number()
    })
  ),
  workouts: z.array(z.string()),
  proteinGrams: z.number(),
  fatGrams: z.number(),
  carbGrams: z.number(),
  analysisId: z.number()
})

const analysisSchema = z.object({
  id: z.number(),
  age: z.number(),
  weight: z.number(),
  height: z.number(),
  bodyFat: z.number(),
  gender: z.string(),
  activityLevel: z.string(),
  goal: z.string(),
  bmi: z.number(),
  bmr: z.number(),
  tdee: z.number(),
  recommendedCalories: z.number(),
  createdAt: z.string(),
  recommendation: recommendationSchema.nullable().optional()
})

const getHistoryRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Get all analysis entries with recommendation',
      content: {
        'application/json': {
          schema: z.array(analysisSchema)
        }
      }
    }
  }
})

history.openapi(getHistoryRoute, async (c) => {
  const all = await prisma.analysis.findMany({
    include: { recommendation: true },
    orderBy: { createdAt: 'desc' }
  })

  const formatted = all.map((entry) => ({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
    recommendation: entry.recommendation
      ? {
          ...entry.recommendation,
          meals: entry.recommendation.meals as { name: string; calories: number }[],
          workouts: entry.recommendation.workouts as string[]
        }
      : null
  }))

  return c.json(formatted)
})

export default history


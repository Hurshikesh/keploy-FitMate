import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { prisma } from '../lib/prisma.js'

const recalculate = new OpenAPIHono()

// Schema for request body
export const RecalculateInput = z.object({
  analysisId: z.number(),
  weight: z.number(),
  bodyFat: z.number()
})

// Schema for response (simplified, but matches what's returned)
const AnalysisResponse = z.object({
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
  createdAt: z.string()
})

const recalculateRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RecalculateInput
        }
      }
    }
  },
  responses: {
    200: {
      description: 'New recalculated analysis entry',
      content: {
        'application/json': {
          schema: AnalysisResponse
        }
      }
    },
    404: {
      description: 'Previous analysis not found'
    }
  }
})

recalculate.openapi(recalculateRoute, async (c) => {
  const body = await c.req.json()
  const { analysisId, weight, bodyFat } = body

  const prev = await prisma.analysis.findUnique({ where: { id: analysisId } })
  if (!prev) return c.json({ error: 'Previous analysis not found' }, 404)

  const bmi = +(weight / ((prev.height / 100) ** 2)).toFixed(2)
  const bmr = prev.gender === 'male'
    ? 10 * weight + 6.25 * prev.height - 5 * prev.age + 5
    : 10 * weight + 6.25 * prev.height - 5 * prev.age - 161

  const activityMap: Record<string, number> = {
    low: 1.2,
    moderate: 1.55,
    high: 1.9
  }

  const multiplier = activityMap[prev.activityLevel] || 1.2
  const tdee = Math.round(bmr * multiplier)

  const recommendedCalories =
    prev.goal === 'lose' ? tdee - 300
    : prev.goal === 'gain' ? tdee + 300
    : tdee

  const newAnalysis = await prisma.analysis.create({
    data: {
      age: prev.age,
      weight,
      height: prev.height,
      bodyFat,
      gender: prev.gender,
      activityLevel: prev.activityLevel,
      goal: prev.goal,
      bmi,
      bmr,
      tdee,
      recommendedCalories
    }
  })

  return c.json({
    ...newAnalysis,
    createdAt: newAnalysis.createdAt.toISOString()
  })
})

export default recalculate

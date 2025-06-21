import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'

import analyze from './routes/analyze'
import deleteAnalysis from './routes/delete-analysis'
import recalculate from './routes/recalculate'
import recommendation from './routes/recommendation'
import history from './routes/history'
import summary from './routes/summary'

const app = new OpenAPIHono()

// ✅ Enable CORS for all routes
app.use('*', cors())

// Mount routes
app.route('/api/analyze', analyze)
app.route('/api/delete', deleteAnalysis)
app.route('/api/recalculate', recalculate)
app.route('/api/recommendation', recommendation)
app.route('/api/history', history)
app.route('/api/summary', summary)

// OpenAPI Docs
app.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'FitMate API',
    version: '1.0.0',
  }
})

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/docs' }))

console.log('[INFO] Swagger at http://localhost:3000/swagger')
console.log('[INFO] API Docs at http://localhost:3000/docs')

serve(app)

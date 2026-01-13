import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '@/swagger';
import productRoutes from '@/routes/productRoutes';
import userRoutes from '@/routes/userRoutes';

/**
 * Initialize Express App
 * Load environment variables terlebih dahulu (CRITICAL)
 */
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Swagger API Documentation
 * Accessible at http://localhost:3000/api-docs
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * API Routes
 */
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API Inventory System Ready');
});

/**
 * Start Server
 */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('\n🚀 Server berjalan di http://localhost:' + port);
  console.log('📚 API Documentation: http://localhost:' + port + '/api-docs\n');
});

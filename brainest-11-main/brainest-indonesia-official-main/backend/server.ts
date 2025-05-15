import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import commentRoutes from './routes/commentRoutes';
import irtSettingsRoutes from './routes/admin/irtSettings';
import questionsRoutes from './routes/admin/questions';
import tryoutRoutes from './routes/admin/tryout';
import scoreboardRoutes from './routes/admin/scoreboard';
import parameterRoutes from './routes/admin/parameter';

const app: Application = express();
app.use(express.json());
app.use(cors());

connectDB();

// Routes
app.get('/', (_req, res) => {
    res.send({ message: 'Welcome to Brainest Indonesia Server!' });
  });

app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);

app.use('/api/admin/irt-settings', irtSettingsRoutes);
app.use('/api/admin/questions', questionsRoutes);
app.use('/api/admin/parameter', parameterRoutes);
app.use('/api/admin/scoreboard', scoreboardRoutes);

app.use('/api/tryout', tryoutRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
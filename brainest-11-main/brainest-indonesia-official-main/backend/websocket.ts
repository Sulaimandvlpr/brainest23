import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from './middleware/auth';

interface LiveTryoutData {
  id: string;
  participants: number;
  leaderboard: Array<{
    name: string;
    score: number;
    isUser: boolean;
  }>;
}

export function initializeWebSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware untuk autentikasi WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      const decoded = await verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Menyimpan data tryout live
  const liveTryouts = new Map<string, LiveTryoutData>();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join tryout room
    socket.on('join_tryout', (tryoutId: string) => {
      socket.join(`tryout_${tryoutId}`);
      
      // Inisialisasi data tryout jika belum ada
      if (!liveTryouts.has(tryoutId)) {
        liveTryouts.set(tryoutId, {
          id: tryoutId,
          participants: 0,
          leaderboard: []
        });
      }

      // Update jumlah peserta
      const tryoutData = liveTryouts.get(tryoutId)!;
      tryoutData.participants++;
      
      // Broadcast update ke semua client dalam room
      io.to(`tryout_${tryoutId}`).emit('tryout_update', tryoutData);
    });

    // Update leaderboard
    socket.on('update_score', (data: { tryoutId: string; score: number }) => {
      const tryoutData = liveTryouts.get(data.tryoutId);
      if (tryoutData) {
        const userIndex = tryoutData.leaderboard.findIndex(
          entry => entry.name === socket.data.user.name
        );

        if (userIndex !== -1) {
          tryoutData.leaderboard[userIndex].score = data.score;
        } else {
          tryoutData.leaderboard.push({
            name: socket.data.user.name,
            score: data.score,
            isUser: true
          });
        }

        // Sort leaderboard
        tryoutData.leaderboard.sort((a, b) => b.score - a.score);
        
        // Broadcast update
        io.to(`tryout_${data.tryoutId}`).emit('tryout_update', tryoutData);
      }
    });

    // Leave tryout room
    socket.on('leave_tryout', (tryoutId: string) => {
      socket.leave(`tryout_${tryoutId}`);
      
      const tryoutData = liveTryouts.get(tryoutId);
      if (tryoutData) {
        tryoutData.participants = Math.max(0, tryoutData.participants - 1);
        io.to(`tryout_${tryoutId}`).emit('tryout_update', tryoutData);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
} 
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // Note: server needs socket.io package

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all for dev
    },
    namespace: 'appointments',
})
export class AppointmentsGateway {
    @WebSocketServer()
    server: Server;

    // In-memory lock store (Move to Redis for production)
    private locks: Map<string, { userId: string; expiresAt: number }> = new Map();

    @SubscribeMessage('join_date')
    handleJoinDate(
        @MessageBody() data: { date: string },
        @ConnectedSocket() client: Socket,
    ) {
        const roomName = `date:${data.date}`;
        client.join(roomName);
        console.log(`Client ${client.id} joined ${roomName}`);

        // Return current active locks for this date
        // Logic: Filter this.locks by date key...
        return { event: 'current_locks', data: {} };
    }

    @SubscribeMessage('request_lock')
    handleRequestLock(
        @MessageBody() data: { date: string; time: string; dentistId: string },
        @ConnectedSocket() client: Socket,
    ) {
        const lockKey = `${data.date}_${data.dentistId}_${data.time}`;

        if (this.locks.has(lockKey)) {
            // Already locked
            return { event: 'lock_fail', error: 'Slot already locked' };
        }

        // Create lock
        this.locks.set(lockKey, { userId: client.id, expiresAt: Date.now() + 5000 * 60 });

        // Broadcast to room that this slot is locked
        client.to(`date:${data.date}`).emit('slot_locked', {
            lockKey,
            lockerId: client.id
        });

        return { event: 'lock_success', data: { lockKey } };
    }

    @SubscribeMessage('release_lock')
    handleReleaseLock(@MessageBody() data: { lockKey: string; date: string }, @ConnectedSocket() client: Socket) {
        if (this.locks.has(data.lockKey)) {
            this.locks.delete(data.lockKey);
            client.to(`date:${data.date}`).emit('slot_released', { lockKey: data.lockKey });
        }
    }
}

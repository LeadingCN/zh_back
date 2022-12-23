import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
export declare class SocketGateway {
    private readonly socketService;
    constructor(socketService: SocketService);
    create(createSocketDto: CreateSocketDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(updateSocketDto: UpdateSocketDto): string;
    remove(id: number): string;
}

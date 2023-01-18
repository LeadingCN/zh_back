import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
export declare class SocketService {
    create(createSocketDto: CreateSocketDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSocketDto: UpdateSocketDto): string;
    remove(id: number): string;
}

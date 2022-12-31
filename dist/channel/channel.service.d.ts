import { UserToken } from 'src/admin/dto/admin.dto';
import { MysqlService } from 'src/utils/mysql.service';
import { UtilsService } from 'src/utils/utils.service';
import { CreateChannelDto } from './dto/create-channel.dto';
export declare class ChannelService {
    private readonly sql;
    private readonly utils;
    constructor(sql: MysqlService, utils: UtilsService);
    create(createChannelDto: CreateChannelDto): void;
    private zh_table;
    findAll(params: any, user: UserToken): Promise<{
        total: any;
        list: any;
    }>;
    upchannel(body: any): Promise<string>;
}

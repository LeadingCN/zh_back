import { ChannelService } from './channel.service';
export declare class ChannelController {
    private readonly channelService;
    constructor(channelService: ChannelService);
    upchannel(body: any): Promise<string>;
    findAll(query: any, req: any): Promise<{
        total: any;
        list: any;
    }>;
}

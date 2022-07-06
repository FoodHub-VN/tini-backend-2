import { HttpService } from '@nestjs/axios';
import { GetTokenDto } from './dto/get-token.dto';
export declare class AuthService {
    private readonly httpService;
    constructor(httpService: HttpService);
    sign(body: GetTokenDto): Promise<any>;
}

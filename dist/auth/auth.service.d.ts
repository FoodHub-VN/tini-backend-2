import { HttpService } from '@nestjs/axios';
import { GetTokenDto } from './dto/get-token.dto';
import { AuthUserInterface } from './interface/auth-user.interface';
export declare class AuthService {
    private readonly httpService;
    private client_key;
    private client_secret;
    constructor(httpService: HttpService);
    sign(body: any): Promise<{
        signature: any;
        timestamp: number;
    }>;
    exchangeToAccessToken(body: GetTokenDto): Promise<any>;
    validateToken(token: string): Promise<AuthUserInterface>;
}

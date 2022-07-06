import { HttpService } from '@nestjs/axios';
export declare class AuthService {
    private readonly httpService;
    constructor(httpService: HttpService);
    sign(body: any): void;
}

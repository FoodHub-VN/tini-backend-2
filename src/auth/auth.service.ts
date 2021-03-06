import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GetTokenDto } from './dto/get-token.dto';
import { bind } from 'lodash';
import { AuthUserInterface } from './interface/auth-user.interface';

@Injectable()
export class AuthService {
  private client_key: string;
  private client_secret: string;
  constructor(
    private readonly httpService: HttpService
  ) {
    this.client_key = "cTYxTIahEP0vFXYMXuc4qjpQdTLd4w7m";
    this.client_secret = "VADyWlmfsws:HRzIZsFear@WUyitMs:P1si+MzVSbVQgBnuyNemaJyp3GJlcFb4p";
  }

  async sign(body: any){
    const crypto = require("crypto");
    const timestamp = Date.now();

    function base64URLEncode(data) {
      const base64 = Buffer.from(data, "utf8").toString("base64");
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }

    let sign = (secret, payload)=> {
      const signature = crypto
        .createHmac("sha256", this.client_secret)
        .update(payload)
        .digest("hex");
      return signature;
    }

    const payload = timestamp + '.' + this.client_key + '.' + JSON.stringify(body);
    // console.log("payload: ", payload);
    const encodedPayload = base64URLEncode(payload);
    // console.log("encoded_payload: ", encodedPayload);
    const signature = sign(this.client_secret, encodedPayload);
    // console.log("signature: ", signature);
    return { signature, timestamp };

// payload:  1620621619569.RLCKb7Ae9kx4DXtXsCWjnDXtggFnM43W.{"id":123}
// encoded_payload:  MTYyMDYyMTYxOTU2OS5STENLYjdBZTlreDREWHRYc0NXam5EWHRnZ0ZuTTQzVy57ImlkIjoxMjN9
// signature:  8ebd092b9df2cf90e8ccbcab2ba87ee14f2abb25eb8f18b4d7286d42adcd45c2


  }

  async exchangeToAccessToken(body: GetTokenDto){
    let { signature, timestamp } = await this.sign(body);
    let url = "https://api.tiki.vn/tiniapp-open-api/oauth/auth/token";
    return this.httpService.post(url, {
      ...body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Tiniapp-Client-Id": this.client_key,
        "X-Tiniapp-Signature": signature,
        "X-Tiniapp-Timestamp": timestamp
      }
    }).toPromise().then((r)=>{
      return r.data;
    }).catch(e=>{
      throw new BadRequestException("Auth code wrong!");
    })
  }
  async validateToken(token: string): Promise<AuthUserInterface>{
    //validate accessToken from tini
    let obj = {
      access_token: token.split("Bearer ")[1]
    }
    let { signature, timestamp } = await this.sign(obj);
    let url = "https://api.tiki.vn/tiniapp-open-api/oauth/me";
    return this.httpService.post(url, obj, {
      headers: {
        "Content-Type": "application/json",
        "X-Tiniapp-Client-Id": this.client_key,
        "X-Tiniapp-Signature": signature,
        "X-Tiniapp-Timestamp": timestamp
      }
    }).toPromise().then((r)=>{
      return r.data.data as AuthUserInterface;
    }).catch(e=>{
      throw new UnauthorizedException("L???i x??c th???c!");
    })
  }

}

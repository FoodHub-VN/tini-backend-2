import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GetTokenDto } from './dto/get-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService
  ) {
  }

  async sign(body: GetTokenDto){
    const crypto = require("crypto");

    const client_key = "LV4EkhlTiHL7dIqfxaDrVHMEzkvElxFi";
    const client_secret = "zgnh0TK_XyH@:0NS5TQ90nlC:onqTeXtGWlILuiV~dO~Q6mnqImzHhvaZ_wgbCCm";

    const timestamp = Date.now();

    function base64URLEncode(data) {
      const base64 = Buffer.from(data, "utf8").toString("base64");
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }

    function sign(secret, payload) {
      const signature = crypto
        .createHmac("sha256", client_secret)
        .update(payload)
        .digest("hex");
      return signature;
    }

    const payload = timestamp + '.' + client_key + '.' + JSON.stringify(body);
    console.log("payload: ", payload);
    const encodedPayload = base64URLEncode(payload);
    console.log("encoded_payload: ", encodedPayload);
    const signature = sign(client_secret, encodedPayload);
    console.log("signature: ", signature);
    let url = "https://api.tiki.vn/tiniapp-open-api/oauth/auth/token";
    return this.httpService.post(url, {
      ...body
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-Tiniapp-Client-Id": client_key,
        "X-Tiniapp-Signature": signature,
        "X-Tiniapp-Timestamp": timestamp
      }
    }).toPromise().then((r)=>{
      return r.data;
    }).catch(e=>{
      throw new BadRequestException("Auth code wrong!");
    })
// payload:  1620621619569.RLCKb7Ae9kx4DXtXsCWjnDXtggFnM43W.{"id":123}
// encoded_payload:  MTYyMDYyMTYxOTU2OS5STENLYjdBZTlreDREWHRYc0NXam5EWHRnZ0ZuTTQzVy57ImlkIjoxMjN9
// signature:  8ebd092b9df2cf90e8ccbcab2ba87ee14f2abb25eb8f18b4d7286d42adcd45c2


  }

}

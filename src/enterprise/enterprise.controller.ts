import { Body, ConflictException, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { EnterpriseService } from "./enterprise.service";
import { map, mergeMap, Observable } from "rxjs";
import { Response } from "express";
import { EnterpriseRegisterDto } from "./dto/enterprise-register.dto";

@Controller({path: 'enterprise'})
export class EnterpriseController {
  constructor(private enterpriseService: EnterpriseService) {
  }
  @Post('/register')
  register(@Body() data: EnterpriseRegisterDto, @Res() res: Response) {
    const {username, email} = data;
    return this.enterpriseService.existEnterpriseByName(username).pipe(
      mergeMap(b => {
          if (b) {
            throw new ConflictException(`Enterprise ${username} already exists!`);
          } else {
            return this.enterpriseService.existEnterpriseByMail(email).pipe(
              mergeMap((isEmailExist) => {
                if (isEmailExist) {
                  throw  new ConflictException(`Email: ${email} is exist!`);
                } else {
                  return this.enterpriseService.register(data)
                    .pipe(
                      map(user => res
                        .status(HttpStatus.OK)
                        .send({
                          username: username,
                          email: email
                        })
                      )
                    );
                }
              })
            );
          }

        }
      )
    );
  }
}

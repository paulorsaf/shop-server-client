import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class JwtStrategy implements CanActivate {

    constructor(private authorizationService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers.authorization;

        if (!authorization){
            throw new UnauthorizedException();
        }

        return this.authorizationService.findByToken(authorization).then(user => {
            request.user = user;
            return true;
        }).catch(() => {
            throw new UnauthorizedException();
        });
    }

}
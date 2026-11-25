import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;
        const [type, token] = authHeader?.split(' ') ?? [];
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Token manquant');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);
            if (payload.role === 'admin') {
                return true;
            }
            else if (!roles.includes(payload.role)) {
                throw new UnauthorizedException('Action not allawed');
            }

            request['payload'] = await this.userService.findOne(payload.sub);
        } catch (err) {
            throw new UnauthorizedException('Token invalide ou expiré');
        }

        return true;
    }
}

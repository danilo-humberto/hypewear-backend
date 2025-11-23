import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { ExecutionContext } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (info && info.name === "TokenExpiredError") {
      throw new UnauthorizedException(`Token expirado!`);
    }

    // outros erros da strategy (token inválido, etc.)
    if (err) {
      throw err;
    }

    // sem usuário -> credenciais inválidas
    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    // tudo ok -> retorne o usuário que preencherá req.user
    return user;
  }
}

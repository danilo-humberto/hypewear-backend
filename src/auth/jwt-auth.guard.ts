import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { ExecutionContext } from "@nestjs/common";

type JwtAuthUser = {
  id: string;
  email: string;
  role?: string;
};

type AuthInfo = {
  name?: string;
};

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest<TUser = JwtAuthUser>(
    err: unknown,
    user: TUser | false | null,
    info: AuthInfo | undefined,
    _context: ExecutionContext
  ): TUser {
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

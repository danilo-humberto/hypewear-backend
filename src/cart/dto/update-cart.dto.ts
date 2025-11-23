import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class UpdateCartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  quantity?: number;
}

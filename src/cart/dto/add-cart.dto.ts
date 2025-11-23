import { IsInt, IsNotEmpty, IsPositive, IsString, Min } from "class-validator";

export class AddCartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}

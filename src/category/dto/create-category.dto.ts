import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da nova categoria de produto.',
    example: 'Eletrônicos',
    type: String,
})
  @IsString()
  @IsNotEmpty()
  name: string;
}
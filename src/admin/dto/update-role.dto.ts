import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  role!: Role;
}

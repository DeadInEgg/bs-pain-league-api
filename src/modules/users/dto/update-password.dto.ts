import { SameValueThan } from '../../../decorators/SameValueThan';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'OldPassword123' })
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @ApiProperty({ example: 'NewPassword123' })
  newPassword: string;

  @SameValueThan(UpdatePasswordDto, (u) => u.newPassword)
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @ApiProperty({ example: 'NewPassword123' })
  confirmNewPassword: string;
}

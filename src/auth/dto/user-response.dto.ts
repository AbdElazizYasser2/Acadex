import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  @Transform(({ value }: { value: string | null }) =>
    value === null ? undefined : value,
  )
  phone: string | null;

  @Transform(({ value }: { value: string | null }) =>
    value === null ? undefined : value,
  )
  avatar: string | null;

  createdAt: Date;

  @Exclude()
  status: string;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  lastLoginAt: Date | null;

  @Exclude()
  emailVerifiedAt: Date | null;

  @Expose()
  get isEmailVerified(): boolean {
    return this.emailVerifiedAt !== null;
  }

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

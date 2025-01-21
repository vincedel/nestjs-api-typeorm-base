import { RoleEnum } from '../../common/enums/role.enum';

export type UserPayloadDto = {
  userId: string;
  username: string;
  email: string;
  role: RoleEnum;
};

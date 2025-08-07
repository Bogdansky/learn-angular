import { Gender } from './gender.enum';
import { Address } from './address.interface';
import { EmploymentRecord } from './employment-record.interface';

export interface UserProfile {
  name: string;
  surname: string;
  middleName?: string | null;
  dateOfBirth: Date;
  gender?: Gender | null;
  addresses: Address[];
  employmentHistory: EmploymentRecord[];
}

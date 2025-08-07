import { UserProfile, Gender } from "../shared/models";

export const defaultUserProfile: UserProfile = {
      name: 'John',
      surname: 'Doe',
      middleName: 'Michael',
      dateOfBirth: new Date('1990-05-15'),
      gender: Gender.MALE,
      addresses: [
        {
          country: 'BE',
          region: 'California',
          city: 'San Francisco',
          street: 'Market Street',
          building: '123',
          apartment: '4B'
        },
        {
          country: 'GR',
          region: 'England',
          city: 'London',
          street: 'Baker Street',
          building: '221',
          apartment: 'B'
        }
      ],
      employmentHistory: [
        {
          employer: 'Tech Corp Inc.',
          dateOfStart: new Date('2020-01-15'),
          dateOfEnd: undefined,
          isStillEmployed: true
        },
        {
          employer: 'Previous Company Ltd.',
          dateOfStart: new Date('2018-03-01'),
          dateOfEnd: new Date('2019-12-31'),
          isStillEmployed: false
        }
      ]
    };
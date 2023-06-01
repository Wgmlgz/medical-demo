export interface Patient {
  first_name: string;
  last_name: string;
  father_name: string;
  sex: string;
  birth_date: Date;
  insurance: string;
  country: string;
  city: string;
  street: string;
  building: string;
}

export const patients_example: Patient[] = [
  {
    first_name: 'Peter',
    last_name: 'Susser',
    father_name: 'Abobovich',
    sex: 'male',
    birth_date: new Date(),
    insurance: 'test',
    country: 'Russia ',
    city: 'Saint Petersburg',
    street: 'Nevsky Avenue',
    building: '114',
  },
  {
    first_name: 'Amogus',
    last_name: 'Test',
    father_name: 'Ivanovna',
    sex: 'female',
    birth_date: new Date(),
    insurance: 'test',
    country: 'Russia',
    city: 'Moscow',
    street: 'Tverskaya',
    building: '15',
  },
];
export const makeId = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

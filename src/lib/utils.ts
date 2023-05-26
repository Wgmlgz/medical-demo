export interface Patient {
  first_name: string;
  last_name: string;
  father_name: string;
  sex: string;
}

export const patients_example: Patient[] = [
  {
    first_name: 'sus',
    last_name: 'susser',
    father_name: 'abobovich',
    sex: 'yeees'
  },
  {
    first_name: 'aaaa',
    last_name: 'susser',
    father_name: 'abobovich',
    sex: 'no'
  }
];
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
  url: string;
}

export const patients_example: Patient[] = [
  {
    first_name: 'DICOM',
    last_name: 'CBCT.zip',
    father_name: '',
    sex: '',
    birth_date: new Date(),
    insurance: '',
    country: '',
    city: '',
    street: '',
    building: '',
    url: './DICOM/CBCT.zip'
  },
  {
    first_name: 'DICOM',
    last_name: 'Head_anon.zip',
    father_name: '',
    sex: '',
    birth_date: new Date(),
    insurance: '',
    country: '',
    city: '',
    street: '',
    building: '',
    url: './DICOM/Head_anon.zip'
  },
  {
    first_name: 'DICOM',
    last_name: 'Petrov.zip',
    father_name: '',
    sex: '',
    birth_date: new Date(),
    insurance: '',
    country: '',
    city: '',
    street: '',
    building: '',
    url: './DICOM/Petrov.zip'
  },
  {
    first_name: 'DICOM',
    last_name: 'phantom.dcm.zip',
    father_name: '',
    sex: '',
    birth_date: new Date(),
    insurance: '',
    country: '',
    city: '',
    street: '',
    building: '',
    url: './DICOM/phantom.dcm.zip'
  },
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
    url: './ct.dcm'
  }
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

export interface TestCentre {
  testcentre: string;
  opening: Date;
  closing?: Date;
  owner: string;
  createdDT: Date;
  location: Address;
  pathlab?: string;
  node: string;
  schema: string;
}

export interface Address {
  name?: string;
  addressline1?: string;
  addressline2?: string;
  addressline3?: string;
  addressline4?: string;
  addressline5?: string;
  postcode: string;
  lat?: number;
  lng?: number;
}

export interface PathLabs {
  lab: string;
  organisation: string;
  npexCode: string;
  createdDT: Date;
  namedContact: string;
}

export interface orgacknowledgements {
  id: number;
  barcode_value: string;
  username: string;
  displayname: string;
  organisation: string;
  createdDT: Date;
  nhsnumber?: string;
}

export interface staffarea {
  id: number;
  nhsnumber: string;
  username?: string;
  organisation: string;
  createdDT?: Date;
  updatedDT?: Date;
  areaid: number;
  parent?: string;
  area?: string;
}

export interface orgstructures {
  id: number;
  organisation: string;
  createdDT: Date;
  updatedDT: Date;
  parent: string;
  area: string;
}

export interface Pathway {
  test_pathway: string;
  createdDT: Date;
  config_id: string;
  in_use: string;
  step_count: number;
  steps: PathwayStep[];
  owner: string;
}

export interface PathwayStep {
  type: string;
  order: number;
  options?: Options[];
}

export interface ComponentTypes {
  type: string;
  createdDT?: Date;
  optionlist?: any;
}

export interface Options {
  key: string;
  value: any;
}

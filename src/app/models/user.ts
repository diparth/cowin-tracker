export class User {
  public appointments: Appointment[];
  public beneficiary_reference_id: string;
  public birth_year: string;
  public comorbidity_ind: string;
  public dose1_date: string;
  public dose2_date: string;
  public gender: string;
  public mobile_number: string;
  public name: string;
  public photo_id_number: string;
  public photo_id_type: string;
  public vaccination_status: string;
  public vaccine: string;

  constructor(data: any) {
    Object.keys(data).forEach(key => {
      this[key] = data[key];
    });
  }
}

export interface Appointment {
  appointment_id: string;
  block_name: string;
  center_id: number;
  date: string;
  district_name: string;
  dose: number;
  from: string;
  name: string;
  session_id: string;
  slot: string;
  state_name: string;
  to: string;
}

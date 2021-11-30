export interface OperatingHours {

  OperatingHoursId: string;
  CompanyId: string;
  DayOfTheWeek: string;
  DayNo: number;
  OperatingStatus: string;
  StartTime: string;
  FinishTime: string;
  CreateUserId: string;
  ModifyDate?: string;
  CreateDate?: string;
  ModifyUserId: string;
  StatusId: number;
}


export const HOURS: OperatingHours[] = [
  {
    OperatingHoursId: '',
    CompanyId: '',
    DayOfTheWeek: 'Monday',
    DayNo: 1,
    OperatingStatus: 'Open',
    StartTime: '07:00',
    FinishTime: '18:00',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    OperatingHoursId: '',
    CompanyId: '',
    DayOfTheWeek: 'Tuesday',
    DayNo: 2,
    OperatingStatus: 'Open',
    StartTime: '07:00',
    FinishTime: '18:00',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    OperatingHoursId: '',
    CompanyId: '',
    DayOfTheWeek: 'Wednesday',
    DayNo: 3,
    OperatingStatus: 'Open',
    StartTime: '07:00',
    FinishTime: '18:00',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    OperatingHoursId: '',
    CompanyId: '',
    DayOfTheWeek: 'Thursday',
    DayNo: 4,
    OperatingStatus: 'Open',
    StartTime: '07:00',
    FinishTime: '18:00',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    OperatingHoursId: '',
    CompanyId: '',
    DayOfTheWeek: 'Friday',
    DayNo: 5,
    OperatingStatus: 'Open',
    StartTime: '07:00',
    FinishTime: '18:00',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  },
  {
    OperatingHoursId: '',
    CompanyId: '',
    DayOfTheWeek: 'Saturday',
    DayNo: 6,
    OperatingStatus: 'Open',
    StartTime: '07:00',
    FinishTime: '18:00',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  }, {
    OperatingHoursId: '',
    CompanyId: '',
    DayOfTheWeek: 'Sunday',
    DayNo: 7,
    OperatingStatus: 'Open',
    StartTime: '07:00',
    FinishTime: '18:00',
    CreateUserId: '',
    ModifyUserId: '',
    StatusId: 1
  }
];
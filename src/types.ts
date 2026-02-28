export interface Trainer {
  id: string;
  name: string;
  contact: string;
  role?: string;
  dailyAssignments?: Assignment[];
}

export interface Assignment {
  time: string;
  student: string;
  sessionType: string;
}

export interface ScheduleItem {
  date: string;
  time: string;
  type: string;
  location: string;
  trainerId: string;
}

export interface Module {
  id: number;
  title: string;
  date: string;
  completed: boolean;
}

export interface Trainee {
  id: string;
  name: string;
  role: string;
  currentStage: string;
  progress: number;
  trainer: {
    name: string;
    contact: string;
  };
  schedule: ScheduleItem[];
  upcomingModules: Module[];
}

export interface RouteTip {
  id: number;
  text: string;
  coords: {
    lat: number;
    lon: number;
    x: number; // Percentage for relative positioning
    y: number; // Percentage for relative positioning
  };
}

export interface TestRoute {
  name: string;
  tips: RouteTip[];
}

export interface TestRoutes {
  [key: string]: TestRoute;
}

export interface MockData {
  trainee: Trainee;
  trainer: Trainer;
  testRoutes: TestRoutes;
}
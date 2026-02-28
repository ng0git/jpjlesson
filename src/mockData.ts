import { MockData } from './types';

export const MOCK_DATA: MockData = {
  trainee: {
    id: 'T1001',
    name: "Sofia bin Pertama",
    role: "Trainee",
    currentStage: "KPP02 - Practical Training",
    progress: 65,
    trainer: { name: "En. Raju", contact: "012-3456789" },
    schedule: [
      { date: "2025-05-20", time: "14:00", type: "Practical", location: "Circuit 1", trainerId: 'R1' },
      { date: "2025-05-22", time: "10:00", type: "Theory", location: "Classroom B", trainerId: 'S2' },
      { date: "2025-05-29", time: "11:00", type: "Test", location: "JPJ Test Centre", trainerId: 'R1' },
    ],
    upcomingModules: [
      { id: 1, title: "KPP01 Theory Test", date: "May 25", completed: true },
      { id: 2, title: "Circuit Practice", date: "May 28", completed: false },
    ],
  },
  trainer: {
    id: 'R1',
    name: "En. Raju",
    role: "Trainer",
    contact: "012-3456789",
    dailyAssignments: [
      { time: "08:00", student: "Siti Binti", sessionType: "Pickup/Practical" },
      { time: "14:00", student: "Ali Ahmad", sessionType: "Practical Driving" },
    ],
  },
  testRoutes: {
    routeA: {
      name: "JPJ Route A",
      tips: [
        { 
          id: 1, 
          text: "Stop completely at the T-Junction line.", 
          coords: { lat: 3.12, lon: 101.65, x: 20, y: 30 } 
        },
        { 
          id: 2, 
          text: "Ensure 3-point check before moving off.", 
          coords: { lat: 3.13, lon: 101.66, x: 60, y: 55 } 
        },
        { 
            id: 3, 
            text: "School Zone: Maintain 30km/h.", 
            coords: { lat: 3.13, lon: 101.66, x: 40, y: 80 } 
          }
      ]
    },
    routeB: {
        name: "JPJ Route B",
        tips: [
          { 
            id: 1, 
            text: "Watch for merging traffic from the left.", 
            coords: { lat: 3.12, lon: 101.65, x: 30, y: 40 } 
          },
          { 
            id: 2, 
            text: "Hill Start: Don't roll back!", 
            coords: { lat: 3.13, lon: 101.66, x: 70, y: 20 } 
          }
        ]
      }
  }
};
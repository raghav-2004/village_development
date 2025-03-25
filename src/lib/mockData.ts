// Mock village data for the Digital Land Survey application
export interface Village {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  area: {
    size: number; // in square kilometers
    agricultural: number; // percentage
    residential: number; // percentage
    forest: number; // percentage
    other: number; // percentage
  };
  population: number;
  waterBodies: {
    ponds: number;
    lakes: number;
    rivers: boolean;
    groundwaterLevel: number; // in meters below surface
  };
  environment: {
    humidity: number; // percentage
    averageRainfall: number; // in mm per year
    soilType: string;
    averageTemperature: number; // in Celsius
  };
  infrastructure: {
    roads: number; // in kilometers
    schools: number;
    hospitals: number;
    waterSupply: boolean;
    electricity: boolean;
  };
  description: string;
}

export const villages: Village[] = [
  {
    id: "v1",
    name: "Sundarpur",
    location: {
      latitude: 20.5937,
      longitude: 78.9629
    },
    area: {
      size: 12.5,
      agricultural: 65,
      residential: 20,
      forest: 10,
      other: 5
    },
    population: 2500,
    waterBodies: {
      ponds: 3,
      lakes: 1,
      rivers: true,
      groundwaterLevel: 15
    },
    environment: {
      humidity: 65,
      averageRainfall: 850,
      soilType: "Alluvial",
      averageTemperature: 26
    },
    infrastructure: {
      roads: 8.5,
      schools: 2,
      hospitals: 1,
      waterSupply: true,
      electricity: true
    },
    description: "Sundarpur is a thriving agricultural village with fertile soil and good water resources. The village economy primarily depends on rice and wheat cultivation."
  },
  {
    id: "v2",
    name: "Greenvalley",
    location: {
      latitude: 21.2514,
      longitude: 79.1821
    },
    area: {
      size: 8.7,
      agricultural: 45,
      residential: 30,
      forest: 20,
      other: 5
    },
    population: 1800,
    waterBodies: {
      ponds: 2,
      lakes: 0,
      rivers: false,
      groundwaterLevel: 20
    },
    environment: {
      humidity: 58,
      averageRainfall: 720,
      soilType: "Red Soil",
      averageTemperature: 28
    },
    infrastructure: {
      roads: 6.2,
      schools: 1,
      hospitals: 0,
      waterSupply: true,
      electricity: true
    },
    description: "Greenvalley is known for its fruit orchards and vegetable farms. The village faces some challenges with water supply during peak summer months."
  },
  {
    id: "v3",
    name: "Riverwood",
    location: {
      latitude: 19.8762,
      longitude: 77.7542
    },
    area: {
      size: 15.3,
      agricultural: 55,
      residential: 15,
      forest: 25,
      other: 5
    },
    population: 3200,
    waterBodies: {
      ponds: 5,
      lakes: 2,
      rivers: true,
      groundwaterLevel: 8
    },
    environment: {
      humidity: 72,
      averageRainfall: 1100,
      soilType: "Black Soil",
      averageTemperature: 24
    },
    infrastructure: {
      roads: 12.8,
      schools: 3,
      hospitals: 1,
      waterSupply: true,
      electricity: true
    },
    description: "Riverwood enjoys abundant water resources with a major river flowing nearby. The village has good infrastructure and is known for its biodiversity."
  }
]; 
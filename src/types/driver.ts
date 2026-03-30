export type DriverVehicleType = 'Sedan' | 'SUV' | 'Hatchback' | 'Bike' | 'Van';

export type Driver = {
  id: string;
  name: string;
  phone: string;
  imageUrl: string;
  vehicleType: DriverVehicleType;
  rating: number; // 1..5
  coordinate: {
    latitude: number;
    longitude: number;
  };
};


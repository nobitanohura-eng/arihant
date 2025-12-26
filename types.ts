
export type VehicleStatus = 'available' | 'booked';

export interface Vehicle {
  id: string;
  name: string;
  seats: number;
  ac: boolean;
  price_per_km: number;
  image_url: string;
  status: VehicleStatus;
  description?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_location: string;
  drop_location: string;
  date: string;
  time: string;
  vehicle_id: string;
  status: BookingStatus;
  service_type: string;
  passenger_count: number;
  special_requirements?: string;
  created_at: string;
  vehicle?: Vehicle; // Joined data
}

export interface Review {
  id: string;
  booking_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_visible: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
}

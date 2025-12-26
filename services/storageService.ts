
import { Vehicle, Booking, Review, VehicleStatus, BookingStatus } from '../types';
import { INITIAL_VEHICLES } from '../constants';
import { supabase } from './supabaseClient';

export const storageService = {
  // Check password against Supabase 'admin_config' table
  adminLogin: async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_config')
        .select('value')
        .eq('key', 'admin_password')
        .single();
      
      if (error) {
        console.warn("Falling back to hardcoded password check due to DB error:", error);
        return password === 'Arihant@10';
      }
      return data.value === password;
    } catch (e) {
      return password === 'Arihant@10';
    }
  },

  init: async () => {
    try {
      const { data: vehicles, error } = await supabase.from('vehicles').select('id').limit(1);
      if (error) return;
      if (vehicles && vehicles.length === 0) {
        await supabase.from('vehicles').insert(INITIAL_VEHICLES);
      }
    } catch (e) {
      console.error('Failed to initialize storage service:', e);
    }
  },

  getVehicles: async (): Promise<Vehicle[]> => {
    try {
      const { data, error } = await supabase.from('vehicles').select('*').order('name');
      return error ? INITIAL_VEHICLES : (data || INITIAL_VEHICLES);
    } catch (e) {
      return INITIAL_VEHICLES;
    }
  },

  updateVehicleStatus: async (id: string, status: VehicleStatus) => {
    const { error } = await supabase.from('vehicles').update({ status }).eq('id', id);
    if (error) throw error;
  },

  upsertVehicle: async (vehicle: Vehicle) => {
    const { error } = await supabase.from('vehicles').upsert(vehicle);
    if (error) throw error;
  },

  deleteVehicle: async (id: string) => {
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (error) throw error;
  },

  getBookings: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, vehicle:vehicles(*)')
      .order('created_at', { ascending: false });
    return error ? [] : (data || []);
  },

  getBookingById: async (id: string): Promise<Booking | null> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, vehicle:vehicles(*)')
      .eq('id', id)
      .maybeSingle();
    return error ? null : data;
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<Booking | null> => {
    const newBooking = {
      ...booking,
      id: `BK-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
      status: 'pending' as BookingStatus,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('bookings').insert(newBooking).select().single();
    if (error) return null;

    await storageService.updateVehicleStatus(booking.vehicle_id, 'booked');
    return data;
  },

  updateBookingStatus: async (id: string, status: BookingStatus, vehicleId?: string) => {
    console.log(`[Supabase Action] Booking: ${id} -> ${status}`);
    
    // 1. Update the booking status in Supabase
    const { data, error: bError } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();

    if (bError) {
      console.error("[Supabase Error]", bError.message);
      throw bError;
    }

    if (!data || data.length === 0) {
      throw new Error("No rows were updated. Check RLS policies.");
    }

    // 2. If ending the ride, free up the vehicle
    if (status === 'cancelled' || status === 'completed') {
      const vId = vehicleId || data[0].vehicle_id;
      if (vId) {
        console.log(`[Supabase Action] Releasing Vehicle: ${vId}`);
        const { error: vError } = await supabase
          .from('vehicles')
          .update({ status: 'available' })
          .eq('id', vId);
        
        if (vError) console.error("[Vehicle Release Error]", vError.message);
      }
    }
    
    return true;
  },

  getReviews: async (): Promise<Review[]> => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  getVisibleReviews: async (): Promise<Review[]> => {
    const { data } = await supabase.from('reviews').select('*').eq('is_visible', true).order('created_at', { ascending: false });
    return data || [];
  },

  updateReviewStatus: async (id: string, is_visible: boolean) => {
    await supabase.from('reviews').update({ is_visible }).eq('id', id);
  },

  deleteReview: async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id);
  },

  addReview: async (review: Omit<Review, 'id' | 'created_at' | 'is_visible'>) => {
    await supabase.from('reviews').insert({ ...review, id: Math.random().toString(36).substr(2, 9), is_visible: false, created_at: new Date().toISOString() });
  }
};

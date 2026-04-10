import { apiRequest } from './api';

export interface UserProfileDTO {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  delivery_address: string | null;
  delivery_location: string | null;
  is_legacy_user: boolean;
  is_activated: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserProfileInput {
  full_name?: string | null;
  phone?: string | null;
  delivery_address?: string | null;
  delivery_location?: string | null;
}

export const fetchMyProfile = async (): Promise<UserProfileDTO> => {
  return apiRequest<UserProfileDTO>('/users/me');
};

export const updateMyProfile = async (payload: UpdateUserProfileInput): Promise<UserProfileDTO> => {
  return apiRequest<UserProfileDTO>('/users/me', {
    method: 'PUT',
    body: payload,
  });
};
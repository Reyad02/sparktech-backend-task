export interface IUser {
  email: string;
  password: string;
  profileImg?: string;
  userName: string;
  otp?: string;
  otpExpiry?: Date;
  otpVerified?: boolean;
}

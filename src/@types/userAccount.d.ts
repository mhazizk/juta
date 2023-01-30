/**
 * Global user account type
 *
 * @type GlobalUserAccountType
 *
 */
export type GlobalUserAccountType = {
  uid: string | number[];
  photoURL: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
  subscription: {
    active: boolean;
    plan: "free" | "premium";
    date: number;
    expiry: number;
  };
  devicesLoggedIn: DeviceLogType[];
  groups: string[];
  featureWishlist: string[] | number[];
};

type DeviceLogType = {
  device_id: string;
  device_name: string;
  device_OS: string;
  last_login: number;
};

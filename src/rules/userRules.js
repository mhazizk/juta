const userRules = {
  name: "required",
  email: "required|email",
  password: "required|min:6",
  password_confirmation: "required|same:password",
  phone: "required|numeric",
  address: "required",
  city: "required",
  state: "required",
  zip: "required",
  country: "required",
};

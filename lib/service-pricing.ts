export interface ServicePricingConfig {
  career: {
    bands: {
      "0-3": { individual: number; bundle: number };
      "4-6": { individual: number; bundle: number };
      "7-10": { individual: number; bundle: number };
      "10+": { individual: number; bundle: number };
    };
    interview: number;
  };
  admissions: {
    clarity: number;
    precision: number;
    distinction: number;
  };
  scholarships: {
    "1-2": [number, number, number];
    "3-4": [number, number, number];
    "5-6": [number, number, number];
    "7+": [null, null, null];
  };
  mba: {
    essentials: number;
    mastery: number;
    fullRide: number;
    discountAtFive: number;
    discountAtTen: number;
  };
}

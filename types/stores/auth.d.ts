export type RecipientUser = {
  id: string;
  merchantId: string | null;
  nik: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  income: string;
  familiyMembers: number;
  landArea: number;
  homeOwnership: string;
  kjsNumber: string;
  haveBankAccount: boolean;
  classification: string | null;
  balance: string;
  status: string;
  suspensionNotes: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  merchant: any | null;
  subsidies: {
    id: string;
    recipientId: string;
    productId: string;
    monthlyQuota: number;
    remainingQuota: number;
    usageQuota: number;
    product: {
      id: string;
      name: string;
    };
  }[];
};

export type MerchantUser = {
  id: string;
  code: string;
  name: string;
  nik: string;
  ownerName: string;
  phone: string;
  district: string;
  address: string;
  lat: string;
  lng: string;
  maxCapacity: number;
  status: boolean;
  balance: string;
  createdAt: string;
  updatedAt: string;
  products: any[];
};

export type LoginForm = {
  nik: string;
  password: string;
};

export type RegisterForm = {
  nationalId: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
  rtRw: string;
  village: string;
  district: string;
  religion: string;
  maritalStatus: string;
  occupation: string;
  nationality: string;
  password: string;
  confirmPassword: string;
  income: string;
  landArea: string;
  familiyMembers: string;
  homeOwnership: string;
  kjsNumber: string;
  haveBankAccount: string;
  subsidies: string[];
  suspensionNotes: string | null;
};

export type RecipientProfile = {
  id: string;
  merchantId: string | null;
  nik: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  income: string;
  familiyMembers: number;
  landArea: number;
  homeOwnership: string;
  kjsNumber: string;
  haveBankAccount: boolean;
  classification: string | null;
  balance: string;
  status: string;
  suspensionNotes: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  subsidies: Subsidy[];
  _count: {
    transactions: number;
  };
};

export type Subsidy = {
  id: string;
  recipientId: string;
  productId: string;
  monthlyQuota: number;
  remainingQuota: number;
  usageQuota: number;
  product: {
    id: string;
    name: string;
    price: number;
    subsidyPrice: number;
    unit: string;
  };
};

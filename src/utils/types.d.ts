import { IconType } from 'react-icons';

declare type SelectOptions = {
  name: string;
  options: string[];
};

declare type ActionChildren = {
  name: string;
  icon: IconType;
};

declare interface ActionsIntertface {
  name: string;
  icon: IconType;
  children?: ActionChildren[];
}

type TextValue = {
  _text: string;
};

declare type LotDetails = {
  lotNumber: string;
  expiryDate: string;
  quantityOnHand: string;
};

declare type Vendor = {
  ListID: TextValue;
  TimeCreated: TextValue;
  TimeModified: TextValue;
  EditSequence: TextValue;
  Name: TextValue;
  IsActive: TextValue;
  CompanyName?: TextValue;
  VendorAddress?: {
    Addr1: TextValue;
  };
  VendorAddressBlock?: {
    Addr1: TextValue;
  };
  NameOnCheck?: TextValue;
  IsVendorEligibleFor1099: TextValue;
  Balance: TextValue;
};

declare type VendorResponse = {
  QBXML: {
    QBXMLMsgsRs: {
      VendorQueryRs: {
        VendorRet: Vendor[];
      };
    };
  };
};
declare type ClassResponse = {
  QBXML: {
    QBXMLMsgsRs: {
      ClassQueryRs: {
        ClassRet: Class[];
      };
    };
  };
};
declare type CustomerResponse = {
  QBXML: {
    QBXMLMsgsRs: {
      CustomerQueryRs: {
        CustomerRet: Customer[];
      };
    };
  };
};
declare type ProductResponse = {
  status: boolean;
  message: Product[];
};

declare type ParentRef = {
  ListID: TextValue;
  FullName: TextValue;
};

declare type Class = {
  ListID: TextValue;
  TimeCreated: TextValue;
  TimeModified: TextValue;
  EditSequence: TextValue;
  Name: TextValue;
  FullName: TextValue;
  IsActive: TextValue;
  ParentRef?: ParentRef; // Optional because not all items might have a parent reference
  Sublevel: TextValue;
};

declare type Customer = {
  ListID: TextValue;
  TimeCreated: TextValue;
  TimeModified: TextValue;
  EditSequence: TextValue;
  Name: TextValue;
  FullName: TextValue;
  IsActive: TextValue;
  Sublevel: TextValue;
  Balance: TextValue;
  TotalBalance: TextValue;
  JobStatus: TextValue;
  PreferredDeliveryMethod: TextValue;
};

declare type ParentReference = {
  ListID: TextValue;
  FullName: TextValue;
};

declare type AccountReference = {
  ListID: TextValue;
  FullName: TextValue;
};

interface Reference {
  listID: string;
  fullName: string;
}

interface UnitOfMeasure {
  sublevel: number;
  fullName: string;
  quantity: number;
}

interface SiteInventory {
  siteName: string;
  quantityOnsite: number;
}

interface Product {
  itemName: string;
  unitOfMeasure: any;
  listID: string;
  timeCreated: number;
  timeModified: number;
  editSequence: string;
  name: string;
  fullName: string;
  isActive: string;
  sublevel: string;
  salesPrice: string;
  incomeAccountRef: Reference;
  purchaseCost: string;
  cOGSAccountRef: Reference;
  assetAccountRef: Reference;
  parentRef: Reference;
  classRef: Reference;
  quantityOnHand: string;
  averageCost: string;
  quantityOnOrder: string;
  QuantityOnSalesOrder: string;
  unitOfMeasureSetRef: Reference;
  salesDesc: string;
  purchaseDesc: string;
  prefVendorRef: Reference;
  salesTaxCodeRef: Reference;
  reorderPoint: number;
  itemsLeft?: number;
  unitsOfMeasure: [];
   productRef?: {
    fullName: string;
  };
   sites?: SiteInventory[];
  unitsOfMeasure?: UnitOfMeasure[];
}

declare type UserProfile = {
  phone: string;
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  gender: string;
  dob: number;
  nin: string;
  country: string;
  nextOfKeen: string;
  bCode: string;
  account: string;
  isHalf: boolean;
  isAds: boolean;
  isSurvey: boolean;
  otp: boolean;
  bLimit: {
    savingLimit: number;
    loanLimit: number;
    isSet: boolean;
    isBlocked: boolean;
  };
  isFieldOfficer: boolean;
  isCustomerCare: boolean;
  isMaMas: boolean;
  isAgent: boolean;
  facilityMatch: string[];
  dMaMas: {
    createdBy: string;
    pregFreq: string;
    startDate: number;
    expectationDate: number;
    noWeeks: number | null;
    timeStamp: number;
    target: {
      amount: number;
      isTarget: boolean;
    };
    expense: {
      facilityType: string;
      isTreatment: boolean;
      treatment: number;
      isTransport: boolean;
      transport: number;
      isBPK: boolean;
      bpk: number;
      isUpkeep: boolean;
      upkeep: number;
    };
    isAutoSave: boolean;
    autoFreq: string;
    isPlanning: boolean;
  };
  agentDetails: {
    agentCode: string;
    refferalCode: string;
    balance: number;
    dateIn: number;
  };
  fieldOfficer: {
    fieldOfficerId: string;
    role: string;
    region: string;
    who: string;
    timeStamp: number;
  };
  ads: User;
};

declare type User = {
  ads: true;
  active: true;
  station: string[];
  role: 'IT' | 'DISPENSER' | 'ADMIN' | 'SUPERVISOR' | 'RESTOCKING' | 'RECONCILIATION' | 'DELIVERY' | 'MANAGER';
};

declare type UnitOfMeasure = {
  fullName: string;
};
declare type RequestOrderItem = {
  unitsOfMeasure: any;
  quantityOrdered: number;
  user?: User;
  sites: Site[];
  listID: string;
  name: string;
  fullName: string;
  unitOfMeasureSetRef: UnitOfMeasure;
  isActive: string;
  salesDesc: string | null;
  purchaseDesc: string | null;

  selectedUnit?: string; // ✅ Add this line
};


declare type Site = {
  siteName: string;
  siteId: string;
  quantityOnsite: number | null;
};

// Extend the Item type to include the user property
declare type ItemWithUser = Item & {
  sites: Site[];
  user?: User;
  order: number;
};

declare type OrderDispenser = {
  accountId: string;
  name: string;
};

declare type OrderItem = {
  itemName: string;
  listID: string;
  quantity: number;
  unitOfMeasure: string;
  rate: number;
  orderItemStatus: string;
  notes: string | null;
};

declare type OrderResponse = {
  orderId: string;
  dispenser: OrderDispenser;
  requestType: string;
  orderStatus: string;
  items: OrderItem[];
  facilityName: string;
  tillNo: string;
  timeStamp: number;
  lastUpdated: number;
  scheduledDate: number;
  region: string;
  filterBy: string | null;
  page: number | null;
  filterDate: string | null;
  orderNo: string;
  notes: Note[];
  name: string;
};

declare type RequestOrder = {
  combinedItems: RequestOrderItem[];
}

declare type RequestOrderResponse = {
  status: boolean;
  message: OrderResponse[];
};

declare interface AccountDetails {
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  gender: string;
  dob: number;
  nin: string;
  country: string;
  nextOfKeen: string;
  timeStamp: number;
}

declare interface BLimit {
  savingLimit: number;
  loanLimit: number;
  isSet: boolean;
  isBlocked: boolean;
}

declare interface DMaMas {
  createdBy: string;
  pregFreq: string;
  startDate: number;
  expectationDate: number;
  noWeeks: null | number;
  timeStamp: number;
  target: {
    amount: number;
    isTarget: boolean;
  };
  expense: {
    facilityType: string;
    isTreatment: boolean;
    treatment: number;
    isTransport: boolean;
    transport: number;
    isBPK: boolean;
    bpk: number;
    isUpkeep: boolean;
    upkeep: number;
  };
  isAutoSave: boolean;
  autoFreq: string;
  isPlanning: boolean;
}

declare interface FieldOfficer {
  fieldOfficerId: string;
  role: string;
  region: string;
  who: string;
  timeStamp: number;
}

declare interface CustomerCare {
  staffId: string;
  position: string;
  company: string;
  who: string;
  timeStamp: number;
}

declare interface ADSDetails {
  ads: boolean;
  active: boolean;
  station: string[];
  role: string;
}

declare interface AgentDetails {
  agentCode: string;
  refferalCode: string;
  balance: number;
  dateIn: number;
}

declare interface BankDetails {
  bankAccount: string;
  bankNames: string;
}

declare interface ADSData {
  phone: string;
  accountDetails: AccountDetails;
  pinCode: string;
  bCode: string;
  access_token: null | string;
  account: string;
  bLimit: BLimit;
  facilityMatch: any[];
  dMaMas: DMaMas;
  fieldOfficer: FieldOfficer;
  customerCare: CustomerCare;
  adsDetails: ADSDetails;
  agentDetails: AgentDetails;
  bankDetails: BankDetails;
  isFieldOfficer: boolean;
  isCustomerCare: boolean;
  isMaMas: boolean;
  isAds: boolean;
  isSurvey: boolean;
  isActive: boolean;
  isTombStone: boolean;
  isAgent: boolean;
  otp: boolean;
  sP: boolean;
}

declare interface ADSResponse {
  status: boolean;
  message: ADSData[];
}

declare interface PaymentInfo {
  amountPaid: number;
  modeOfPayment: string;
  transactionId: string;
}

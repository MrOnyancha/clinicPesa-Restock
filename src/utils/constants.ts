import { ActionsIntertface, SelectOptions } from './types';
import { CiFilter, CiViewColumn } from 'react-icons/ci';
import { TiSpannerOutline } from 'react-icons/ti';
import { SiDatabricks } from 'react-icons/si';
import { LiaSortSolid } from 'react-icons/lia';
import { FiEdit, FiRefreshCw } from 'react-icons/fi';
import { RiDeleteBinLine, RiRemoteControlLine } from 'react-icons/ri';
import { IoBarChartOutline, IoBookmarkOutline, IoMailOutline, IoSaveOutline, IoStarOutline } from 'react-icons/io5';
import { PiComputerTowerLight, PiSelectionAllLight } from 'react-icons/pi';
import { AiOutlineBarChart, AiOutlineGroup, AiOutlineMergeCells } from 'react-icons/ai';
import { VscSaveAs } from 'react-icons/vsc';
import { TfiHelpAlt } from 'react-icons/tfi';
import {
  MdContentCopy,
  MdOutlineCheck,
  MdOutlineFileDownload,
  MdOutlinePivotTableChart,
  MdOutlineResetTv,
} from 'react-icons/md';
import { TbSum } from 'react-icons/tb';
import { GiBackwardTime } from 'react-icons/gi';

export const bufferReportCheckboxLabels: string[] = [
  'invoiceVend',
  'DelNoteO',
  'DelNoteI',
  'Invoice',
  'Damage',
  'SaleCOR',
  'InvoiceVENDcor',
  'InvoiceCOR',
  'Shortages',
  'Order',
  'AutoOrder',
];
export const productDetailsCheckboxLabels: string[] = [
  'Credit note',
  'Debit note',
  'Damaged Product',
  'Delivery Note(Out)',
  'Expired Product',
  'Invoice',
  'Sale',
];
export const IRCCheckboxLabels: string[] = ['30 Days', '90 Days', '180 Days'];

export const searchProductTableConditions: string[] = [
  'All Text Columns',
  'Catalog',
  'Products',
  'Country of Production',
  'Departments',
  'Manufacturer',
  'Category',
  'Condition',
  'Vendor',
];
export const searchCreateInternalPOTableConditions: string[] = [
  'All Text Columns',
  'Products',
  'Departments',
  'Category',
  'Condition',
  'Last order',
  'Comment',
];

export const searchMedicinesRefundedTableConditions: string[] = [
  'All Columns',
  'Branch',
  'Date of issue',
  'Insurance Company',
  'Customer',
  'Mcard',
  'ID',
  'Product',
  'Class',
  'Quantity',
  'Price',
  'Margin',
  'Mark up',
  'Value',
];

export const searchSalesRevenueDrugsTable: string[] = [
  'All Columns',
  'Branch',
  'ID',
  'Product',
  'Class',
  'Quantity',
  'Purchase Value',
  'Selling Value',
  'Discount',
  'Profit',
];

export const searchChangesInPurchaseTableConditions: string[] = [
  'All Columns',
  'Dakt',
  'Branch',
  'Empoyee',
  'ID',
  'Product',
  'Purchase Old',
  'Purchase New',
  'Quantity Old',
  'Quantity New',
  'Expiry Date Old',
  'Expiry Date New',
  'SN Old',
  'SN New',
  'Purchase Price Old',
  'Purchase Price New',
];

export const searchDeliveryNoteTableConditons: string[] = [
  'All Text Columns',
  'Link',
  'Invoice No.',
  'Branch',
  'Warehouse',
  'Introduced',
  'Approved',
];

export const searchPaymentVoucherTableConditions: string[] = [
  'All Columns',
  'Date',
  'Vendors',
  'TIN',
  'Number',
  'Status',
  'Payment method',
];

export const searchproductsPurchasedTableConditions: string[] = [
  'All Columns',
  'Date Inv',
  'Invoice Number',
  'Vendor',
  'ID',
  'Products',
  'Serial Number',
  'Expiry Date',
  'Packs',
  'Cost Price',
  'Total Value',
];

export const searchAgingTableByExpiryConditions: string[] = [
  'All columns',
  'Vendor',
  'ID',
  'Product Name',
  'Invoice',
  'Expiry',
  'Serial No',
  'Quantites',
  'Quantities (Packs)',
  'Cost Price',
  '0-30 Days',
  '31-60 Days',
  '61-90 Days',
  '91-120 Days',
  '121-180 Days',
  '>181 Days',
];

export const bufferReportTableSearchConditions: string[] = [
  'All Columns',
  'In/Out',
  'Type',
  'Branch',
  'Employer',
  'Symbol',
  'Date',
  'Products',
  'Quantity',
  'Cost Price',
  'Value',
];

export const bufferReportADS: string[] = [
  'clinicPesa Pharmarcy',
  'Aspin DrugStores-Kyanja',
  'Aspin DrugStores-Nabbingo',
  'Aspin DrugStores-Masaka',
  'Aspin DrugStores-Kibiri',
  'Aspin DrugStores-Katade',
  'Aspin DrugStores-Busabala',
  'Aspin DrugStores-Namavundu',
  'Aspin DrugStores-Kyengera',
  'Aspin DrugStores-Njeru',
  'Aspin DrugStores-Katabi',
];
export const puchaseHistoyADS: string[] = [
  'All',
  'Aspin DrugStores-Kyanja',
  'Aspin DrugStores-Nabbingo',
  'Aspin DrugStores-Masaka',
  'Aspin DrugStores-Kibiri',
  'Aspin DrugStores-Katade',
  'Aspin DrugStores-Busabala',
  'Aspin DrugStores-Namavundu',
  'Aspin DrugStores-Kyengera',
  'Aspin DrugStores-Njeru',
  'Aspin DrugStores-Katabi',
  'clinicPesa Pharmarcy',
];
export const usersADS: string[] = [
  'Aspin DrugStores-Kyanja',
  'Aspin DrugStores-Nabbingo',
  'Aspin DrugStores-Masaka',
  'Aspin DrugStores-Kibiri',
  'Aspin DrugStores-Katade',
  'Aspin DrugStores-Busabala',
  'Aspin DrugStores-Namavundu',
  'Aspin DrugStores-Kyengera',
  'Aspin DrugStores-Njeru',
  'Aspin DrugStores-Katabi',
  'clinicPesa Pharmarcy',
];

export const animalsList1 = [
  { id: 191, name: 'Chlidonias leucopterus' },
  { id: 192, name: 'Macropus eugenii' },
  { id: 193, name: 'Vombatus ursinus' },
  { id: 194, name: 'Gopherus agassizii' },
  { id: 195, name: 'Morelia spilotes variegata' },
  { id: 196, name: 'Ateles paniscus' },
  { id: 197, name: 'Coracias caudata' },
  { id: 198, name: 'unavailable' },
  { id: 199, name: 'Cracticus nigroagularis' },
  { id: 200, name: 'Dasyurus viverrinus' },
  { id: 201, name: 'Chauna torquata' },
  { id: 202, name: 'Manouria emys' },
  { id: 203, name: 'Pituophis melanaleucus' },
  { id: 204, name: 'Macropus robustus' },
  { id: 205, name: 'Priodontes maximus' },
  { id: 206, name: 'Corvus albicollis' },
  { id: 207, name: 'Papilio canadensis' },
  { id: 208, name: 'Tachyglossus aculeatus' },
  { id: 209, name: 'Ardea cinerea' },
  { id: 210, name: 'Castor fiber' },
  { id: 211, name: 'Vanellus armatus' },
  { id: 212, name: 'Centrocercus urophasianus' },
  { id: 213, name: 'Boa constrictor mexicana' },
  { id: 214, name: 'Thylogale stigmatica' },
  { id: 215, name: 'Odocoileus hemionus' },
  { id: 216, name: 'Phoca vitulina' },
  { id: 217, name: 'Falco peregrinus' },
  { id: 218, name: 'Macropus rufogriseus' },
  { id: 219, name: 'Felis caracal' },
  { id: 220, name: 'Macropus fuliginosus' },
  { id: 221, name: 'Coluber constrictor' },
  { id: 222, name: 'Phalacrocorax brasilianus' },
  { id: 223, name: 'Ctenophorus ornatus' },
  { id: 224, name: 'Ara chloroptera' },
  { id: 225, name: 'Irania gutteralis' },
  { id: 226, name: 'Antidorcas marsupialis' },
  { id: 227, name: 'Capra ibex' },
  { id: 228, name: 'Ardea cinerea' },
  { id: 229, name: 'Lycosa godeffroyi' },
  { id: 230, name: 'Anser caerulescens' },
  { id: 231, name: 'Alcelaphus buselaphus caama' },
  { id: 232, name: 'Equus burchelli' },
  { id: 233, name: 'Otaria flavescens' },
  { id: 234, name: 'Canis lupus' },
  { id: 235, name: 'Pycnonotus barbatus' },
  { id: 236, name: 'Catharacta skua' },
  { id: 237, name: 'Myotis lucifugus' },
  { id: 238, name: 'Climacteris melanura' },
  { id: 239, name: 'Macropus rufogriseus' },
  { id: 240, name: 'Kobus leche robertsi' },
  { id: 241, name: 'Acrantophis madagascariensis' },
  { id: 242, name: 'Manouria emys' },
  { id: 243, name: 'Snycerus caffer' },
  { id: 244, name: 'Butorides striatus' },
  { id: 245, name: 'Acrobates pygmaeus' },
  { id: 246, name: 'Toxostoma curvirostre' },
  { id: 247, name: 'Cebus albifrons' },
  { id: 248, name: 'Zalophus californicus' },
  { id: 249, name: 'Herpestes javanicus' },
  { id: 250, name: 'Canis aureus' },
  { id: 251, name: 'Spilogale gracilis' },
  { id: 252, name: 'Macaca radiata' },
  { id: 253, name: 'Ursus americanus' },
  { id: 254, name: 'Crocodylus niloticus' },
  { id: 255, name: 'Bos taurus' },
  { id: 256, name: 'Coluber constrictor' },
  { id: 257, name: 'Anthropoides paradisea' },
  { id: 258, name: 'Boa caninus' },
  { id: 259, name: 'Axis axis' },
  { id: 260, name: 'Geochelone elephantopus' },
  { id: 261, name: 'Tamiasciurus hudsonicus' },
  { id: 262, name: 'Eubalaena australis' },
  { id: 263, name: 'Alectura lathami' },
  { id: 264, name: 'Zenaida asiatica' },
  { id: 265, name: 'Acrobates pygmaeus' },
  { id: 266, name: 'Choloepus hoffmani' },
  { id: 267, name: 'Ovis orientalis' },
  { id: 268, name: 'Dasypus novemcinctus' },
  { id: 269, name: 'Aonyx cinerea' },
  { id: 270, name: 'Melursus ursinus' },
  { id: 271, name: 'Cygnus buccinator' },
  { id: 272, name: 'Laniaurius atrococcineus' },
  { id: 273, name: 'Tetracerus quadricornis' },
  { id: 274, name: 'Lamprotornis nitens' },
  { id: 275, name: 'Perameles nasuta' },
  { id: 276, name: 'Equus hemionus' },
  { id: 277, name: 'Theropithecus gelada' },
  { id: 278, name: 'Ramphastos tucanus' },
  { id: 279, name: 'Mirounga leonina' },
  { id: 280, name: 'Ephippiorhynchus mycteria' },
  { id: 281, name: 'Falco peregrinus' },
  { id: 282, name: 'Cervus canadensis' },
  { id: 283, name: 'Mycteria leucocephala' },
  { id: 284, name: 'Eolophus roseicapillus' },
  { id: 285, name: 'Theropithecus gelada' },
  { id: 286, name: 'Halcyon smyrnesis' },
  { id: 287, name: 'Hymenolaimus malacorhynchus' },
];

export const animalsList2 = [
  { id: 1, name: 'Graspus graspus' },
  { id: 2, name: 'Grus rubicundus' },
  { id: 3, name: 'Speothos vanaticus' },
  { id: 4, name: 'Charadrius tricollaris' },
  { id: 5, name: 'Sciurus vulgaris' },
  { id: 6, name: 'Ateles paniscus' },
  { id: 7, name: 'Bucorvus leadbeateri' },
  { id: 8, name: 'Bubulcus ibis' },
  { id: 9, name: 'Physignathus cocincinus' },
  { id: 10, name: 'Phoca vitulina' },
  { id: 11, name: 'unavailable' },
  { id: 12, name: 'Zenaida galapagoensis' },
  { id: 13, name: 'Pseudalopex gymnocercus' },
  { id: 14, name: 'Terathopius ecaudatus' },
  { id: 15, name: 'Eumetopias jubatus' },
  { id: 16, name: 'Callorhinus ursinus' },
  { id: 17, name: 'Tamiasciurus hudsonicus' },
  { id: 18, name: 'Dasyurus viverrinus' },
  { id: 19, name: 'Madoqua kirkii' },
  { id: 20, name: 'Hystrix cristata' },
  { id: 21, name: 'Phalacrocorax niger' },
  { id: 22, name: 'Neotis denhami' },
  { id: 23, name: 'Conolophus subcristatus' },
  { id: 24, name: 'Cynictis penicillata' },
  { id: 25, name: 'Rhea americana' },
  { id: 26, name: 'Lama pacos' },
  { id: 27, name: 'Anitibyx armatus' },
  { id: 28, name: 'Motacilla aguimp' },
  { id: 29, name: 'Cereopsis novaehollandiae' },
  { id: 30, name: 'Anas platyrhynchos' },
  { id: 31, name: 'Varanus salvator' },
  { id: 32, name: 'Acanthaster planci' },
  { id: 33, name: 'Pelecanus occidentalis' },
  { id: 34, name: 'Pycnonotus nigricans' },
  { id: 35, name: 'Meles meles' },
  { id: 36, name: 'Anastomus oscitans' },
  { id: 37, name: 'Ardea cinerea' },
  { id: 38, name: 'Cereopsis novaehollandiae' },
  { id: 39, name: 'Butorides striatus' },
  { id: 40, name: 'Canis mesomelas' },
  { id: 41, name: 'Ephippiorhynchus mycteria' },
  { id: 42, name: 'Physignathus cocincinus' },
  { id: 43, name: 'Odocoileus hemionus' },
  { id: 44, name: 'Neotis denhami' },
  { id: 45, name: 'Theropithecus gelada' },
  { id: 46, name: 'Nycticorax nycticorax' },
  { id: 47, name: 'Theropithecus gelada' },
  { id: 48, name: 'Sarkidornis melanotos' },
  { id: 49, name: 'Conolophus subcristatus' },
  { id: 50, name: 'Anastomus oscitans' },
  { id: 51, name: 'Semnopithecus entellus' },
  { id: 52, name: 'Equus hemionus' },
  { id: 53, name: 'Phoenicopterus ruber' },
  { id: 54, name: 'Tyto novaehollandiae' },
  { id: 55, name: 'Canis aureus' },
  { id: 56, name: 'Haematopus ater' },
  { id: 57, name: 'Odocoilenaus virginianus' },
  { id: 58, name: 'Varanus sp.' },
  { id: 59, name: 'Crotalus triseriatus' },
  { id: 60, name: 'Vulpes chama' },
  { id: 61, name: 'Acrobates pygmaeus' },
  { id: 62, name: 'Myrmecophaga tridactyla' },
  { id: 63, name: 'Chlidonias leucopterus' },
  { id: 64, name: 'Elephas maximus bengalensis' },
  { id: 65, name: 'Lamprotornis nitens' },
  { id: 66, name: 'Francolinus swainsonii' },
  { id: 67, name: 'Trichosurus vulpecula' },
  { id: 68, name: 'Casmerodius albus' },
  { id: 69, name: 'Dusicyon thous' },
  { id: 70, name: 'Cracticus nigroagularis' },
  { id: 71, name: 'Corvus albicollis' },
  { id: 72, name: 'Giraffe camelopardalis' },
  { id: 73, name: 'Oryx gazella' },
  { id: 74, name: 'Cracticus nigroagularis' },
  { id: 75, name: 'Geococcyx californianus' },
  { id: 76, name: 'Litrocranius walleri' },
  { id: 77, name: 'Hystrix cristata' },
  { id: 78, name: 'Neophron percnopterus' },
  { id: 79, name: 'Boa caninus' },
  { id: 80, name: 'Lamprotornis superbus' },
  { id: 81, name: 'Tayassu pecari' },
  { id: 82, name: 'Branta canadensis' },
  { id: 83, name: 'Taurotagus oryx' },
  { id: 84, name: 'Tragelaphus scriptus' },
  { id: 85, name: 'Odocoileus hemionus' },
  { id: 86, name: 'Uraeginthus granatina' },
  { id: 87, name: 'Tenrec ecaudatus' },
  { id: 88, name: 'Bos taurus' },
  { id: 89, name: 'Cebus nigrivittatus' },
  { id: 90, name: 'Ciconia ciconia' },
  { id: 91, name: 'Canis lupus lycaon' },
  { id: 92, name: 'Canis aureus' },
  { id: 93, name: 'Corvus brachyrhynchos' },
  { id: 94, name: 'Cygnus atratus' },
  { id: 95, name: 'Platalea leucordia' },
  { id: 96, name: 'Dromaeus novaehollandiae' },
  { id: 97, name: 'Rhea americana' },
  { id: 98, name: 'Dusicyon thous' },
  { id: 99, name: 'Geochelone radiata' },
  { id: 100, name: 'Microcebus murinus' },
];

export const units: string[] = [
  'Tablet',
  'Bottle',
  'Capsule',
  'Pack',
  'Injection',
  'Dose',
  'Tin',
  'Cycle',
  'Sachets',
  'Drink',
  'Piece',
  'Strip',
  'Pairs',
];

export const employeeNames: string[] = [
  'Anyango',
  'Brian Munamba',
  'Caroline Mayobo',
  'Diana Mukholi',
  'Emily Logose',
  'Emily Masembe',
  'Jane Amiji',
  'Joy Kisakye',
  'Juliet Nyamoita',
  'Komakech',
  'Miriam Kagabane',
  'Mwizagye',
  'Onyancha Chrispinus',
  'William Buule',
  'support',
  'Allan Byenkya',
];

export const productsPuchasedOptions: SelectOptions[] = [
  { name: 'Default', options: ['Primary Report'] },
  { name: 'Public', options: ['Vendor Purchase'] },
];

export const stockAtHandOptions: SelectOptions[] = [
  { name: 'Default', options: ['Primary Report', 'By Class', 'Quantity in branches', 'Warehouse Value'] },
  {
    name: 'Public',
    options: [
      'Actual SAH List',
      'Actual vs Average CP',
      'Current stock value',
      'Ntinda stock',
      'SAH Branch',
      'Summary',
      'Total SAH',
      'Total SAH by Product',
      'Warehouse',
      'Warehouse SAH',
      'Warehouse Stock Value',
    ],
  },
];

export const salesEmployeeOptions: SelectOptions[] = [
  { name: 'Default', options: ['Primary Report'] },
  { name: 'Public', options: ['Employee sales records', 'Sales report'] },
];

export const searchStockAtHandConctions: string[] = [
  'All Columns',
  'Branch',
  'ID',
  'Product',
  'Class',
  'Quantity',
  'Purchase Price',
  'Purchase Value',
  'Retail Price',
];

export const searchInternalPOHistoryTableConditions: string[] = ['All Columns', 'Symbol', 'Branch', 'User', 'Comments'];
export const searchCreatePOTableConditions: string[] = ['All Columns', 'Symbol', 'Branch', 'User', 'Comments'];
export const searchPOToVendorsTableConditions: string[] = ['All Columns', 'Symbol', 'Vendor', 'User', 'Comments'];

export const searchCustomerTableConditions: string[] = [
  'All Text Columns',
  'Customer number',
  'Created in a branch',
  'Name',
  'Mail',
  'Phone',
  'Insurance',
  'Sales Agent',
  'Class',
];
export const productAuditTableConditions: string[] = [
  'All Columns',
  'ID',
  'Product',
  'Link',
  'Opening Stock [Q]',
  'Opening Stock [V]',
  'Inward Stock [Q]',
  'Inward Stock [V]',
  'Outward Stock [Q]',
  'Outward Stock [V]',
  'Closing Stock [Q]',
  'Closing Stock [V]',
  'Shrinkage [Q]',
  'Shrinkage [V]',
];
export const searchExpiryDateContions: string[] = [
  'All Columns',
  'Branch',
  'ID',
  'Product',
  'Class',
  'Quantity',
  'Expiry Date',
  'Days',
  'Serial No.',
  'Purchase Price',
  'Value',
];

export const searchSalesAgentTableConditions: string[] = ['All Columns', '*', 'Short Name', 'Name', 'Phone', 'Mail'];

export const searchBankTableConditions: string[] = [
  'All Columns',
  'Id',
  'Name',
  'Address',
  'Phone Number',
  'E-mail',
  'Comments',
];

export const searchUsersTableConditions: string[] = [
  'All columns',
  'ID',
  'Username',
  'Full name',
  'Branch',
  'Email',
  'Phone',
  'Status',
  'Permissions',
];
export const searchProductGroupTableConditions: string[] = ['All Columns', 'Short Name', 'Name', 'Comment'];

export const searchInvoiceTableConditions: string[] = [
  'All Text Columns',
  'Invoice No',
  'Vender',
  'Currency',
  'Operation',
  'Introduced',
  'Approved',
];

export const searchTransactionDataTableConditions: string[] = [
  'All columns',
  'Billing date',
  'Sale Approval',
  'Branch',
  'Employee',
  'Product id',
  'Product name',
  'Latin Name',
  'Stength',
  'Pack size',
  'Country',
  'Class',
  'Manufacturer',
  'Unit',
  'EAN',
  'Department',
  'Category',
  'Condition',
  'Seria',
  'Expiry date',
  'QTY (Packs)',
  'Seliing Value',
  'Purchase value',
  'Discount',
  'Institutional',
  'Adjustment Type',
  'Buffer',
  'Transaction Number',
  'In stock',
  'Vendor',
  'Invoice',
];

export const salesAgentTableRows: string[] = ['1', '5', '10', '15', '20', '25', '50', '100', '1000', 'All'];
export const bankTableRows: string[] = ['1', '5', '10', '15', '20', '25', '50', '100', '1000', 'All'];
export const productsPurchasedRows: string[] = ['1', '5', '10', '15', '20', '25', '50', '100', '1000', 'All'];
export const stockAtHandTableRows: string[] = ['1', '5', '10', '15', '20', '25', '50', '100', '1000'];

export const productActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];
export const CustomerActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  { name: 'Chart', icon: IoBarChartOutline },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Help', icon: TfiHelpAlt },
];

export const salesAgentActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const transactionDataActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const bankActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];

export const productGroupActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  { name: 'Chart', icon: IoBarChartOutline },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];
export const invoiceActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  { name: 'Chart', icon: IoBarChartOutline },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];
export const createInternalPOActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  { name: 'Chart', icon: IoBarChartOutline },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];
export const internationalPOHistoryActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  { name: 'Chart', icon: IoBarChartOutline },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];
export const createPOActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  { name: 'Chart', icon: IoBarChartOutline },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];
export const POToVendorsActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  { name: 'Chart', icon: IoBarChartOutline },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];

export const bufferReportActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const stockAtHandActions: ActionsIntertface[] = [
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Pivot Sort', icon: LiaSortSolid },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];

export const agingByExpiryActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const listOfProductsPurchasedActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const productAuditActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const expiryDateActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const paymentVoucherActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];

export const medicineRefundedActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Compute', icon: PiComputerTowerLight },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const SalesRevenueDrugsActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Compute', icon: PiComputerTowerLight },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];
export const SalesEmployeeActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Compute', icon: PiComputerTowerLight },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Group By',
    icon: AiOutlineGroup,
  },
  {
    name: 'Pivot',
    icon: MdOutlinePivotTableChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Reset', icon: MdOutlineResetTv },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Subscription', icon: IoMailOutline },

  { name: 'Help', icon: TfiHelpAlt },
];

export const cycleCountActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];
export const specialOfferActions: ActionsIntertface[] = [
  { name: 'Columns', icon: CiViewColumn },
  { name: 'Filter', icon: CiFilter },
  {
    name: 'Data',
    icon: SiDatabricks,
    children: [
      { name: 'Sort', icon: LiaSortSolid },
      { name: 'Aggregate', icon: TbSum },
      { name: 'Refresh', icon: FiRefreshCw },
      { name: 'Fashback', icon: GiBackwardTime },
    ],
  },
  {
    name: 'Format',
    icon: TiSpannerOutline,
    children: [
      { name: 'Control', icon: RiRemoteControlLine },
      { name: 'Highlight', icon: IoStarOutline },
      { name: 'Stretch Column Widths', icon: MdOutlineCheck },
    ],
  },
  {
    name: 'Selection',
    icon: PiSelectionAllLight,
    children: [
      { name: 'Cell Selection', icon: AiOutlineMergeCells },
      { name: 'Copy To clipboard', icon: MdContentCopy },
      { name: 'Refresh Rows', icon: FiRefreshCw },
    ],
  },
  {
    name: 'Chart',
    icon: AiOutlineBarChart,
  },
  {
    name: 'Report',
    icon: IoBookmarkOutline,
    children: [
      { name: 'Save', icon: IoSaveOutline },
      { name: 'Save As', icon: VscSaveAs },
      { name: 'Edit', icon: FiEdit },
      { name: 'Delete', icon: RiDeleteBinLine },
    ],
  },
  { name: 'Download', icon: MdOutlineFileDownload },
  { name: 'Help', icon: TfiHelpAlt },
];

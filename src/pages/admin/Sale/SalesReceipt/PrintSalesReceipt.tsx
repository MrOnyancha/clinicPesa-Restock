// import React from 'react';
// import { PaymentInfo, SelectedInventoryProduct } from './SalesReceipt';
// import escpos from 'escpos';
// interface ReceiptPreviewProps {
//   items: SelectedInventoryProduct[];
//   payments: PaymentInfo[];
//   total: number;
// }

// // // 1. Preview Component (React)
// // export const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ items, payments, total }) => {
// //   return (
// //     <>
// //       <div style={{ fontFamily: 'monospace', width: '80mm' }}>
// //         <h2>clinicPesa</h2>
// //         <p>Date: {new Date().toLocaleString()}</p>

// //         <h3>Payment Methods:</h3>
// //         {payments.map((p, i) => (
// //           <p key={i}>
// //             {p.modeOfPayment}: UGX {p.amountPaid.toLocaleString()}
// //           </p>
// //         ))}

// //         <table style={{ width: '100%' }}>
// //           <thead>
// //             <tr>
// //               <th>Item</th>
// //               <th>Qty</th>
// //               <th>Price</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {items.map((item, i) => (
// //               <tr key={i}>
// //                 <td>{item.itemName}</td>
// //                 <td>{item.quantitySold}</td>
// //                 <td>UGX {(item.customUnitPrice || item.salesPrice).toLocaleString()}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //         <h3>Total: UGX {total.toLocaleString()}</h3>
// //       </div>
// //     </>
// //   );
// // };

// // 2. Print Function
// export const printReceipt = async (items: any[], payments: PaymentInfo[], total: number) => {
//   try {
//     const device = new escpos.USB();
//     const printer = new escpos.Printer(device);

//     // Preview in console
//     console.log('----- RECEIPT PREVIEW -----');
//     console.log(`Date: ${new Date().toLocaleString()}`);
//     payments.forEach((p) => console.log(`${p.modeOfPayment}: UGX ${p.amountPaid}`));
//     items.forEach((item) =>
//       console.log(`${item.itemName} x${item.quantitySold} - UGX ${item.customUnitPrice || item.salesPrice}`),
//     );
//     console.log(`TOTAL: UGX ${total}`);
//     console.log('---------------------------');

//     // Actual printing
//     device.open();
//     printer
//       .align('CT')
//       .size(1, 1)
//       .text('clinicPesa\n')
//       .size(1, 1)
//       .text('Sales Receipt\n')
//       .text(new Date().toLocaleString() + '\n')
//       .align('LT')
//       .text('\nPayment Methods:\n');

//     payments.forEach((p) => printer.text(`${p.modeOfPayment}: UGX ${p.amountPaid}\n`));

//     printer.table([
//       // { text: 'Item', align: 'LEFT', width: 0.4 },
//       // { text: 'Qty', align: 'CENTER', width: 0.2 },
//       // { text: 'Price', align: 'RIGHT', width: 0.4 },
//       'Item',
//       'Qty',
//       'Price',
//     ]);

//     items.forEach((item) =>
//       printer.tableCustom([
//         {
//           text: item.itemName,
//           width: 0.4,
//           align: 'LEFT' as 'LEFT',
//         },
//         {
//           text: item.quantitySold.toString(),
//           width: 0.2,
//           align: 'CENTER' as 'CENTER',
//         },
//         {
//           text: `UGX ${item.customUnitPrice || item.salesPrice}`,
//           width: 0.4,
//           align: 'RIGHT' as 'RIGHT',
//         },
//       ]),
//     );

//     printer.align('RT').text(`TOTAL: UGX ${total}\n`).cut().close();
//   } catch (error) {
//     console.error('Print error:', error);
//     throw error;
//   }
// };

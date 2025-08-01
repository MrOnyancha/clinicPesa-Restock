import { useForm } from 'react-hook-form';
import { Button, Form, FormField, FormItem, FormLabel, FormMessage } from './components/ui'; // Adjust imports
import { IoAddCircleOutline, IoTrash } from 'react-icons/io5';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from './components/ui/table';
import { Checkbox, Input } from './components/ui/input';
import VendorComboBox from './VendorComboBox'; // Adjust path
import POComboBox from './POComboBox'; // Adjust path
import { useState } from 'react';
import { Loader } from './components/ui/loader'; // Adjust import
import { pdf } from '@react-pdf/renderer';
import PurchaseOrderPDF from './PurchaseOrderPDF'; // Adjust path to your PurchaseOrderPDF component
import { formatTimestamp } from '@/utils/formatter'; // Adjust import

const CreatePurchaseOrders = ({ vendorNames, inventoryAsPurchaseOrderProducts, data, isLoadingRequestOrders }) => {
  const form = useForm({
    defaultValues: {
      vendor: '',
    },
  });

  const [modifiedItems, setModifiedItems] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [submittedItems, setSubmittedItems] = useState({});
  const [openSiteDetails, setOpenSiteDetails] = useState({});
  const [selectedComboItem, setSelectedComboItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [sites, setSites] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Existing functions (simplified)
  const handleAccordionToggle = (orderId) => {
    // Your existing logic
  };

  const handleItemCheckboxChange = (orderId, itemName, checked) => {
    setCheckedItems((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [itemName]: checked },
    }));
  };

  const handleQuantityChange = (orderId, itemName, quantity) => {
    setModifiedItems((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [itemName]: { ...prev[orderId]?.[itemName], quantity } },
    }));
  };

  const handleRateChange = (orderId, itemName, rate) => {
    setModifiedItems((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [itemName]: { ...prev[orderId]?.[itemName], rate } },
    }));
  };

  const handleAddNewItem = () => {
    if (selectedComboItem) {
      setAddedItems((prev) => ({
        ...prev,
        [data.combinedOrders[0].combinedOrderId]: [
          ...(prev[data.combinedOrders[0].combinedOrderId] || []),
          { ...selectedComboItem, itemRef: { fullName: selectedComboItem.itemName } },
        ],
      }));
      setSelectedComboItem(null);
    }
  };

  const handleRemoveAddedItem = (orderId, index) => {
    setAddedItems((prev) => ({
      ...prev,
      [orderId]: prev[orderId].filter((_, i) => i !== index),
    }));
  };

  const toggleSiteDetails = (itemName) => {
    setOpenSiteDetails((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const handleCheckAvailability = (itemName) => {
    setSelectedItemName(itemName);
    setOpenModal(true);
    // Your existing logic
  };

  const calculateOrderTotals = (orderId) => {
    // Your existing logic
    return { totalItems: 0, totalAmount: 0 };
  };

  // New function to generate PDF
  const generatePDF = async () => {
    const vendor = form.getValues('vendor') || 'N/A';
    const currentOrder = data.combinedOrders[0]; // Using first order for simplicity
    const orderId = currentOrder.combinedOrderId;

    // Map items to PurchaseOrderPDF format
    const purchaseOrderLineRet = [
      ...currentOrder.combinedItems.map((item) => ({
        txnLineID: `${orderId}-${item.itemName}`,
        itemRef: { fullName: item.itemName },
        unitOfMeasure: item.unitOfMeasure,
        quantity: modifiedItems[orderId]?.[item.itemName]?.quantity || item.quantity,
      })),
      ...(addedItems[orderId] || []).map((item, index) => ({
        txnLineID: `${orderId}-added-${index}`,
        itemRef: { fullName: item.itemRef.fullName },
        unitOfMeasure: item.unitOfMeasure || 'N/A',
        quantity: item.quantity,
      })),
    ];

    // Create PurchaseOrder object
    const order = {
      txnID: orderId,
      timeCreated: Date.now(),
      timeModified: Date.now(),
      vendorRef: { fullName: vendor },
      expectedDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      purchaseOrderLineRet,
    };

    const facilityName = 'Your Facility Name'; // Replace with actual facility name or prop

    // Generate PDF
    try {
      const doc = pdf(<PurchaseOrderPDF order={order} facilityName={facilityName} />);
      const blob = await doc.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PurchaseOrder_${orderId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <TabsContent value="create-purchase-orders">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => console.log(data))} className="section">
          <div className="flex items-center gap-2 px-4 py-2">
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="text-xs text-nowrap">Vendor:</FormLabel>
                  <div>
                    <VendorComboBox
                      data={vendorNames}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button
              type="button"
              className="flex items-center gap-2"
              variant="secondary"
              onClick={() => dispatch(onOpenModal())}
            >
              Add New Vendor
              <span><IoAddCircleOutline /></span>
            </Button>
            <Button type="button" onClick={generatePDF} variant="outline">
              Generate PDF
            </Button>
          </div>
          <hr />
          <h4 className="section-heading pl-4 py-2">Create Purchase Order</h4>
          <div className="my-4 w-full mx-2 border dark:border-slate-700">
            {isLoadingRequestOrders ? (
              <div className="w-full flex justify-center items-center py-8">
                <div className="flex gap-2 items-center">
                  <Loader color="text-primary" />
                  <p className="text-sm text-slate-500">Loading orders, please wait...</p>
                </div>
              </div>
            ) : data?.combinedOrders?.length > 0 ? (
              data.combinedOrders
                .slice()
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((requestOrder, index) => (
                  <Accordion key={index + requestOrder.combinedOrderId} type="single" collapsible className="my-0">
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger
                        showIcon={false}
                        className="hover:bg-primary hover:text-white border-b last:border-b-0 border-slate-200 group"
                        onClick={() => handleAccordionToggle(requestOrder.combinedOrderId)}
                      >
                        <div className="px-4 w-full flex items-center gap-2">
                          <div className="w-1/4 text-left px-6">
                            <span className="text-xs">{requestOrder.combinedOrderId.slice(0, 9)}</span>
                          </div>
                          <div className="w-1/4 flex items-center justify-center">
                            <span className="text-xs">{requestOrder.totalOrdersCombined}</span>
                          </div>
                          <div className="w-1/4 text-left flex items-center justify-center">
                            <span className="text-xs">
                              {new Date(requestOrder.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="flex items-center justify-between">Item Name</TableHead>
                              <TableHead className="text-left">Requested Quantities</TableHead>
                              <TableHead className="text-left">Quantity</TableHead>
                              <TableHead className="text-left">U/M</TableHead>
                              <TableHead className="text-left">Requested Quantities By Site</TableHead>
                              <TableHead className="text-left">Check Availability</TableHead>
                              <TableHead className="text-left">Rate</TableHead>
                              <TableHead className="text-left">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {requestOrder.combinedItems.map((item) => {
                              const modifiedItem = modifiedItems[requestOrder.combinedOrderId]?.[item.itemName];
                              const quantity = modifiedItem?.quantity || item.quantity;
                              const rate = modifiedItem?.rate || item.rate;
                              const isChecked = checkedItems[requestOrder.combinedOrderId]?.[item.itemName] || false;
                              const isItemSubmitted =
                                submittedItems[requestOrder.combinedOrderId]?.[item.itemName] || false;

                              return (
                                <TableRow
                                  key={item.itemName}
                                  className={`group ${isItemSubmitted ? 'bg-green-50/30 dark:bg-green-950/20' : 'bg-blue-50 dark:bg-blue-950/20'}`}
                                >
                                  <TableCell className="text-left">
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) =>
                                        handleItemCheckboxChange(requestOrder.combinedOrderId, item.itemName, checked)
                                      }
                                      disabled={isItemSubmitted}
                                    />
                                    <span className="px-2">{item.itemName}</span>
                                  </TableCell>
                                  <TableCell className="border px-3 py-2 align-center">{item.totalQuantity}</TableCell>
                                  <TableCell className="text-center">
                                    <Input
                                      value={quantity}
                                      className="w-[100px] text-xs"
                                      disabled={isItemSubmitted}
                                      onChange={(e) =>
                                        handleQuantityChange(requestOrder.combinedOrderId, item.itemName, Number(e.target.value))
                                      }
                                    />
                                  </TableCell>
                                  <TableCell className="text-left">{item.unitOfMeasure}</TableCell>
                                  <TableCell
                                    className="border px-3 py-2 align-top cursor-pointer"
                                    onClick={() => toggleSiteDetails(item.itemName)}
                                  >
                                    <span>{openSiteDetails[item.itemName] ? '▼' : '▶'} Site Quantities</span>
                                    {openSiteDetails[item.itemName] && (
                                      <Table className="w-full text-xs border border-gray-300 rounded mt-2">
                                        <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                          <TableRow>
                                            <TableHead className="text-left px-2 py-1 border-b border-gray-300">Site</TableHead>
                                            <TableHead className="text-left px-2 py-1 border-b border-gray-300">Quantity</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {Object.entries(item.siteQuantities).map(([site, qty], i) => (
                                            <TableRow key={i}>
                                              <TableCell className="px-2 py-1 border-t border-gray-200">{site}</TableCell>
                                              <TableCell className="px-2 py-1 border-t border-gray-200">{qty != null ? String(qty) : ''}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    )}
                                  </TableCell>
                                  <TableCell className="border px-3 py-2 align-top">
                                    <Button onClick={() => handleCheckAvailability(item.itemName)}>
                                      Check Availability
                                    </Button>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <Input
                                      value={rate}
                                      className="w-[100px] text-xs"
                                      disabled={isItemSubmitted}
                                      onChange={(e) =>
                                        handleRateChange(requestOrder.combinedOrderId, item.itemName, Number(e.target.value))
                                      }
                                    />
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {((Number(rate) || 0) * (Number(quantity) || 0)).toLocaleString('en-US', {
                                      style: 'currency',
                                      currency: 'UGX',
                                    })}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                            {addedItems[requestOrder.combinedOrderId]?.length > 0 && (
                              <>
                                <TableRow>
                                  <TableCell colSpan={5} className="text-left font-medium py-2 bg-slate-100">
                                    Additional Items
                                  </TableCell>
                                </TableRow>
                                {addedItems[requestOrder.combinedOrderId].map((item, index) => {
                                  const itemKey = `added-${index}`;
                                  const isItemSubmitted = submittedItems[requestOrder.combinedOrderId]?.[itemKey] || false;

                                  return (
                                    <TableRow
                                      key={`added-${index}`}
                                      className={isItemSubmitted ? 'bg-green-50/30 dark:bg-green-950/20' : ''}
                                    >
                                      <TableCell className="text-left">
                                        <span>{item.itemRef.fullName}</span>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Input
                                          value={item.quantity}
                                          disabled={isItemSubmitted}
                                          className="w-[100px] text-xs"
                                          onChange={(e) => {
                                            if (!isItemSubmitted) {
                                              const newQuantity = Number(e.target.value);
                                              const updatedItems = [...(addedItems[requestOrder.combinedOrderId] || [])];
                                              updatedItems[index] = {
                                                ...updatedItems[index],
                                                quantity: newQuantity,
                                              };
                                              setAddedItems((prev) => ({
                                                ...prev,
                                                [requestOrder.combinedOrderId]: updatedItems,
                                              }));
                                            }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell className="text-center">
                                        <Input
                                          value={item.rate}
                                          className="w-[100px] text-xs"
                                          disabled={isItemSubmitted}
                                          onChange={(e) => {
                                            if (!isItemSubmitted) {
                                              const newRate = Number(e.target.value);
                                              const updatedItems = [...(addedItems[requestOrder.combinedOrderId] || [])];
                                              updatedItems[index] = {
                                                ...updatedItems[index],
                                                rate: newRate,
                                              };
                                              setAddedItems((prev) => ({
                                                ...prev,
                                                [requestOrder.combinedOrderId]: updatedItems,
                                              }));
                                            }
                                          }}
                                        />
                                      </TableCell>
                                      <TableCell className="flex items-center gap-2">
                                        {(item.quantity * item.rate).toLocaleString('en-US', {
                                          style: 'currency',
                                          currency: 'UGX',
                                        })}
                                        {!isItemSubmitted && (
                                          <IoTrash
                                            onClick={() => handleRemoveAddedItem(requestOrder.combinedOrderId, index)}
                                            className="text-red-500 cursor-pointer hover:text-red-600 hover:bg-red-100"
                                          />
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </>
                            )}
                            <POComboBox
                              data={inventoryAsPurchaseOrderProducts}
                              selectedItem={selectedComboItem}
                              onItemSelect={(item) => setSelectedComboItem(item)}
                              onAmountChange={(amount) => console.log('Amount changed:', amount)}
                              onQuantityChange={(quantity) => {
                                if (selectedComboItem) {
                                  setSelectedComboItem({ ...selectedComboItem, quantity });
                                }
                              }}
                              onRateChange={(rate) => {
                                if (selectedComboItem) {
                                  setSelectedComboItem({ ...selectedComboItem, rate });
                                }
                              }}
                            />
                            {selectedComboItem && (
                              <TableRow>
                                <TableCell colSpan={5} className="text-right">
                                  <Button variant="outline" size="sm" onClick={handleAddNewItem}>
                                    Add Item to Purchase Order
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                          {openModal && (
                            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="bg-white rounded shadow-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
                                <h2 className="text-lg font-semibold mb-2">Availability for {selectedItemName}</h2>
                                {sites.length === 0 ? (
                                  <p>No site availability found.</p>
                                ) : (
                                  <Table className="w-full text-sm border-collapse border border-gray-300">
                                    <TableHeader className="bg-gray-100">
                                      <TableRow>
                                        <TableHead className="border border-gray-300 px-3 py-2 text-left">Site Name</TableHead>
                                        <TableHead className="border border-gray-300 px-3 py-2 text-left">Site ID</TableHead>
                                        <TableHead className="border border-gray-300 px-3 py-2 text-left">Quantity Onsite</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {sites.map((site, idx) => (
                                        <TableRow key={idx} className="odd:bg-white even:bg-gray-50">
                                          <TableCell className="border border-gray-300 px-3 py-2">{site.siteName}</TableCell>
                                          <TableCell className="border border-gray-300 px-3 py-2">{site.siteId}</TableCell>
                                          <TableCell className="border border-gray-300 px-3 py-2">{site.quantityOnsite}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                )}
                                <div className="text-right mt-4">
                                  <Button onClick={() => setOpenModal(false)}>Close</Button>
                                </div>
                              </div>
                            </div>
                          )}
                          <TableFooter>
                            <TableRow>
                              <TableCell className="flex items-center gap-6">
                                <span>
                                  <span className="pr-2 font-medium">Total Items Selected:</span>
                                  {calculateOrderTotals(requestOrder.combinedOrderId).totalItems}
                                </span>
                                <span>
                                  <span className="pr-2 font-medium">Total Amount:</span>
                                  {calculateOrderTotals(requestOrder.combinedOrderId).totalAmount.toLocaleString(
                                    'en-US',
                                    { style: 'currency', currency: 'UGX' }
                                  )}
                                </span>
                              </TableCell>
                              <TableCell colSpan={4} className="text-right">
                                <Button type="button" onClick={form.handleSubmit((data) => console.log(data))} disabled={isSubmitting}>
                                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
            ) : (
              <div className="flex items-center justify-center py-4">No Request Orders Found</div>
            )}
          </div>
        </form>
      </Form>
    </TabsContent>
  );
};

export default CreatePurchaseOrders;


<xaiArtifact artifact_id="fc42284f-edf5-4038-888d-08b0633235c1" artifact_version_id="aa5d152f-f5e1-456d-88cb-1e7f4699132a" title="PurchaseOrderPDF Component" contentType="text/jsx">
```jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatTimestamp } from '@/utils/formatter';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: '#ffffff',
  },
  section: {
    margin: 10,
    padding: 8,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  subheader: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: 'semibold',
  },
  orderInfo: {
    marginBottom: 15,
    padding: 8,
    borderBottom: '1px solid #ccc',
  },
  orderInfoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  orderInfoLabel: {
    width: 120,
    fontWeight: 'bold',
    fontSize: 9,
  },
  orderInfoValue: {
    flex: 1,
    fontSize: 9,
  },
  table: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 20,
    fontWeight: 'normal',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
    fontWeight: 'semibold',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    fontSize: 9,
    whiteSpace: 'nowrap',
  },
  tableColItem: {
    width: '80%',
    textAlign: 'left',
    padding: 5,
    fontSize: 9,
  },
  tableColUm: {
    width: '10%',
    textAlign: 'center',
    padding: 5,
    fontSize: 9,
  },
  tableColQty: {
    width: '10%',
    textAlign: 'right',
    padding: 5,
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

// Define interfaces for prop types
interface PurchaseOrderLineItem {
  txnLineID: string;
  itemRef: {
    fullName: string;
  };
  unitOfMeasure: string;
  quantity: string | number;
}

interface PurchaseOrder {
  txnID: string;
  timeCreated: number;
  timeModified: number;
  vendorRef: {
    fullName: string;
  };
  expectedDate: number;
  purchaseOrderLineRet?: PurchaseOrderLineItem[];
}

interface PurchaseOrderPDFProps {
  order: PurchaseOrder;
  facilityName: string;
}

const PurchaseOrderPDF: React.FC<PurchaseOrderPDFProps> = ({ order, facilityName }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Purchase Order</Text>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order ID:</Text>
            <Text style={styles.orderInfoValue}>{order.txnID}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Facility:</Text>
            <Text style={styles.orderInfoValue}>{facilityName}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Vendor:</Text>
            <Text style={styles.orderInfoValue}>{order.vendorRef.fullName}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Created:</Text>
            <Text style={styles.orderInfoValue}>{formatTimestamp(order.timeCreated)}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Expected Date:</Text>
            <Text style={styles.orderInfoValue}>{formatTimestamp(order.expectedDate)}</Text>
          </View>
        </View>

        <View style={styles.subheader}>
          <Text>Order Items ({order.purchaseOrderLineRet?.length || 0})</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableColItem}>Item</Text>
            <Text style={styles.tableColUm}>U/M</Text>
            <Text style={styles.tableColQty}>Qty</Text>
          </View>

          {/* Table Rows */}
          {order.purchaseOrderLineRet && order.purchaseOrderLineRet.length > 0 ? (
            order.purchaseOrderLineRet.map((item) => (
              <View style={styles.tableRow} key={item.txnLineID}>
                <Text style={styles.tableColItem}>{item.itemRef.fullName}</Text>
                <Text style={styles.tableColUm}>{item.unitOfMeasure}</Text>
                <Text style={styles.tableColQty}>{item.quantity}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tableColItem, textAlign: 'center', width: '100%' }}>No products found</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text>
            Generated on {new Date().toLocaleDateString('en-US', { timeZone: 'Africa/Nairobi' })} at{' '}
            {new Date().toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi' })}
          </Text>
          <Text>ClinicPesa Restocking System</Text>
        </View>
      </Page>
    </Document>
  );
};

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Loader, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components";
import { useFetchSites } from "@/utils/useFetchSites";
import React, { useEffect, useState } from "react";
import { Ordery, useFetchOrdersByStatus } from "../../../../utils/useFetchOrders";
import { format } from 'date-fns';
import NotesCell from "../RequestOrder/NoteCell";
import { useAddItemNote } from "../../../../utils/useAddItemNote";
import NoteModal from "../RequestOrder/NoteModule";
import { useSearchInventory, SearchInventoryPayload } from "@/utils/useSearchInventory";
import { useUpdateProductItemStatus } from "../../../../utils/useOrderMutations";
import { toast } from "sonner";
import { first } from "lodash";
import { WebService } from "@/web-services/WebService";

type Site = { siteName: string; siteId: string };

type InventoryItem = {
  name: string;
  fullName: string;
  unitOfMeasure: string;
  description: string;
  quantityOnHand: number;
  batchNumber: string;
  itemId: string;
};

type SelectedItem = InventoryItem & { quantity: number };

const Transfer = () => {
  const [sites, setSites] = useState<any[]>([]);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ itemName: string; orderId: string } | null>(null);
  // const [isTableVisible, setIsTableVisible] = useState(true); // New state for table visibility
  const addItemNoteMutation = useAddItemNote();
  const dispenserName = localStorage.getItem('firstName');
  const { mutate: fetchSites, isPending: isSitesPending, isError: isSitesError } = useFetchSites();
  const { data: readyOrders, isLoading: isOrdersLoading, isError: isOrdersError } = useFetchOrdersByStatus("READY");
  const { mutate: updateProductItemStatus } = useUpdateProductItemStatus();
  const searchInventoryMutation = useSearchInventory();
  const [activeItemForSearch, setActiveItemForSearch] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: number }>({});
  const firstName = localStorage.getItem("firstName");
  const phoneNumer = localStorage.getItem("account_id");
  const [selectedUnits, setSelectedUnits] = useState({});

  // Fetch sites and set state
  const handleFetchSites = () => {
    fetchSites(undefined, {
      onSuccess: (data) => {
        setSites(data);
        console.log("Fetched Sites:", data);
      },
    });
  };

  useEffect(() => {
    if (readyOrders) {
      console.log("READY Orders:", readyOrders);
    }
  }, [readyOrders]);

  useEffect(() => {
    handleFetchSites();
  }, []);

  const handleItemStatusChange = async (newStatus: string, order: Ordery) => {
    for (const item of order.items) {
      console.log(`Updating item:`, item.itemName);
      try {
        await updateProductItemStatus({
          orderId: order.orderId,
          item: {
            itemName: item.itemName,
            listID: item.listID,
            orderItemStatus: newStatus,
          },
        });
        toast.success(`Item ${item.itemName} updated successfully.`);
      } catch (error) {
        console.error(`Failed to update item ${item.itemName}:`, error);
      }
    }
  };

  const handleNoteSubmit = (comment: string) => {
    if (!selectedItem) return;

    addItemNoteMutation.mutate({
      requestType: 'ADD_R_NOTES',
      orderId: selectedItem.orderId,
      items: [
        {
          itemName: selectedItem.itemName,
          notes: [
            {
              comment,
              commentBy: dispenserName,
            },
          ],
        },
      ],
    }, {
      onSuccess: (data) => {
        toast.success('✅ Note added successfully:');
        setNoteModalOpen(false);
      },
      onError: (error) => {
        console.error('❌ Error adding note:', error);
      }
    });
  };

  function handleTransferFromChange(value: string): void {
    throw new Error("Function not implemented.");
  }

  function handleAddProduct(itemName: string): void {
    console.log("Selected Item Name:", itemName);
    const payload: SearchInventoryPayload = {
      request: "I_SEARCH",
      itemName,
      sites: [{
        siteName: "clinicPesa HQ",
        siteId: "100005",
      }],
    };

    setActiveItemForSearch(itemName);
    searchInventoryMutation.mutate(payload, {
      onSuccess: (data) => {
        console.log("🔍 Inventory Search Result:", data);
      },
      onError: (error) => {
        console.error("❌ Inventory Search Failed:", error);
      },
    });
  }

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    item: any
  ) => {
    const isChecked = e.target.checked;
    const requestedQty = quantityInputs[item.itemId] || 1;

    if (!isChecked) {
      setSelectedItems((prev) =>
        prev.filter((i) => i.itemId !== item.itemId)
      );
      return;
    }

    const batches = item.batches || [];
    let qtyLeft = requestedQty;
    const allocations: any[] = [];

    for (const batch of batches) {
      if (batch.quantity <= 0) continue;

      const usedQty = Math.min(batch.quantity, qtyLeft);
      allocations.push({
        itemId: item.itemId,
        itemName: item.itemName,
        batchNo: batch.batchNo,
        expiryDate: batch.expiryDate,
        unitOfMeasure: item.unitOfMeasure,
        quantitySend: usedQty,
      });

      qtyLeft -= usedQty;
      if (qtyLeft <= 0) break;
    }

    if (qtyLeft > 0) {
      toast.error(`Not enough quantity in batches for "${item.itemName}".`);
      return;
    }

    setSelectedItems((prev) => [...prev, ...allocations]);
  };

  const handleTransfer = async () => {
    const receiver = readyOrders?.[0];

    if (!receiver) {
      console.error("No receiver found in readyOrders");
      return;
    }

    const payload = {
      request: "TRANSFER",
      dispenser: {
        name: firstName,
        accountId: phoneNumer
      },
      transferItems: selectedItems,
      senderSite: "clinicPesa HQ",
      senderId: "100005",
      receiverSite: receiver.name,
      receiverId: receiver.tillNo,
      personTransferring: firstName
    };

    try {
      const response = await WebService.postPharma("transfer", payload);

      const result = await response.json();
      console.log("✅ Transfer success:", result);
      // setIsTableVisible(false); // Hide the table on successful transfer
      toast.success("Transfer completed successfully!");
    } catch (error) {
      console.error("❌ Transfer failed:", error);
      toast.error("Transfer failed. Please try again.");
    }
  };

  function convertQuantitySmart(quantityInBase, unitsOfMeasure, selectedUnitQty) {
    if (!quantityInBase || quantityInBase <= 0) return "N/A";

    // Sort units by descending sublevel (Box > Strip > Tablet)
    const sortedUnits = [...unitsOfMeasure].sort((a, b) => b.sublevel - a.sublevel);

    if (selectedUnitQty) {
      // Specific unit conversion (like only in Box or Strip)
      const selectedUnit = sortedUnits.find((u) => u.quantity === selectedUnitQty);
      if (!selectedUnit) return `${quantityInBase} ${sortedUnits.at(-1)?.fullName ?? "units"}`;
      const convertedQty = (quantityInBase / selectedUnitQty).toFixed(2);
      return `${convertedQty} ${selectedUnit.fullName}(s)`;
    }

    // Smart breakdown (Box, Strip, Tablet)
    let remaining = quantityInBase;
    const resultParts = [];

    for (const unit of sortedUnits) {
      const count = Math.floor(remaining / unit.quantity);
      if (count > 0) {
        resultParts.push(`${count} ${unit.fullName}${count > 1 ? 's' : ''}`);
        remaining %= unit.quantity;
      }
    }

    return resultParts.join(', ');
  }


  return (
    <React.Fragment>
      <div className="px-4 py-2">
        <h4 className="section-heading">Transfer</h4>

        <div className="my-4 mx-2 pb-2 border dark:border-slate-700">
          <div className="w-full px-4 flex items-center gap-2 py-3 border-b hidden lg:flex">
            <div className="w-1/4 text-left">
              <span className="text-sm sm:text-base font-semibold">R.O Number</span>
            </div>
            <div className="w-1/4 text-left">
              <span className="text-sm sm:text-base font-semibold">Facility Name</span>
            </div>
            <div className="w-1/4 text-left">
              <span className="text-sm sm:text-base font-semibold">Status</span>
            </div>
            <div className="w-1/4 text-left">
              <span className="text-sm sm:text-base font-semibold">Date of Creation</span>
            </div>
          </div>
          {isOrdersLoading ? (
            <div className="w-full flex justify-center items-center py-8">
              <div className="flex gap-2 items-center">
                <Loader color="text-primary" />
                <p className="text-sm sm:text-base text-slate-500">Loading orders, please wait...</p>
              </div>
            </div>
          ) : readyOrders && readyOrders.length > 0 ? (
            readyOrders.map((order) => (
              <Accordion key={order.orderId} type="single" collapsible className="my-0">
                <AccordionItem value={order.orderId}>
                  <AccordionTrigger
                    showIcon={false}
                    className="hover:bg-primary hover:text-white border-b last:border-b-0 border-slate-200 group"
                  >
                    <div className="px-4 w-full flex flex-col sm:flex-row items-start gap-4 sm:gap-6 py-3">
                      <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                        <span className="text-sm sm:text-base font-semibold block lg:hidden">R.O Number</span>
                        <div className="text-sm sm:text-base">{order.orderId.slice(0, 9)}</div>
                      </div>
                      <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                        <span className="text-sm sm:text-base font-semibold block lg:hidden">Facility Name</span>
                        <div className="text-sm sm:text-base">{order.facilityName}</div>
                      </div>
                      <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                        <span className="text-sm sm:text-base font-semibold block lg:hidden">Status</span>
                      </div>
                      <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                        <span className="text-sm sm:text-base font-semibold block lg:hidden">Date of Creation</span>
                        <div className="text-sm sm:text-base">{format(order.timeStamp, 'yyyy-MM-dd, hh:mm a')}</div>
                      </div>
                      <div className="w-full sm:w-1/4 text-left flex items-center justify-between">
                        <span className="text-sm sm:text-base font-semibold block lg:hidden">Created By</span>
                        <div className="text-sm sm:text-base">{order.dispenser?.name}</div>
                        <img
                          src="/images/pencil.png"
                          alt="edit"
                          className="h-6 opacity-100 cursor-pointer ml-2"
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 w-full flex flex-col sm:flex-row items-start gap-4 sm:gap-6 py-3">
                      <Table className="min-w-[600px] w-full text-sm sm:text-base bg-white">
                        <TableHeader>
                          <TableRow className="bg-gray-100">
                            <TableHead className="text-left">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  # <span> Products</span>
                                </div>
                              </div>
                            </TableHead>
                            <TableHead className="text-left">Quantity</TableHead>
                            <TableHead className="text-left">U/M</TableHead>
                            <TableHead className="text-left">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.items &&
                            order.items.map((product, index) => (
                              <React.Fragment key={index}>
                                <TableRow key={index} className="hover:bg-gray-50">
                                  <span>{index + 1 }</span> 
                                  <TableCell className="flex flex-col"> <span>{product?.itemName || '---'}</span></TableCell>
                                  <TableCell>{product?.quantity || '---'}</TableCell>
                                  <TableCell>{product?.unitOfMeasure?.[0] || '---'}</TableCell>
                                  <TableCell>
                                    {order.orderStatus ? (
                                      <select
                                        value={product.orderItemStatus || ''}
                                        onChange={(e) => {
                                          const newStatus = e.target.value;
                                          if (newStatus === 'UNSUPPLIED') {
                                            setSelectedItem({ itemName: product.itemName, orderId: order.orderId });
                                            setNoteModalOpen(true);
                                          }
                                          handleItemStatusChange(newStatus, order);
                                        }}
                                        className="border rounded px-2 py-1"
                                      >
                                        <option value="">Select status</option>
                                        <option value="UNSUPPLIED">UNSUPPLIED</option>
                                        <option value="SUPPLIED">SUPPLIED</option>
                                      </select>
                                    ) : (
                                      product?.orderItemStatus || '---'
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      type="button"
                                      onClick={() => handleAddProduct(product.itemName)}
                                    >
                                      Find & Select Items
                                    </Button>
                                  </TableCell>
                                  <NotesCell product={product} />
                                </TableRow>
                                {activeItemForSearch === product.itemName &&
                                  searchInventoryMutation.data?.message?.length > 0 && (
                                    <TableRow>
                                      <TableCell colSpan={6} className="p-0">
                                        <div className="w-full mt-4 rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                                          <Table className="w-full text-sm">
                                            <TableHeader className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wide">
                                              <TableRow>
                                                <TableHead className="text-left px-6 py-3">Item</TableHead>
                                                <TableHead className="text-left px-6 py-3">Description</TableHead>
                                                <TableHead className="text-left px-6 py-3">U/M</TableHead>
                                                <TableHead className="text-center px-6 py-3 whitespace-nowrap">QTY on Hand</TableHead>
                                                <TableHead className="text-center px-6 py-3 whitespace-nowrap">QTY to Transfer</TableHead>

                                                <TableHead className="text-left px-6 py-3 whitespace-nowrap">LOT No.</TableHead>
                                                <TableHead className="text-left px-6 py-3 whitespace-nowrap">Expiration Date</TableHead>
                                                <TableHead className="text-left px-6 py-3">From</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <tbody>
                                              {searchInventoryMutation.data.message.map((item, idx) => {
                                                const selectedQty = selectedUnits[item.itemId]; // could be undefined
                                                const quantityOnsite = item.sites?.[0]?.quantityOnsite ?? 0;

                                                const displayQty = convertQuantitySmart(quantityOnsite, item.unitsOfMeasure || [], selectedQty);


                                                return (
                                                  <TableRow
                                                    key={item.itemId || idx}
                                                    className="even:bg-white odd:bg-slate-50 hover:bg-slate-100 transition-colors"
                                                  >
                                                    <TableCell className="px-6 py-3 font-medium text-gray-800 flex items-center gap-3">
                                                      <input
                                                        type="checkbox"
                                                        onChange={(e) => handleCheckboxChange(e, item)}
                                                      />
                                                      <span>{item.itemName}</span>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-3 text-gray-600">{item.description}</TableCell>
                                                    <TableCell className="px-6 py-3 text-gray-700 whitespace-nowrap">
                                                      <select
                                                        value={selectedUnits[item.itemId] ?? item.unitOfMeasure}
                                                        onChange={(e) => {
                                                          const selectedFullName = e.target.value;
                                                          setSelectedUnits((prev) => ({
                                                            ...prev,
                                                            [item.itemId]: selectedFullName,
                                                          }));
                                                        }}
                                                        className="border rounded px-2 py-1"
                                                      >
                                                        {(item.unisOfMeasure || []).map((unit) => (
                                                          <option key={unit.sublevel} value={unit.fullName}>
                                                            {unit.fullName}
                                                          </option>
                                                        ))}
                                                      </select>

                                                    </TableCell>
                                                    <TableCell className="text-center px-6 py-3 font-semibold text-gray-800">
                                                      {(() => {
                                                        const selectedUnitName = selectedUnits[item.itemId] ?? item.unitOfMeasure;
                                                        const totalQuantityOnsite = item.sites?.[0]?.quantityOnsite ?? 0;
                                                        const unit = (item.unisOfMeasure || []).find(u => u.fullName === selectedUnitName);

                                                        if (unit) {
                                                          const qty = Math.floor(totalQuantityOnsite / unit.quantity);
                                                          return qty;
                                                        }
                                                        return "N/A";
                                                      })()}
                                                    </TableCell>

                                                    <TableCell className="text-center px-6 py-3">
                                                      <input
                                                        type="number"
                                                        className="w-20 px-2 py-1 border rounded-md text-center border-gray-300 focus:border-blue-500 focus:outline-none"
                                                        value={quantityInputs[item.itemId] || 1}
                                                        min={1}
                                                        onChange={(e) => {
                                                          const qty = parseInt(e.target.value, 10);
                                                          setQuantityInputs((prev) => ({
                                                            ...prev,
                                                            [item.itemId]: qty
                                                          }));
                                                        }}
                                                      />
                                                    </TableCell>



                                                    <TableCell className="px-6 py-3 text-gray-700 whitespace-nowrap">
                                                      {item.batchNo}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-3 text-gray-700 whitespace-nowrap">
                                                      {item.expiryDate
                                                        ? new Date(item.expiryDate).toLocaleDateString()
                                                        : "N/A"}
                                                    </TableCell>
                                                    <TableCell className="px-6 py-3 text-gray-700">
                                                      {item.sites?.[0]?.siteName ?? "N/A"}
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              })}
                                            </tbody>
                                          </Table>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )}
                              </React.Fragment>
                            ))}
                        </TableBody>
                        <Button
                          onClick={handleTransfer}
                          className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-700 transition"
                        >
                          Submit Transfer
                        </Button>
                      </Table>
                      <NoteModal
                        open={noteModalOpen}
                        itemName={selectedItem?.itemName || ''}
                        onClose={() => setNoteModalOpen(false)}
                        onSubmit={handleNoteSubmit}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))
          ) : (
            <div className="w-full flex justify-center items-center py-12 border-b border-slate-200">
              <div className="flex flex-col items-center">
                <p className="text-sm sm:text-base font-semibold text-slate-600">No request orders found</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex justify-center items-center py-12">
          <p className="text-sm sm:text-base font-semibold text-slate-600">
            Transfer completed. Table is closed.
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 mt-2">
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Transfer;

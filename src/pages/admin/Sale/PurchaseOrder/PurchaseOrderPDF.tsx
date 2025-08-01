import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatTimestamp, formatCurrency } from '@/utils/formatter';

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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logo: {
    width: 130,
    height: 70,
    objectFit: 'contain',
    marginBottom: 10,
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
  totalRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#bfbfbf',
    borderTopStyle: 'solid',
    paddingTop: 5,
    paddingBottom: 5,
    fontWeight: 'semibold',
  },
  totalLabel: {
    width: '70%',
    textAlign: 'right',
    padding: 5,
    fontSize: 9,
  },
  totalValue: {
    width: '30%',
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
          <Image style={styles.logo} src="http://localhost:27017/images/pharm-2.png" />      
        </View>

          <Text>Purchase Order</Text>
        <View style={styles.orderInfo}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order ID:</Text>
            <Text style={styles.orderInfoValue}>{order.txnID}</Text>
          </View>
          {/* <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Facility:</Text>
            <Text style={styles.orderInfoValue}>{facilityName}</Text>
          </View> */}
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Vendor:</Text>
            <Text style={styles.orderInfoValue}>{order.vendorRef.fullName}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Created:</Text>
            <Text style={styles.orderInfoValue}>{formatTimestamp(order.timeCreated)}</Text>
          </View>
          {/* <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Expected Date:</Text>
            <Text style={styles.orderInfoValue}>{formatTimestamp(order.expectedDate)}</Text>
          </View> */}
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
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Text>
          <Text>ClinicPesa Restocking System</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PurchaseOrderPDF;

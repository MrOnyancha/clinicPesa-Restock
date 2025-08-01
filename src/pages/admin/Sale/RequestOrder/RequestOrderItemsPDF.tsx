import * as React from 'react';
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
    width: '60%',
    textAlign: 'left',
    padding: 5,
    fontSize: 9,
  },
  tableColUm: {
    width: '20%',
    textAlign: 'center',
    padding: 5,
    fontSize: 9,
  },
  tableColQty: {
    width: '20%',
    textAlign: 'center',
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
export interface OrderItem {
  itemId?: string;
  itemName: string;
  unitOfMeasure: string;
  quantity: number;
}

export interface Order {
  orderId: string;
  timeCreated?: number;
  facilityName?: string;
  items: OrderItem[];
}

interface RequestOrderItemsPDFProps {
  order: Order;
  selectedItems: OrderItem[];
  facilityName: string;
}

const RequestOrderItemsPDF: React.FC<RequestOrderItemsPDFProps> = ({ order, selectedItems, facilityName }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Request Order Items</Text>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Order ID:</Text>
            <Text style={styles.orderInfoValue}>{order.orderId}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Facility:</Text>
            <Text style={styles.orderInfoValue}>{facilityName}</Text>
          </View>
          {/* {order.dispenser && (
            <View style={styles.orderInfoRow}>
              <Text style={styles.orderInfoLabel}>Dispenser:</Text>
              <Text style={styles.orderInfoValue}>{order.dispenser.name}</Text>
            </View>
          )} */}

          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Created:</Text>
            <Text style={styles.orderInfoValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        <View style={styles.subheader}>
          <Text>Request Order Items ({selectedItems.length})</Text>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableColItem}>Item</Text>
            <Text style={styles.tableColUm}>U/M</Text>
            <Text style={styles.tableColQty}>Quantity</Text>
          </View>

          {/* Table Rows */}
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.tableColItem}>{item.itemName}</Text>
                <Text style={styles.tableColUm}>{item.unitOfMeasure}</Text>
                <Text style={styles.tableColQty}>{item.quantity}</Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tableColItem, textAlign: 'center', width: '100%' }}>No items selected</Text>
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

export default RequestOrderItemsPDF;

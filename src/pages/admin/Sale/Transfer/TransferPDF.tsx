import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatTimestamp, formatCurrency } from '@/utils/formatter';
import { TransferProduct } from './columns';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  addressLine: {
    fontSize: 10,
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  infoSection: {
    marginBottom: 15,
    padding: 8,
    borderBottom: '1px solid #ccc',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  infoLabel: {
    width: 120,
    fontWeight: 'bold',
    fontSize: 9,
  },
  infoValue: {
    flex: 1,
    fontSize: 9,
  },
  table: {
    display: 'flex',
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
    minHeight: 24,
    fontWeight: 'normal',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 28,
    fontWeight: 'semibold',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    fontSize: 9,
    whiteSpace: 'nowrap',
  },
  tableColItem: {
    width: '45%',
    textAlign: 'left',
    padding: 5,
    fontSize: 9,
  },
  tableColExpiry: {
    width: '10%',
    textAlign: 'center',
    padding: 5,
    textWrap: 'nowrap',
    fontSize: 9,
  },
  tableColQty: {
    width: '10%',
    textAlign: 'center',
    padding: 5,
    fontSize: 9,
  },
  tableColRate: {
    width: '15%',
    textAlign: 'right',
    padding: 5,
    fontSize: 9,
  },
  tableColAmount: {
    width: '20%',
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
    fontWeight: 'bold',
  },
  totalLabel: {
    width: '80%',
    textAlign: 'right',
    padding: 5,
  },
  totalValue: {
    width: '20%',
    textAlign: 'right',
    padding: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
});

interface TransferPDFProps {
  items: TransferProduct[];
  transferTo: string;
  transferDate: number | string;
}

const formatExpiryDate = (date: number | string | undefined) => {
  if (!date) return 'N/A';

  if (typeof date === 'number') {
    // Convert timestamp to Date object
    const dateObj = new Date(date);
    // Format as YYYY-MM-DD
    return dateObj.toISOString().split('T')[0];
  }

  // If it's a string, try to extract the date part
  if (typeof date === 'string') {
    // Try to extract just the date part if it contains a time portion
    const dateMatch = date.match(/^\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : date;
  }

  return String(date);
};

const TransferPDF: React.FC<TransferPDFProps> = ({ items, transferTo, transferDate }) => {
  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => {
    const rate = item.rate || 0;
    const quantity = item.TransferQty || 0;
    return sum + rate * Number(quantity);
  }, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CLINICPESA</Text>
          <Text style={styles.addressLine}>House 5 Buye, Mumbejja Close</Text>
          <Text style={styles.addressLine}>Ntinda-Kisaasi Road, Kampala</Text>
          <Text style={styles.addressLine}>00256 UG</Text>
          <Text style={styles.addressLine}>info@clinicpesa.com</Text>
        </View>

        {/* <Text style={styles.title}>Transfer Invoice</Text> */}

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice To:</Text>
            <Text style={styles.infoValue}>{transferTo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>
              {typeof transferDate === 'string' && transferDate.includes('T')
                ? transferDate.split('T')[0]
                : typeof transferDate === 'number'
                  ? new Date(transferDate).toISOString().split('T')[0]
                  : transferDate}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Items Count:</Text>
            <Text style={styles.infoValue}>{items.length}</Text>
          </View>
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableColItem}>Item</Text>
            <Text style={styles.tableColExpiry}>Expiry Date</Text>
            <Text style={styles.tableColQty}>Quantity</Text>
            <Text style={styles.tableColRate}>Rate</Text>
            <Text style={styles.tableColAmount}>Amount</Text>
          </View>

          {/* Table Rows */}
          {items.length > 0 ? (
            items.map((item) => {
              const rate = item.rate || 0;
              const quantity = item.TransferQty || 0;
              const amount = rate * Number(quantity);

              return (
                <View style={styles.tableRow} key={item.itemId}>
                  <Text style={styles.tableColItem}>{item.itemName}</Text>
                  <Text style={styles.tableColExpiry}>
                    {formatExpiryDate(item.selectedBatch?.expiryDate || item.expiryDate)}
                  </Text>
                  <Text style={styles.tableColQty}>{item.TransferQty}</Text>
                  <Text style={styles.tableColRate}>{formatCurrency(rate, false)}</Text>
                  <Text style={styles.tableColAmount}>{formatCurrency(amount)}</Text>
                </View>
              );
            })
          ) : (
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tableColItem, textAlign: 'center', width: '100%' }}>No items found</Text>
            </View>
          )}
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total: UGX</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
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

export default TransferPDF;

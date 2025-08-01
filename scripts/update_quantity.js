import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the data file
const dataPath = path.join(__dirname, '..', 'public', 'data', 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Function to calculate total quantity from LOT details
function calculateTotalQuantity(lotData) {
    if (!lotData || !lotData._text) return "0";
    
    // If _text is an array of LOT details
    if (Array.isArray(lotData._text)) {
        const total = lotData._text.reduce((sum, lot) => {
            return sum + parseInt(lot.quantityOnHand || "0", 10);
        }, 0);
        return total.toString();
    }
    
    // If it's a single LOT number or no LOT number
    return "0";
}

// Update inventory items
if (data.inventory) {
    data.inventory.forEach(item => {
        if (item.QBXML?.QBXMLMsgsRs?.ItemInventoryQueryRs?.ItemInventoryRet) {
            const items = item.QBXML.QBXMLMsgsRs.ItemInventoryQueryRs.ItemInventoryRet;
            items.forEach(product => {
                // Calculate total quantity from LOT details
                const totalQuantity = calculateTotalQuantity(product.LOTNumber);
                
                // Update QuantityOnHand
                if (!product.QuantityOnHand) {
                    product.QuantityOnHand = { _text: totalQuantity };
                } else {
                    product.QuantityOnHand._text = totalQuantity;
                }
            });
        }
    });
}

// Write the updated data back to the file
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log('Successfully updated QuantityOnHand for all inventory items.');

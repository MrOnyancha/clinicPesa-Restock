import React, { useState } from 'react';
import { 
  TableRow, 
  TableCell, 
  Input, 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from '@/components';

type AddedProduct = {
  id: string;
  fullName: string;
  quantity: number;
  status: string;
  listID?: string;
};

interface AddedProductRowProps {
  product: AddedProduct;
  onQuantityChange: (quantity: number) => void;
  onStatusChange: (status: string) => void;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
}

const AddedProductRow: React.FC<AddedProductRowProps> = ({
  product,
  onQuantityChange,
  onStatusChange,
  isSelected = false,
  onSelect
}) => {
  const [quantity, setQuantity] = useState<number>(product.quantity || 1);
  const [status, setStatus] = useState<string>(product.status || 'ADDED');
  const productStatuses = ['ADDED', 'PENDING', 'READY', 'UNSUPPLIED'];

  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <TableRow className="bg-blue-50">
      <TableCell>
        <div className="flex items-center">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
              className="mr-2"
            />
          )}
          <span className="text-blue-600 font-medium">{product.fullName}</span>
          <span className="ml-2 text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded">New</span>
        </div>
      </TableCell>
      <TableCell>
        <input
          type="number"
          className="w-20 h-8 text-xs"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          min={0}
        />
      </TableCell>
      <TableCell>---</TableCell>
      <TableCell>
        <Select
          value={status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {productStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
};

export default AddedProductRow;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Button } from '@/components';
import { cpApiUrl } from '@/services/httphandler/api';
import { WebService } from '@/web-services/WebService';

// Define the props for the RecordShiftSales component
interface RecordShiftSalesProps {
  isOpen: boolean;
  onClose: () => void;
  saleId: string;
}

// Define the form schema with validation
const formSchema = z.object({
  cosmetics: z.coerce.number().min(0, { message: 'Cosmetics sales must be a positive number' }).optional(),
  servedCustomers: z.coerce
    .number()
    .min(0, { message: 'Served customers must be a positive number' })
    .int({ message: 'Served customers must be a whole number' }),
  unservedCustomers: z.coerce
    .number()
    .min(0, { message: 'Unserved customers must be a positive number' })
    .int({ message: 'Unserved customers must be a whole number' }),
});

type FormValues = z.infer<typeof formSchema>;

const RecordShiftSales: React.FC<RecordShiftSalesProps> = ({ isOpen, onClose, saleId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cosmetics: 0,
      servedCustomers: 0,
      unservedCustomers: 0,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Recording shift sales...');

    try {
      // Prepare the request payload
      const payload = {
        request: 'RECORD_SALES',
        shiftSale: {
          cosmetics: data.cosmetics || 0,
          saleId: saleId,
          servedCustomers: data.servedCustomers,
          unservedCustomers: data.unservedCustomers,
        },
      };

      // Send the request
      const response = await WebService.postPharma('ads', payload);

      const result = await response.json();

      if (result.status === true) {
        toast.success('Shift sales recorded successfully');
        form.reset();
        onClose();
        localStorage.removeItem("shift_id");
      } else {
        toast.error(`Failed to record shift sales: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error recording shift sales:', error);
      toast.error('An error occurred while recording shift sales');
    } finally {
      setIsSubmitting(false);
      toast.dismiss(loadingToast);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center inset-0 bg-[#20212c72] dark:bg-[#20212cd9] z-50  opacity-100 transition-opacity duration-225 ease-in-out">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl relative">
        <h2 className="text-xl font-bold mb-4 text-center text-text-color">Record Shift Sales</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cosmetics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-color">Cosmetics Sales (UGX)</FormLabel>
                  <FormControl>
                    <Input
                      className="text-text-color"
                      placeholder="Enter cosmetics sales amount"
                      type="number"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="servedCustomers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-color">Served Customers</FormLabel>
                  <FormControl>
                    <Input
                      className="text-text-color"
                      placeholder="Enter number of served customers"
                      type="number"
                      min="0"
                      step="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unservedCustomers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-text-color">Unserved Customers</FormLabel>
                  <FormControl>
                    <Input
                      className="text-text-color"
                      placeholder="Enter number of unserved customers"
                      type="number"
                      min="0"
                      step="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Record Sales'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RecordShiftSales;

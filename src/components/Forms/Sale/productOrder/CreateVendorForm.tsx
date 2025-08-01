import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useModalDispatch } from '@/store/hooks';
import { onCloseModal } from '@/components/Modal/modalSlice';
import { WebService } from '@/web-services/WebService';

const CreateVendorForm: React.FC = () => {
  const modalDispatch = useModalDispatch();

  const formSchema = z.object({
    vendorName: z.string().min(1, { message: 'Name is required' }),
    phone: z.string().min(1, { message: 'Phone number is required' }),
    email: z.string().min(1, { message: 'Email is required' }),
    address: z.string().min(1, { message: 'Address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    postalCode: z.string().min(1, { message: 'Postal code is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
    note: z.string().min(1, { message: 'Note is required' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
      note: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const loadingToast = toast.loading('Creating vendor...', {
      description: 'Please wait while we create the vendor',
    });
    try {
      // Format the request body according to the required structure
      const requestBody = {
        requestType: 'CREATE_VENDOR',
        qbxmlMsgsRq: {
          _attr: {
            onError: 'stopOnError',
          },
          vendorAddRq: [
            {
              vendorAdd: {
                name: values.vendorName,
                vendorAddress: {
                  addr1: values.address,
                  city: values.city,
                  postalCode: values.postalCode,
                  country: values.country,
                  note: values.note,
                },
                phone: values.phone,
                email: values.email,
              },
            },
          ],
        },
      };

      // Send the request to the API
      console.log('Sending vendor creation request:', requestBody);
      const response = await WebService.postPharma('vendors', requestBody);

      if (response && response.status) {
        toast.dismiss(loadingToast);
        toast.success('Vendor created successfully');
        // Reset the form after successful submission
        form.reset();
        // Close the modal
        modalDispatch(onCloseModal());
      } else {
        toast.error('Failed to create vendor: ' + (response?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Vendor creation error', error);
      toast.error('Failed to create vendor. Please try again.');
    }
  }

  const handleCancel = () => {
    // Reset the form
    form.reset();
    // Close the modal
    modalDispatch(onCloseModal());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 min-w-[720px]">
        <FormField
          control={form.control}
          name="vendorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor Name</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <h6 className="text-lg font-semibold mb-2 mt-4">Vendor Address</h6>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="text" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-between my-3">
          <div className="flex items-center space-x-2">
            {/* <Checkbox id="vendor" />
            <label
              htmlFor="vendor"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Vendor is Inactive
            </label> */}
          </div>
          <div className="flex gap-3 items-center">
            <Button variant="danger" type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              Create
            </Button>
          </div>
        </div>
        <hr className="my-2" />
      </form>
    </Form>
  );
};

export default CreateVendorForm;

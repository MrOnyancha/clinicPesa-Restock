import { useMutation } from '@tanstack/react-query';
import { postQBXMLData } from '@/services/httphandler'; // adjust path as needed
import { ApiResponse } from '@/services/httphandler'; // adjust import path if needed
import { WebService } from '@/web-services/WebService';
import { toast } from 'sonner';
interface Note {
  comment: string;
  commentBy: string;
}

interface NoteItem {
  itemName: string;
  notes: Note[];
}

interface AddNoteRequest {
  requestType: 'ADD_R_NOTES';
  orderId: string;
  items: NoteItem[];
}

interface AddNoteResponseMessage {
  orderId: string;
  items: {
    itemName: string;
    notes: Note[];
  }[];
}

export const useAddItemNote = () => {
  return useMutation({
    mutationFn: async (data: AddNoteRequest): Promise<ApiResponse<AddNoteResponseMessage>> => {
      const response = await WebService.postPharma('requestOrder', data);
      return response;
    },
    onError: (error: any) => {
      // Check if error response has message array
      const messages = error?.response?.data?.message;
      
      if (Array.isArray(messages) && messages.length > 0) {
        messages.forEach((msg: string) => {
          toast.error(msg);
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });
};

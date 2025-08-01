import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { WebService } from '../web-services/WebService';
import { toast } from 'react-toastify';

interface VerifyResponseMessage {
  ava: boolean;
  flag: string;
  sms: string;
}

interface VerifyResponseData {
  status: boolean;
  message: VerifyResponseMessage;
}

interface VerifyResponse {
  status: number;
  data: VerifyResponseData;
}

interface VerifyPhoneParams {
  phoneNumber: string;
}

async function verifyPhoneNumber(phoneNumber: string): Promise<VerifyResponse> {
  const body = {
    recipient: `FRI:${phoneNumber}@clinicpesa.public.user.sp1/SP`,
    requestType: 'checkAccount',
    transactionId: '',
    pin: '',
  };
  

  const response = await WebService.userManagement('/auth', body, phoneNumber);

  if (response.status !== 200) {
    throw new Error('Failed to verify phone number');
  }

  return response;
}

export function handlePhoneNumberVerification({
  onSuccessVerify,
  onFailVerify,
}: VerifyPhoneParams & {
  onSuccessVerify: () => void;
  onFailVerify: (message: string) => void;
}): UseMutationResult<VerifyResponse, Error, string> {
  return useMutation<VerifyResponse, Error, string>({
    mutationFn: (phoneNumber) => verifyPhoneNumber(phoneNumber),
    onError: (error: Error) => {
      toast.error('An error occurred while verifying the phone number.');
      console.error('Phone verification error:', error);
    },
    onSuccess: (response: VerifyResponse) => {
      const message = response?.data?.message;

      if (response.status === 200 && response.data.status) {
        if (message.ava === true && message.flag === 'FALSE') {
          onSuccessVerify(); // Call the provided success callback
        } else if (message.ava === false && message.flag === 'FALSE') {
          const errorMessage = message.sms.includes('Proceed to register')
            ? 'Phone number not found. Please contact Admin or enter a registered phone number.'
            : message.sms;

          onFailVerify(errorMessage); // Call failure callback with message
        }
      } else {
        console.error('Phone verification failed. Response:', response);
        toast.error('Phone verification failed. Please try again.');
      }
    },
  });
}

import { WebService } from "@/web-services/WebService";

const startTimer = (phone: string, id: string) => {
    console.log(`Starting timer for phone: ${phone}, id: ${id}`);
    
    // Example logic: Check status every 30 seconds
    const interval = setInterval(async () => {
      const statusResponse = await WebService.userManagement("/getStatus", {
          pin: "",
          requestType: "",
          transactionId: ""
      }, phone);
      
      if (statusResponse.data.status) {
        console.log('Timer Stopped: PIN Set');
        clearInterval(interval);
      } else {
        console.log('Waiting for PIN setup...');
      }
    }, 30000); // Check every 30 seconds
  
    return interval;
  };
  
  export default startTimer;
  
import { toast } from "react-toastify";
import axiosInterceptor from "@/Interceptors/clinicPesaAuth.Interceptor";

// WebService class for API requests
export class WebService {
  static refreshNeeded = false;

  static lockscreen() {
    const current = localStorage.getItem("currentUser");
    if (current) {
      const currentUser = JSON.parse(current);
      currentUser.access_token = "new token";
      currentUser.lock = true;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      window.location.href = "/lock"; // Redirect user
    }
  }

  static logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("account_type");
    localStorage.removeItem("account_id");
    window.location.href = "/login";
  }

  static async register(facility: any) {
    return axiosInterceptor.post(`v1/account/pre_registration`, facility);
  }

  static async getUser(phoneNumber: string) {
    return axiosInterceptor.get(`v1/account/user/${phoneNumber}`, {
      headers: {
        "Content-Type": "application/xml",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Origin": "*",
      },
      responseType: "text",
    });
  }

  static async getTeamMembers() {
    return axiosInterceptor.get(`v1/team/getmyTeam`);
  }

  static async login(obj: { accountId: string; password: string }) {
    const id = obj.accountId;
    const token = "Basic " + btoa(`${obj.accountId}:${obj.password}`);
    return axiosInterceptor.post(`/auth`, {}, {
      headers: { Authorization: token, MSISDN: id },
    });
  }

  static async userManagement(acc: string, body: { requestType: string, transactionId: string, pin: string }, phone: string) {
    return axiosInterceptor.put(acc, body, {
      headers: { 'MSISDN': phone }
    });
  }

  // Inside WebService class
  static async postPharma(endpoint: string, body: any) {
    try {
      const url = `/api/pharma/${endpoint}`;
      const response = await axiosInterceptor.post(url, body);
      console.log(`POST ${url} response:`, response.data);
      WebService.notify("success", "Pharma data submitted successfully!", 0.9);
      return response.data;
    } catch (error: any) {
      console.error(`POST /api/pharma/${endpoint} error:`, error.response?.data || error.message);
      WebService.notify("error", "Failed to submit pharma data", 0.9);
      throw error;
    }
  }


  static async getPharma(endpoint: string, queryParams: Record<string, any> = {}) {
    try {
      const url = `/api/pharma/${endpoint}`;
      console.log(`🔍 Fetching data from: ${url}`);
      // Remove undefined or null query values (clean filter)
      const cleanParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v != null && v !== "")
      );

      // 🔍 Log the actual request
      console.log(`📤 GET Request → URL: ${url}`, "With Params:", cleanParams);

      const response = await axiosInterceptor.get(url, { params: cleanParams });

      console.log(`✅ GET ${url} response:`, response.data);
      WebService.notify("success", "Fetched pharma data successfully!", 0.9);

      return response.data;
    } catch (error: any) {
      console.error(`❌ GET /api/pharma/${endpoint} error:`, error.response?.data || error.message);
      WebService.notify("error", "Failed to fetch pharma data", 0.9);
      throw error;
    }
  }




  // userManagement(acc: string, action: string, transactionId: string, pin: string) {
  //   console.log("Here", acc, action, transactionId, pin);
  //   return axiosInterceptor.put(`/auth`, {
  //     recipient: `FRI:${acc}@clinicpesa.public.user.sp1/SP`,
  //     requestType: action,
  //     transactionId,
  //     pin,
  //   }, {
  //     headers: { MSISDN: acc },
  //   });
  // }

  static notify(type: "success" | "error" | "info" | "warning", message: string, opacity: number) {
    switch (type) {
      case "success":
        toast.success(message, { style: { opacity } });
        break;
      case "error":
        toast.error(message, { style: { opacity } });
        break;
      case "info":
        toast.info(message, { style: { opacity } });
        break;
      case "warning":
        toast.warn(message, { style: { opacity } });
        break;
    }
  }
}

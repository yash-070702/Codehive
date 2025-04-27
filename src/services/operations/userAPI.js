import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { userEndpoints } from "../apis";
import { logout } from "./authAPI";
import { setUser } from "@/slices/profileSlice";
const { DELETE_USER_API, UPDATE_PROFILE_API,UPDATE_PASSWORD_API,UPDATE_DISPLAYPICTURE_API } = userEndpoints;

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("DELETE", DELETE_USER_API, null, {
        Authorization: `Bearer ${token}`,
      });
      console.log("DELETE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Profile Deleted Successfully");
      dispatch(logout(navigate));
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error);
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
  };
}

export function updateProfile(token, formData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      console.log("mai to andr aa gya hu");
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });

      console.log(response);

      console.log("UPDATE_PROFILE_API API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      console.log(response);

      dispatch(setUser({ ...response.data.user }));
      toast.success("Profile Updated Successfully");
      navigate("/profile");
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error);
      toast.error("Could Not Update Profile");
    }
    toast.dismiss(toastId);
  };
}

export async function changePassword(token, formData,navigate,setIsLoading) {
  setIsLoading(true)
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("PUT", UPDATE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
    navigate("/profile");
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId)
  setIsLoading(false)
}

export function updateDisplayPicture(token, formData,navigate,setLoading) {
  
  return async (dispatch) => {
    const toastId = toast.loading("Uploading...");
    setLoading(true)
    try {
      // console.log("Entering updateDisplayPicture function");
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAYPICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );
      console.log("API response received");
      console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Display Picture Updated Successfully");
      navigate("/profile");
      dispatch(setUser(response.data.data));
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API ERROR............", error);
      toast.error("Could Not Update Display Picture");
    } finally {
      toast.dismiss(toastId);
      setLoading(false)
    }
  };
}
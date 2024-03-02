import { useAppSelector } from "./hooks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers/users.slice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.userReducer);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      dispatch(setUser({ name: "", token: token, email: "" }));
    } else {
      dispatch(setUser(null));
    }
  }, []);

  return {
    user,
  };
};

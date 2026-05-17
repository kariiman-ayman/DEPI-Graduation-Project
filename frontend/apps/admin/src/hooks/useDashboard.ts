import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard.js";

export const useDashboard = () =>
  useQuery({ queryKey: ["admin-dashboard"], queryFn: getDashboard });

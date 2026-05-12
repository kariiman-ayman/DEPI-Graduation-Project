import { router } from "./routes";
import { RouterProvider } from "react-router";
import { queryClient } from "_core/lib/queryCLient";
import { QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

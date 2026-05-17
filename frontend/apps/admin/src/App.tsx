import { router } from "./routes";
import { RouterProvider } from "react-router";
import { queryClient } from "_core/lib/queryCLient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "_core/components/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

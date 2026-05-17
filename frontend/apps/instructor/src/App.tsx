import { RouterProvider } from "react-router";
import { router } from "./routes.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "_core/lib/queryCLient";
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

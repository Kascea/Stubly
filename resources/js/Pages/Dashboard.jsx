import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard(props) {
  return (
    <AppLayout>
      <Head title="Dashboard" />

      <div className="py-12">{/* ... content ... */}</div>
    </AppLayout>
  );
}

import React from "react";
import { Head } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Support() {
  return (
    <AppLayout>
      <Head title="Support" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h1 className="text-2xl font-semibold text-sky-900 mb-6">
                Need Help?
              </h1>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Contact Support
                  </h2>
                  <p className="mt-1 text-gray-600">
                    Having issues with your order? We're here to help!
                  </p>
                </div>

                {/* Add your support form or contact information here */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email us at: support@yourdomain.com
                  </p>
                  <p className="text-gray-700 mt-2">
                    Or call us at: (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

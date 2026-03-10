import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { format } from "date-fns";
import { Printer, Calendar } from "lucide-react";
import OfferLetterTemplate from "./OfferLetterTemplate";

const OfferLetterDialog = ({ isOpen, setIsOpen, employee }) => {
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    salary: "",
    joiningDate: "",
    probationPeriod: "6",
    date: new Date(),
  });

  const printRef = useRef();

  useEffect(() => {
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        name: `${employee.first_name} ${employee.last_name}`,
        designation: employee.designation || "",
        joiningDate: employee.joining_date
          ? new Date(employee.joining_date).toLocaleDateString()
          : "",
        date: new Date(),
      }));
    }
  }, [employee, isOpen]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Offer_Letter_${formData.name?.replace(/\s+/g, "_")}`,
  });

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] overflow-hidden p-0 bg-white border-0 shadow-2xl flex flex-col text-left [&>button]:!text-white [&>button]:top-5 [&>button]:right-5 [&>button]:focus:ring-0 [&>button]:focus:outline-none [&>button]:transition-all [&>button>svg]:w-6 [&>button>svg]:h-6 [&>button>svg]:stroke-[3]">
        <DialogHeader className="p-6 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shrink-0 !text-left">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <span className="hidden sm:inline">Generate </span> Offer Letter
          </DialogTitle>
          <p className="text-blue-50 text-sm mt-1 text-left">
            Review and edit details before generating the offer letter for{" "}
            <b>{formData.name}</b>.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Editor Form */}
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50 h-fit">
              <h3 className="font-semibold text-lg border-b pb-2">
                Edit Details
              </h3>

              <div className="grid gap-2">
                <Label htmlFor="name">Candidate Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="salary">Annual Salary (e.g. ₹ 5,00,000)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  placeholder="₹ 5,00,000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="joiningDate">Joining Date (Text)</Label>
                <Input
                  id="joiningDate"
                  value={formData.joiningDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joiningDate: e.target.value })
                  }
                  placeholder="e.g. 1st Feb 2026"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="probationPeriod">Probation Period (Months)</Label>
                <Input
                  id="probationPeriod"
                  value={formData.probationPeriod}
                  onChange={(e) =>
                    setFormData({ ...formData, probationPeriod: e.target.value })
                  }
                  type="number"
                />
              </div>

              <div className="grid gap-2">
                <Label>Date of Issue</Label>
                <div className="relative group">
                  {/* Visible Display Input (Formatted) */}
                  <Input
                    type="text"
                    readOnly
                    placeholder="DD-MM-YYYY"
                    value={formData.date ? format(formData.date, "dd-MM-yyyy") : ""}
                    className="h-10 pr-10 border-gray-300 text-gray-900 placeholder:text-gray-400 bg-white"
                  />

                  {/* Custom Icon */}
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none group-hover:text-[#3a5f9e] transition-colors" />

                  {/* Invisible Native Date Picker Layer */}
                  <Input
                    type="date"
                    id="dateOfIssue"
                    value={formData.date ? format(formData.date, "yyyy-MM-dd") : ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value ? new Date(e.target.value) : null,
                      })
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    style={{ colorScheme: 'light' }}
                    onClick={(e) => {
                      try {
                        if (e.target.showPicker) e.target.showPicker();
                      } catch (err) { }
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  className="w-full bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 hover:scale-[1.02] active:scale-95 font-semibold px-4 py-2"
                  onClick={handlePrint}
                >
                  <Printer className="mr-2 h-4 w-4" /> Print / Save as PDF
                </Button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="border shadow-sm rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center p-4">
              <div className="relative w-full h-[300px] flex justify-center">
                <div className="absolute top-0 scale-50 origin-top transform-gpu h-[600px] w-[800px] overflow-hidden bg-white shadow-2xl">
                  <div className="pointer-events-none select-none">
                    <OfferLetterTemplate data={formData} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Printable Component */}
          <div className="hidden">
            <OfferLetterTemplate ref={printRef} data={formData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferLetterDialog;

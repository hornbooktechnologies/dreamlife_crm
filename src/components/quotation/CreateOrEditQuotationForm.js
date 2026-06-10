import React, { useEffect, useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { requestHandler } from "../../lib/utils/network-client";
import useToast from "../../hooks/useToast";
import { Plus, Trash2, ArrowLeft, Printer, Save, Check } from "lucide-react";
import { convertNumberToWords } from "../../lib/utils/numberToWords";
import { QuotationPdfTemplate } from "./QuotationPdfTemplate";

export default function CreateOrEditQuotationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quotationData, setQuotationData] = useState(null);
  const pdfRef = useRef(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      client_name: "",
      phone: "",
      email: "",
      project_name: "",
      quotation_date: new Date().toISOString().split("T")[0],
      gst_percentage: 0,
      note: "In This Quotation Bathroom 3D Images Are Not Included.",
      status: "draft",
      civilWork: [{ description: "Layout", rate: 0, amount: 0 }],
      interior: [{ description: "2D Drawings", rate: 0, amount: 0 }],
    },
  });

  const {
    fields: civilFields,
    append: appendCivil,
    remove: removeCivil,
  } = useFieldArray({
    control,
    name: "civilWork",
  });

  const {
    fields: interiorFields,
    append: appendInterior,
    remove: removeInterior,
  } = useFieldArray({
    control,
    name: "interior",
  });

  // Fetch quotation data if editing
  useEffect(() => {
    if (id) {
      const fetchQuotation = async () => {
        setLoading(true);
        try {
          const res = await requestHandler(`/quotations/${id}`);
          if (res.success && res.data) {
            const q = res.data;
            const civilItems = q.items
              .filter((item) => item.section === "civil_work")
              .map((item) => ({
                description: item.description,
                rate: parseFloat(item.rate),
                amount: parseFloat(item.amount),
              }));
            const interiorItems = q.items
              .filter((item) => item.section === "interior")
              .map((item) => ({
                description: item.description,
                rate: parseFloat(item.rate),
                amount: parseFloat(item.amount),
              }));

            reset({
              client_name: q.client_name,
              phone: q.phone || "",
              email: q.email || "",
              project_name: q.project_name || "",
              quotation_date: q.quotation_date.split("T")[0],
              gst_percentage: parseFloat(q.gst_percentage || 0),
              note: q.note || "",
              status: q.status || "draft",
              civilWork: civilItems.length > 0 ? civilItems : [{ description: "", rate: 0, amount: 0 }],
              interior: interiorItems.length > 0 ? interiorItems : [{ description: "", rate: 0, amount: 0 }],
            });

            setQuotationData(q);
          } else {
            showErrorToast(res.message || "Failed to fetch quotation details");
          }
        } catch (error) {
          console.error(error);
          showErrorToast("Error loading quotation");
        } finally {
          setLoading(false);
        }
      };
      fetchQuotation();
    }
  }, [id, reset]);

  const watchCivil = watch("civilWork") || [];
  const watchInterior = watch("interior") || [];
  const watchGst = watch("gst_percentage") || 0;

  // Compute Subtotal, GST, and Total
  const subtotal = [...watchCivil, ...watchInterior].reduce(
    (sum, item) => sum + parseFloat(item?.amount || 0),
    0
  );
  const gstAmount = subtotal * (parseFloat(watchGst) / 100);
  const totalAmount = subtotal + gstAmount;

  // React to print triggers
  const handlePrint = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: `Quotation_${watch("client_name") || "Client"}`,
  });

  const onSubmit = async (data) => {
    try {
      const items = [
        ...data.civilWork.map((item, index) => ({
          section: "civil_work",
          description: item.description,
          rate: item.rate,
          amount: item.amount,
          sort_order: index,
        })),
        ...data.interior.map((item, index) => ({
          section: "interior",
          description: item.description,
          rate: item.rate,
          amount: item.amount,
          sort_order: index,
        })),
      ].filter((item) => item.description.trim() !== "");

      const body = {
        client_name: data.client_name,
        phone: data.phone,
        email: data.email,
        project_name: data.project_name,
        quotation_date: data.quotation_date,
        gst_percentage: parseFloat(data.gst_percentage || 0),
        note: data.note,
        status: data.status,
        items,
      };

      const url = id ? `/quotations/${id}` : "/quotations";
      const method = id ? "PUT" : "POST";

      const res = await requestHandler(url, {
        method,
        body,
      });

      if (res.success) {
        showSuccessToast(res.message || "Quotation saved successfully");
        if (!id && res.quotation) {
          // If created successfully, fetch full quotation with autogenerated QTN number to print it
          const detailRes = await requestHandler(`/quotations/${res.quotation.id}`);
          if (detailRes.success) {
            setQuotationData(detailRes.data);
            // Wait brief moment for DOM update, then navigate back
            setTimeout(() => {
              navigate("/quotation");
            }, 1000);
            return;
          }
        }
        navigate("/quotation");
      } else {
        showErrorToast(res.message || "Failed to save quotation");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Something went wrong");
    }
  };

  const syncPdfPreview = () => {
    const data = {
      quotation_number: quotationData?.quotation_number || 0,
      quotation_date: watch("quotation_date"),
      client_name: watch("client_name"),
      phone: watch("phone"),
      email: watch("email"),
      project_name: watch("project_name"),
      gst_percentage: watch("gst_percentage"),
      note: watch("note"),
      items: [
        ...watchCivil.map((item, index) => ({
          section: "civil_work",
          description: item.description,
          rate: item.rate,
          amount: item.amount,
          sort_order: index,
        })),
        ...watchInterior.map((item, index) => ({
          section: "interior",
          description: item.description,
          rate: item.rate,
          amount: item.amount,
          sort_order: index,
        })),
      ].filter((item) => item.description.trim() !== ""),
    };
    setQuotationData(data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/quotation")}
            className="rounded-full shadow-sm hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              {id ? "Edit Quotation" : "Create New Quotation"}
            </h1>
            <p className="text-slate-500 text-sm">
              Create professional quotations with breakdown for Civil and Interior works.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {quotationData && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                syncPdfPreview();
                setTimeout(() => handlePrint(), 200);
              }}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> Print PDF
            </Button>
          )}
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white"
          >
            {isSubmitting ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Quotation
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Input Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
          {/* Client Details Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Client & Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client_name" className="font-semibold text-slate-700">
                  Client Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="client_name"
                  placeholder="Enter client name"
                  {...register("client_name", { required: "Client name is required" })}
                  className="border-gray-200 focus:border-[#3a5f9e]"
                />
                {errors.client_name && (
                  <p className="text-red-500 text-xs">{errors.client_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quotation_date" className="font-semibold text-slate-700">
                  Quotation Date
                </Label>
                <Input
                  id="quotation_date"
                  type="date"
                  {...register("quotation_date")}
                  className="border-gray-200 focus:border-[#3a5f9e]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold text-slate-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  {...register("phone")}
                  className="border-gray-200 focus:border-[#3a5f9e]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  {...register("email")}
                  className="border-gray-200 focus:border-[#3a5f9e]"
                />
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="project_name" className="font-semibold text-slate-700">
                  Project Name
                </Label>
                <Input
                  id="project_name"
                  placeholder="Bungalow Consulting Project At..."
                  {...register("project_name")}
                  className="border-gray-200 focus:border-[#3a5f9e]"
                />
              </div>
            </div>
          </div>

          {/* Civil Work Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold text-slate-800">Civil Work Breakdown</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendCivil({ description: "", rate: 0, amount: 0 })}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary"
              >
                <Plus className="h-3.5 w-3.5" /> Add Row
              </Button>
            </div>

            <div className="space-y-3">
              {civilFields.map((field, index) => (
                <div key={field.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="flex-1 w-full space-y-1">
                    <Input
                      placeholder="Description (e.g. Layout, Plan)"
                      {...register(`civilWork.${index}.description`)}
                      className="border-gray-200 focus:border-[#3a5f9e] bg-white text-sm"
                    />
                  </div>
                  <div className="w-full md:w-32 space-y-1">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Rate"
                      {...register(`civilWork.${index}.rate`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setValue(`civilWork.${index}.amount`, val);
                        },
                      })}
                      className="border-gray-200 focus:border-[#3a5f9e] bg-white text-sm"
                    />
                  </div>
                  <div className="w-full md:w-36 space-y-1">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Amount"
                      {...register(`civilWork.${index}.amount`, { valueAsNumber: true })}
                      className="border-gray-200 focus:border-[#3a5f9e] bg-white text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCivil(index)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg self-end md:self-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Interior Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-bold text-slate-800">Interior Breakdown</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendInterior({ description: "", rate: 0, amount: 0 })}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary"
              >
                <Plus className="h-3.5 w-3.5" /> Add Row
              </Button>
            </div>

            <div className="space-y-3">
              {interiorFields.map((field, index) => (
                <div key={field.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="flex-1 w-full space-y-1">
                    <Input
                      placeholder="Description (e.g. 2D Drawings, Site Supervision)"
                      {...register(`interior.${index}.description`)}
                      className="border-gray-200 focus:border-[#3a5f9e] bg-white text-sm"
                    />
                  </div>
                  <div className="w-full md:w-32 space-y-1">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Rate"
                      {...register(`interior.${index}.rate`, {
                        valueAsNumber: true,
                        onChange: (e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setValue(`interior.${index}.amount`, val);
                        },
                      })}
                      className="border-gray-200 focus:border-[#3a5f9e] bg-white text-sm"
                    />
                  </div>
                  <div className="w-full md:w-36 space-y-1">
                    <Input
                      type="number"
                      step="any"
                      placeholder="Amount"
                      {...register(`interior.${index}.amount`, { valueAsNumber: true })}
                      className="border-gray-200 focus:border-[#3a5f9e] bg-white text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInterior(index)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg self-end md:self-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* GST and Note Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Additional Terms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gst_percentage" className="font-semibold text-slate-700">
                  GST Percentage (%)
                </Label>
                <Input
                  id="gst_percentage"
                  type="number"
                  step="any"
                  placeholder="0.0"
                  {...register("gst_percentage", { valueAsNumber: true })}
                  className="border-gray-200 focus:border-[#3a5f9e]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-semibold text-slate-700">
                  Status
                </Label>
                <Select
                  defaultValue="draft"
                  onValueChange={(val) => setValue("status", val)}
                >
                  <SelectTrigger className="w-full border-gray-200 focus:ring-0 focus:border-[#3a5f9e]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="final">Final / Approved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="note" className="font-semibold text-slate-700">
                  Note / Terms & Conditions
                </Label>
                <textarea
                  id="note"
                  rows={3}
                  placeholder="Enter notes. Wrap words in double asterisks for bold (e.g. **Bathroom**)"
                  {...register("note")}
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:border-[#3a5f9e]"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Calculation Panel & Live Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">
                  ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>GST ({watchGst}%):</span>
                <span className="font-semibold text-slate-800">
                  ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-base font-bold text-slate-800">
                <span>Total Amount:</span>
                <span className="text-primary text-lg">
                  ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount in Words:</div>
                <div className="text-xs text-slate-700 font-medium">
                  {convertNumberToWords(totalAmount)}
                </div>
              </div>
            </div>

            <Button
              type="button"
              className="w-full bg-primary text-white hover:bg-primary-hover"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> Save & Back
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Hidden print rendering target */}
      <div className="hidden">
        <QuotationPdfTemplate
          ref={pdfRef}
          quotation={
            quotationData || {
              client_name: watch("client_name"),
              phone: watch("phone"),
              email: watch("email"),
              project_name: watch("project_name"),
              quotation_date: watch("quotation_date"),
              gst_percentage: watch("gst_percentage"),
              note: watch("note"),
              items: [
                ...watchCivil.map((item, index) => ({
                  section: "civil_work",
                  description: item.description,
                  rate: item.rate,
                  amount: item.amount,
                  sort_order: index,
                })),
                ...watchInterior.map((item, index) => ({
                  section: "interior",
                  description: item.description,
                  rate: item.rate,
                  amount: item.amount,
                  sort_order: index,
                })),
              ].filter((item) => item.description.trim() !== ""),
            }
          }
        />
      </div>
    </div>
  );
}

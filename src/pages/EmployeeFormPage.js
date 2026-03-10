import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Calendar, ArrowLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { requestHandler } from "../lib/utils/network-client";
import useToast from "../hooks/useToast";
import { getEmployeeById } from "../services/employeeService";
import { Card, CardContent } from "../components/ui/card";

// File validation helper
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
];

const DESIGNATION_OPTIONS = [
    "Jr. Frontend Developer",
    "Sr. Frontend Developer",
    "Jr. Backend Developer",
    "Sr. Backend Developer",
    "Full-Stack Developer",
    "Jr. BDE",
    "Sr. BDE",
];

const findMatchingDesignation = (value) => {
    if (!value) return "";
    const normalizedValue = value.trim().toLowerCase();
    const match = DESIGNATION_OPTIONS.find(
        (option) => option.toLowerCase() === normalizedValue,
    );
    return match || value; // Return match if found, otherwise original value
};

const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const validateFile = (fileList, fieldName, isRequired = false) => {
    // Check if file is required but not provided
    if (isRequired && (!fileList || fileList.length === 0)) {
        return `Please upload ${fieldName.toLowerCase()}`;
    }

    // If optional and no file, return true
    if (!fileList || fileList.length === 0) return true;

    const file = fileList[0];

    // Additional safety check - if file is undefined or null
    if (!file) {
        if (isRequired) {
            return `Please upload ${fieldName.toLowerCase()}`;
        }
        return true;
    }

    // Check file size
    if (file.size && file.size > MAX_FILE_SIZE) {
        return "image size can not more than 5MB";
    }

    // Check file type
    if (file.type && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        return `Please upload a valid file (JPEG, PNG, WebP, or PDF)`;
    }

    return true;
};

const getSchema = (type) =>
    z.object({
        first_name: z.string().min(1, "Please enter first name"),
        last_name: z.string().min(1, "Please enter last name"),
        email: z.string().email("Please enter a valid email address"),
        company_email: z
            .string()
            .email("Please enter a valid company email address")
            .optional()
            .or(z.literal("")),
        linkedin_link: z.string().optional().or(z.literal("")),
        github_link: z.string().optional().or(z.literal("")),
        phone_number: z
            .string()
            .min(1, "Please enter phone number")
            .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
        emergency_contact: z
            .string()
            .min(1, "Please enter emergency contact")
            .regex(
                /^[0-9]{10}$/,
                "Please enter a valid 10-digit emergency contact number",
            ),
        emergency_contact_relation: z
            .string()
            .min(1, "Please enter emergency contact relation"),
        designation: z.string().min(1, "Please select a designation"),
        joining_date: z.string().min(1, "Please select joining date"),
        dob: z.string().min(1, "Please select date of birth"),
        address: z.string().min(1, "Please enter address"),
        status: z.string().min(1, "Please select status"),
        role: z.string().min(1, "Please select role"),
        user_image: z.any().superRefine((files, ctx) => {
            const result = validateFile(files, "User image", type === "create");
            if (result !== true) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: result,
                });
            }
        }),
        aadhar_card_image: z.any().superRefine((files, ctx) => {
            const result = validateFile(
                files,
                "Aadhar card image",
                type === "create",
            );
            if (result !== true) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: result,
                });
            }
        }),
        pan_card_image: z.any().superRefine((files, ctx) => {
            const result = validateFile(files, "PAN card image", type === "create");
            if (result !== true) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: result,
                });
            }
        }),
        password: z.string().optional().superRefine((val, ctx) => {
            // If create mode, password is required
            if (type === "create" && (!val || val.length === 0)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password is required",
                });
                return;
            }

            // If empty (and allowed to be empty by type==edit), skip checks
            if (!val) return;

            if (val.length < 8) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password must be at least 8 characters",
                });
            }
            if (val.length > 16) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Password cannot exceed 16 characters",
                });
            }
            if (
                !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/.test(
                    val,
                )
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                });
            }
        }),
    });

const EmployeeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccessToast, showErrorToast } = useToast();
    const type = id ? "edit" : "create";

    const [loading, setLoading] = useState(!!id);
    const [editableEmployee, setEditableEmployee] = useState(null);

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(getSchema(type)),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            company_email: "",
            linkedin_link: "",
            github_link: "",
            password: "",
            phone_number: "",
            emergency_contact: "",
            emergency_contact_relation: "",
            designation: "",
            joining_date: "",
            dob: "",
            address: "",
            status: "active",
            role: "employee",
            user_image: null,
            aadhar_card_image: null,
            pan_card_image: null,
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingAadhar, setIsDraggingAadhar] = useState(false);
    const [isDraggingPan, setIsDraggingPan] = useState(false);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!id) return;
            // setLoading(true); // Already initialized
            try {
                const response = await getEmployeeById(id);
                if (response.success) {
                    // Check if response.data contains the employee directly or nested
                    const employeeData = response.data;
                    setEditableEmployee(employeeData);
                } else {
                    showErrorToast(
                        response.message || "Failed to fetch employee details",
                    );
                    navigate("/employee");
                }
            } catch (error) {
                console.error("Error fetching employee:", error);
                showErrorToast("Error loading employee details");
                navigate("/employee");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id, navigate]);

    useEffect(() => {
        console.log(
            "useEffect Triggered. Type:",
            type,
            "EditableEmployee:",
            editableEmployee,
        );
        if (type === "edit" && editableEmployee) {
            console.log("Resetting form with employee data", editableEmployee);
            // Format joining_date to YYYY-MM-DD for date input
            let formattedDate = "";
            if (editableEmployee.joining_date) {
                const date = new Date(editableEmployee.joining_date);
                if (!isNaN(date.getTime())) {
                    formattedDate = date.toISOString().split("T")[0];
                }
            }

            // Format dob to YYYY-MM-DD for date input
            let formattedDob = "";
            if (editableEmployee.dob) {
                const dobDate = new Date(editableEmployee.dob);
                if (!isNaN(dobDate.getTime())) {
                    formattedDob = dobDate.toISOString().split("T")[0];
                }
            }

            reset({
                first_name: editableEmployee.first_name,
                last_name: editableEmployee.last_name,
                email: editableEmployee.email,
                company_email: editableEmployee.company_email || "",
                linkedin_link: editableEmployee.linkedin || editableEmployee.linkedin_link || "",
                github_link: editableEmployee.github || editableEmployee.github_link || "",
                phone_number: editableEmployee.phone_number || "",
                emergency_contact: editableEmployee.emergency_contact || "",
                emergency_contact_relation:
                    editableEmployee.emergency_contact_relation || "",
                designation:
                    findMatchingDesignation(editableEmployee.designation) || "",
                joining_date: formattedDate,
                dob: formattedDob,
                address: editableEmployee.address || "",
                status: editableEmployee.status,
                role:
                    editableEmployee.role === "BDE" ||
                        editableEmployee.role === "bde" ||
                        editableEmployee.role === "Bde"
                        ? "Bde"
                        : editableEmployee.role || "employee",
                user_image: editableEmployee.user_image || null,
                aadhar_card_image: editableEmployee.aadhar_card_image || null,
                pan_card_image: editableEmployee.pan_card_image || null,
            });
        } else if (type === "create") {
            reset({
                first_name: "",
                last_name: "",
                email: "",
                company_email: "",
                linkedin_link: "",
                github_link: "",
                password: "",
                phone_number: "",
                emergency_contact: "",
                emergency_contact_relation: "",
                designation: "",
                joining_date: "",
                dob: "",
                address: "",
                status: "active",
                role: "employee",
                user_image: null,
                aadhar_card_image: null,
                pan_card_image: null,
            });
        }
    }, [type, editableEmployee, reset]);

    const onSubmit = async (data) => {
        try {
            const url = type === "edit" ? `/employees/${id}` : "/employees";
            const method = type === "edit" ? "PUT" : "POST";

            const isValidFile = (val) => val instanceof FileList && val.length > 0;
            const hasUserImage = isValidFile(data.user_image);
            const hasAadharImage = isValidFile(data.aadhar_card_image);
            const hasPanImage = isValidFile(data.pan_card_image);
            const hasFiles = hasUserImage || hasAadharImage || hasPanImage;

            let requestBody;
            let headers = {};

            // Prepare payload data - rename keys for API
            const payloadData = { ...data };
            if (payloadData.linkedin_link !== undefined) {
                payloadData.linkedin = payloadData.linkedin_link;
                delete payloadData.linkedin_link;
            }
            if (payloadData.github_link !== undefined) {
                payloadData.github = payloadData.github_link;
                delete payloadData.github_link;
            }

            if (hasFiles) {
                const formData = new FormData();

                Object.keys(payloadData).forEach((key) => {
                    const value = payloadData[key];
                    if (value !== null && value !== undefined && value !== "") {
                        formData.append(key, value);
                    }
                });

                if (hasUserImage) formData.append("user_image", data.user_image[0]);
                if (hasAadharImage)
                    formData.append("aadhar_card_image", data.aadhar_card_image[0]);
                if (hasPanImage)
                    formData.append("pan_card_image", data.pan_card_image[0]);

                requestBody = formData;
                // Important: clear Content-Type to let browser set boundary for multipart/form-data
                headers = { "Content-Type": null };
            } else {
                const { user_image, aadhar_card_image, pan_card_image, ...cleanData } =
                    payloadData;
                requestBody = cleanData;
            }

            const response = await requestHandler(url, {
                method,
                body: requestBody,
                headers,
                isFormData: hasFiles,
            });

            if (response.success) {
                showSuccessToast(
                    response.message ||
                    `Employee ${type === "edit" ? "updated" : "created"} successfully`,
                );
                navigate("/employee");
            } else {
                const errorMessage =
                    response.error?.details || response.message || "Operation failed";
                showErrorToast(errorMessage);
            }
        } catch (error) {
            console.error(error);
            showErrorToast("Something went wrong");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 sm:p-8 max-w-[1200px] mx-auto gap-4">
            {/* Header */}
            <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={() => navigate("/employee")}
                        variant="outline"
                        className="p-2 h-10 w-10 border-gray-300 hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-primary-hover to-primary bg-clip-text text-transparent">
                            {type === "edit" ? "Edit Employee" : "Add New Employee"}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {type === "edit"
                                ? "Update the details of the employee."
                                : "Fill in the form to create a new employee."}
                        </p>
                    </div>
                </div>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden border border-gray-200 shadow-xl bg-white/80 backdrop-blur-xl">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 flex flex-col min-h-0"
                    autoComplete="off"
                >
                    <CardContent className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="first_name"
                                    className="text-gray-700 font-semibold"
                                >
                                    First Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    placeholder="Enter your first name"
                                    autoComplete="off"
                                    {...register("first_name")}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.first_name.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="last_name"
                                    className="text-gray-700 font-semibold"
                                >
                                    Last Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    placeholder="Enter your last name"
                                    autoComplete="off"
                                    {...register("last_name")}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.last_name.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Email Fields in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">
                                    Personal Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    autoComplete="off"
                                    {...register("email")}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">
                                    Company Email
                                </Label>
                                <Input
                                    id="company_email"
                                    type="email"
                                    placeholder="Enter company email"
                                    autoComplete="off"
                                    {...register("company_email")}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                                {errors.company_email && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.company_email.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* LinkedIn and GitHub in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="linkedin_link"
                                    className="text-gray-700 font-semibold"
                                >
                                    LinkedIn Link
                                </Label>
                                <Input
                                    id="linkedin_link"
                                    placeholder="Enter LinkedIn profile link"
                                    autoComplete="off"
                                    {...register("linkedin_link")}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="github_link"
                                    className="text-gray-700 font-semibold"
                                >
                                    GitHub Link
                                </Label>
                                <Input
                                    id="github_link"
                                    placeholder="Enter GitHub profile link"
                                    autoComplete="off"
                                    {...register("github_link")}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password and User Image in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Password field */}
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">
                                    Password{" "}
                                    {type === "edit" ? (
                                        <span className="text-gray-400 text-xs font-normal ml-1">
                                            (Optional)
                                        </span>
                                    ) : (
                                        <span className="text-red-500">*</span>
                                    )}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder={
                                            type === "edit"
                                                ? "Leave blank to keep current"
                                                : "Enter your password"
                                        }
                                        autoComplete="new-password"
                                        {...register("password")}
                                        className="h-10 pr-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3a5f9e] transition-colors focus:outline-none"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Live Password Requirements */}
                                {(type === "create" ||
                                    (type === "edit" && watch("password"))) && (
                                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                                            <div
                                                className={`flex items-center gap-1.5 ${watch("password")?.length >= 8
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`font-bold ${watch("password")?.length >= 8
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                        }`}
                                                >
                                                    {watch("password")?.length >= 8 ? "✓" : "×"}
                                                </span>
                                                <span>At least 8 characters</span>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1.5 ${watch("password")?.length <= 16 &&
                                                    watch("password")?.length > 0
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`font-bold ${watch("password")?.length <= 16 &&
                                                        watch("password")?.length > 0
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                        }`}
                                                >
                                                    {watch("password")?.length <= 16 &&
                                                        watch("password")?.length > 0
                                                        ? "✓"
                                                        : "×"}
                                                </span>
                                                <span>Maximum 16 characters</span>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1.5 ${/[A-Z]/.test(watch("password") || "")
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`font-bold ${/[A-Z]/.test(watch("password") || "")
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                        }`}
                                                >
                                                    {/[A-Z]/.test(watch("password") || "") ? "✓" : "×"}
                                                </span>
                                                <span>One uppercase letter</span>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1.5 ${/[a-z]/.test(watch("password") || "")
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`font-bold ${/[a-z]/.test(watch("password") || "")
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                        }`}
                                                >
                                                    {/[a-z]/.test(watch("password") || "") ? "✓" : "×"}
                                                </span>
                                                <span>One lowercase letter</span>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1.5 ${/\d/.test(watch("password") || "")
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`font-bold ${/\d/.test(watch("password") || "")
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                        }`}
                                                >
                                                    {/\d/.test(watch("password") || "") ? "✓" : "×"}
                                                </span>
                                                <span>One number</span>
                                            </div>
                                            <div
                                                className={`flex items-center gap-1.5 ${/[@$!%*?&#]/.test(watch("password") || "")
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                    }`}
                                            >
                                                <span
                                                    className={`font-bold ${/[@$!%*?&#]/.test(watch("password") || "")
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                        }`}
                                                >
                                                    {/[@$!%*?&#]/.test(watch("password") || "") ? "✓" : "×"}
                                                </span>
                                                <span>One special character</span>
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* User Image field with Drag and Drop */}
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">
                                    User Image{" "}
                                    {type === "create" && <span className="text-red-500">*</span>}
                                </Label>

                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex-1 relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer text-center
                            ${isDragging
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                            }`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDragging(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            if (
                                                e.dataTransfer.files &&
                                                e.dataTransfer.files.length > 0
                                            ) {
                                                const file = e.dataTransfer.files[0];
                                                if (file.type.startsWith("image/")) {
                                                    setValue("user_image", e.dataTransfer.files, {
                                                        shouldValidate: true,
                                                    });
                                                } else {
                                                    showErrorToast("Please upload an image file");
                                                }
                                            }
                                        }}
                                        onClick={() =>
                                            document.getElementById("user_image").click()
                                        }
                                    >
                                        <Input
                                            id="user_image"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setValue("user_image", e.target.files, {
                                                        shouldValidate: true,
                                                    });
                                                }
                                            }}
                                        />

                                        {watch("user_image") &&
                                            (typeof watch("user_image") === "string" ||
                                                watch("user_image").length > 0) ? (
                                            <div className="relative w-full h-[120px]">
                                                <img
                                                    src={
                                                        typeof watch("user_image") === "string"
                                                            ? watch("user_image")
                                                            : URL.createObjectURL(watch("user_image")[0])
                                                    }
                                                    alt="Preview"
                                                    className="w-full h-full object-contain rounded-md"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                                    <p className="text-white font-medium text-sm">
                                                        Click to Change
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 pointer-events-none">
                                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-image-plus"
                                                    >
                                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                                                        <line x1="16" x2="22" y1="5" y2="5" />
                                                        <line x1="19" x2="19" y1="2" y2="8" />
                                                        <circle cx="9" cy="9" r="2" />
                                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Drag & Drop or Click to Upload
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.user_image && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.user_image.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Phone Number and Date of Birth in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="phone_number"
                                    className="text-gray-700 font-semibold"
                                >
                                    Phone Number <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    maxLength={10}
                                    {...register("phone_number")}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                                {errors.phone_number && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.phone_number.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    // htmlFor="dob"
                                    className="text-gray-700 font-semibold"
                                >
                                    Date of Birth <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="DD-MM-YYYY"
                                        value={formatDateForDisplay(watch('dob'))}
                                        readOnly
                                        className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                                    />
                                    <Input
                                        id="dob"
                                        type="date"
                                        {...register("dob")}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-20" />
                                </div>
                                {errors.dob && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.dob.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Emergency Contact and Joining Date in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="emergency_contact"
                                    className="text-gray-700 font-semibold"
                                >
                                    Emergency Contact <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="emergency_contact"
                                    type="tel"
                                    placeholder="Enter emergency contact number"
                                    maxLength={10}
                                    {...register("emergency_contact")}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                    }}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                                {errors.emergency_contact && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.emergency_contact.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    // htmlFor="joining_date"
                                    className="text-gray-700 font-semibold"
                                >
                                    Joining Date <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        placeholder="DD-MM-YYYY"
                                        value={formatDateForDisplay(watch('joining_date'))}
                                        readOnly
                                        className="h-10 pr-10 border-gray-300 focus:border-[#3a5f9e] text-gray-900 bg-white"
                                    />
                                    <Input
                                        id="joining_date"
                                        type="date"
                                        {...register("joining_date")}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-20" />
                                </div>
                                {errors.joining_date && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.joining_date.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Emergency Contact Relation and Designation in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="emergency_contact_relation"
                                    className="text-gray-700 font-semibold"
                                >
                                    Emergency Contact Relation <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="emergency_contact_relation"
                                    placeholder="Father, Mother, Spouse"
                                    {...register("emergency_contact_relation")}
                                    className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                                />
                                {errors.emergency_contact_relation && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.emergency_contact_relation.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="designation"
                                    className="text-gray-700 font-semibold"
                                >
                                    Designation <span className="text-red-500">*</span>
                                </Label>
                                <Controller
                                    name="designation"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="h-10 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-[#3a5f9e] text-gray-900">
                                                <SelectValue placeholder="Select designation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DESIGNATION_OPTIONS.map((option) => (
                                                    <SelectItem key={option} value={option}>
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.designation && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.designation.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Role and Status in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-gray-700 font-semibold">
                                    Role <span className="text-red-500">*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name="role"
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="h-10 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-[#3a5f9e] text-gray-900">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="employee">Employee</SelectItem>
                                                <SelectItem value="Bde">BDE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.role && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.role.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-gray-700 font-semibold">
                                    Status <span className="text-red-500">*</span>
                                </Label>
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select
                                            key={field.value}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="h-10 border-gray-300 focus:ring-0 focus:ring-offset-0 focus:border-[#3a5f9e] text-gray-900">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                        Active
                                                    </span>
                                                </SelectItem>
                                                <SelectItem value="inactive">
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                        Inactive
                                                    </span>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.status && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.status.message}
                                    </p>
                                )}
                            </div>
                        </div>


                        {/* Address - Full Width */}
                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-gray-700 font-semibold">
                                Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="address"
                                placeholder="Enter full address"
                                {...register("address")}
                                className="h-10 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#3a5f9e] text-gray-900 placeholder:text-gray-400"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs font-medium mt-1">
                                    {errors.address.message}
                                </p>
                            )}
                        </div>

                        {/* Aadhar and PAN Card in 2 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Aadhar Card field */}
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">
                                    Aadhar Card{" "}
                                    {type === "create" && <span className="text-red-500">*</span>}
                                </Label>

                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex-1 relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer text-center
                            ${isDraggingAadhar
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                            }`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDraggingAadhar(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            setIsDraggingAadhar(false);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDraggingAadhar(false);
                                            if (
                                                e.dataTransfer.files &&
                                                e.dataTransfer.files.length > 0
                                            ) {
                                                const file = e.dataTransfer.files[0];
                                                if (
                                                    file.type.startsWith("image/") ||
                                                    file.type === "application/pdf"
                                                ) {
                                                    setValue("aadhar_card_image", e.dataTransfer.files, {
                                                        shouldValidate: true,
                                                    });
                                                } else {
                                                    showErrorToast("Please upload an image or PDF file");
                                                }
                                            }
                                        }}
                                        onClick={() =>
                                            document.getElementById("aadhar_card_image").click()
                                        }
                                    >
                                        <Input
                                            id="aadhar_card_image"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setValue("aadhar_card_image", e.target.files, {
                                                        shouldValidate: true,
                                                    });
                                                }
                                            }}
                                        />

                                        {watch("aadhar_card_image") &&
                                            (typeof watch("aadhar_card_image") === "string" ||
                                                watch("aadhar_card_image").length > 0) ? (
                                            <div className="relative w-full h-[120px]">
                                                {(
                                                    typeof watch("aadhar_card_image") === "string"
                                                        ? watch("aadhar_card_image")
                                                            .toLowerCase()
                                                            .endsWith(".pdf")
                                                        : watch("aadhar_card_image")[0]?.type ===
                                                        "application/pdf"
                                                ) ? (
                                                    <iframe
                                                        src={
                                                            typeof watch("aadhar_card_image") === "string"
                                                                ? watch("aadhar_card_image")
                                                                : URL.createObjectURL(
                                                                    watch("aadhar_card_image")[0],
                                                                )
                                                        }
                                                        title="Aadhar Preview"
                                                        className="w-full h-full rounded-md border border-gray-200"
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            typeof watch("aadhar_card_image") === "string"
                                                                ? watch("aadhar_card_image")
                                                                : URL.createObjectURL(
                                                                    watch("aadhar_card_image")[0],
                                                                )
                                                        }
                                                        alt="Preview"
                                                        className="w-full h-full object-contain rounded-md"
                                                    />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                                    <p className="text-white font-medium text-sm">
                                                        Click to Change
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 pointer-events-none">
                                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-upload"
                                                    >
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="17 8 12 3 7 8" />
                                                        <line x1="12" x2="12" y1="3" y2="15" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Drag & Drop or Click to Upload
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.aadhar_card_image && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.aadhar_card_image.message}
                                    </p>
                                )}
                            </div>

                            {/* PAN Card field */}
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-semibold">
                                    PAN Card{" "}
                                    {type === "create" && <span className="text-red-500">*</span>}
                                </Label>

                                <div className="flex items-start gap-4">
                                    <div
                                        className={`flex-1 relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer text-center
                            ${isDraggingPan
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                            }`}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            setIsDraggingPan(true);
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            setIsDraggingPan(false);
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDraggingPan(false);
                                            if (
                                                e.dataTransfer.files &&
                                                e.dataTransfer.files.length > 0
                                            ) {
                                                const file = e.dataTransfer.files[0];
                                                if (
                                                    file.type.startsWith("image/") ||
                                                    file.type === "application/pdf"
                                                ) {
                                                    setValue("pan_card_image", e.dataTransfer.files, {
                                                        shouldValidate: true,
                                                    });
                                                } else {
                                                    showErrorToast("Please upload an image or PDF file");
                                                }
                                            }
                                        }}
                                        onClick={() =>
                                            document.getElementById("pan_card_image").click()
                                        }
                                    >
                                        <Input
                                            id="pan_card_image"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setValue("pan_card_image", e.target.files, {
                                                        shouldValidate: true,
                                                    });
                                                }
                                            }}
                                        />

                                        {watch("pan_card_image") &&
                                            (typeof watch("pan_card_image") === "string" ||
                                                watch("pan_card_image").length > 0) ? (
                                            <div className="relative w-full h-[120px]">
                                                {(
                                                    typeof watch("pan_card_image") === "string"
                                                        ? watch("pan_card_image")
                                                            .toLowerCase()
                                                            .endsWith(".pdf")
                                                        : watch("pan_card_image")[0]?.type ===
                                                        "application/pdf"
                                                ) ? (
                                                    <iframe
                                                        src={
                                                            typeof watch("pan_card_image") === "string"
                                                                ? watch("pan_card_image")
                                                                : URL.createObjectURL(
                                                                    watch("pan_card_image")[0],
                                                                )
                                                        }
                                                        title="PAN Preview"
                                                        className="w-full h-full rounded-md border border-gray-200"
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <img
                                                        src={
                                                            typeof watch("pan_card_image") === "string"
                                                                ? watch("pan_card_image")
                                                                : URL.createObjectURL(
                                                                    watch("pan_card_image")[0],
                                                                )
                                                        }
                                                        alt="Preview"
                                                        className="w-full h-full object-contain rounded-md"
                                                    />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
                                                    <p className="text-white font-medium text-sm">
                                                        Click to Change
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 pointer-events-none">
                                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-upload"
                                                    >
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="17 8 12 3 7 8" />
                                                        <line x1="12" x2="12" y1="3" y2="15" />
                                                    </svg>
                                                </div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    Drag & Drop or Click to Upload
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {errors.pan_card_image && (
                                    <p className="text-red-500 text-xs font-medium mt-1">
                                        {errors.pan_card_image.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    <div className="p-6 border-t bg-gray-50/50 mt-auto shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate("/employee")}
                            className="h-11 px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 px-8 bg-gradient-to-r from-[#3a5f9e] via-[#5283c5] to-[#6fa8dc] text-white hover:opacity-90 transition-opacity"
                        >
                            {isSubmitting
                                ? "Processing..."
                                : type === "edit"
                                    ? "Update"
                                    : "Create"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EmployeeFormPage;


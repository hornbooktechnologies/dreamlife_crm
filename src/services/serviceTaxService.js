import { requestHandler } from "../lib/utils/network-client";

export const payServiceTax = async (data) => {
  return await requestHandler("/service-tax/pay", {
    method: "POST",
    body: data,
  });
};

export const getServiceTaxStatus = async (month, year) => {
  return await requestHandler(`/service-tax/status`, {
    method: "GET",
    params: { month, year },
  });
};

export const getServiceTaxHistory = async (employeeId) => {
  return await requestHandler(`/service-tax/history/${employeeId}`, {
    method: "GET",
  });
};

export const getServiceTaxReport = async ({ month, year, page, limit }) => {
  return await requestHandler("/service-tax/report", {
    method: "GET",
    params: { month, year, page, limit },
  });
};

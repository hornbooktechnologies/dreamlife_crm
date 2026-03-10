import { requestHandler } from "../lib/utils/network-client";

export const payServiceTax = async (data) => {
  return await requestHandler("/service-tax/pay", {
    method: "POST",
    body: data,
  });
};

export const payServiceTaxBulk = async (data) => {
  return await requestHandler("/service-tax/pay/bulk", {
    method: "POST",
    body: data,
  });
};

export const updateServiceTax = async (id, data) => {
  return await requestHandler(`/service-tax/pay/${id}`, {
    method: "PUT",
    body: data,
  });
};

export const deleteServiceTax = async (id) => {
  return await requestHandler(`/service-tax/pay/${id}`, {
    method: "DELETE",
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

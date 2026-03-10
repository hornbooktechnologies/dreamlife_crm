import { requestHandler } from '../lib/utils/network-client';

/**
 * Fetch employee details by ID
 * @param {number|string} employeeId - The employee ID
 * @returns {Promise} Employee data
 */
export const getEmployeeById = async (employeeId) => {
    try {
        const response = await requestHandler('/employees', {
            method: 'GET',
            params: { id: employeeId },
        });
        return response;
    } catch (error) {
        console.error('Error fetching employee details:', error);
        throw error;
    }
};

/**
 * Update employee details
 * @param {number|string} employeeId - The employee ID
 * @param {object} employeeData - The employee data to update
 * @returns {Promise} Updated employee data
 */
export const updateEmployee = async (employeeId, employeeData) => {
    try {
        const response = await requestHandler('/employees', {
            method: 'PUT',
            params: { id: employeeId },
            data: employeeData,
        });
        return response;
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

/**
 * Fetch all employees with pagination
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} Employees list with pagination
 */
export const getAllEmployees = async (page = 1, limit = 10) => {
    try {
        const response = await requestHandler('/employees', {
            method: 'GET',
            params: { page, limit },
        });
        return response;
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
    }
};

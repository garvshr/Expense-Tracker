export const fetchExpenses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`/api/expenses?${query}`);
  if (!response.ok) throw new Error('Failed to fetch expenses');
  const result = await response.json();
  // Return the data array if it exists (for paginated results), otherwise the raw result
  return result.data || result;
};

export const fetchExpenseById = async (id) => {
  const response = await fetch(`/api/expenses/${id}`);
  if (!response.ok) throw new Error('Failed to fetch expense');
  return response.json();
};

export const createExpense = async (data) => {
  const response = await fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create expense');
  return response.json();
};

export const updateExpense = async (id, data) => {
  const response = await fetch(`/api/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update expense');
  return response.json();
};

export const deleteExpense = async (id) => {
  const response = await fetch(`/api/expenses/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete expense');
  return response.json();
};

export const fetchTotalExpenses = async () => {
  const response = await fetch('/api/expenses/total');
  if (!response.ok) throw new Error('Failed to fetch total');
  return response.json();
};

export const fetchCategorySummary = async () => {
  const response = await fetch('/api/expenses/summary/category');
  if (!response.ok) throw new Error('Failed to fetch category summary');
  return response.json();
};

export const fetchMonthlySummary = async () => {
  const response = await fetch('/api/expenses/summary/monthly');
  if (!response.ok) throw new Error('Failed to fetch monthly summary');
  return response.json();
};

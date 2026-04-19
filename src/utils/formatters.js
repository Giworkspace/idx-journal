export const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR', 
    minimumFractionDigits: 0 
  }).format(value);
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatCompactCurrency = (value) => {
  if (Math.abs(value) >= 1000000) return `Rp${(value/1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `Rp${(value/1000).toFixed(0)}K`;
  return formatCurrency(value);
};

export const formatPercent = (value) => `${Number(value).toFixed(1)}%`;

export const formatSignedPercent = (value) => {
  const num = Number(value);
  const formatted = Math.abs(num).toFixed(2);
  if (num > 0) return `+${formatted}%`;
  if (num < 0) return `-${formatted}%`;
  return `0.00%`;
};

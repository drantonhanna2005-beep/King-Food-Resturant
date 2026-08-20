const SHIPPING_FEE = 10;
const TAX_RATE = 0.14;

function fullName(user) {
  return `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
}

function formatAddress(address) {
  if (!address) return '';
  return [address.streetAddress, address.city, address.country].filter(Boolean).join(', ');
}

// Shipping/tax/total for an order subtotal, taxing the discounted amount.
function orderTotals(subtotal, discount = 0) {
  const tax = (subtotal - discount) * TAX_RATE;
  return { subtotal, shipping: SHIPPING_FEE, tax, total: subtotal + SHIPPING_FEE + tax - discount };
}

function cartSubtotal(cart) {
  return (cart?.items || []).reduce((sum, i) => sum + i.qty * (i.product?.price || 0), 0);
}

function newOrderNo() {
  return `ORD-${Date.now()}`;
}

module.exports = { SHIPPING_FEE, TAX_RATE, fullName, formatAddress, orderTotals, cartSubtotal, newOrderNo };

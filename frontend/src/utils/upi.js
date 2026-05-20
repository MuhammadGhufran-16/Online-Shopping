export function generateUpiUrl({
  upiId,
  name,
  amount,
  note,
}) {

  const finalAmount =
    Number(amount || 0).toFixed(2);

  return (
    `upi://pay?pa=${upiId}` +
    `&pn=${encodeURIComponent(name)}` +
    `&am=${finalAmount}` +
    `&cu=INR` +
    `&tn=${encodeURIComponent(note)}`
  );

}
import dayjs from "dayjs";

/**
 * Calculate days remaining until a ticket expires
 * @param {Object} ticket - The ticket object containing creation date
 * @param {boolean} isPaid - Whether the ticket is paid
 * @param {number} expirationDays - Number of days until expiration (default: 7)
 * @returns {number|null} - Days remaining or null if ticket is paid
 */
export const calculateDaysRemaining = (ticket, isPaid, expirationDays = 30) => {
  if (isPaid) return null;

  // Use created_at if available (from API), otherwise fall back to created (from frontend)
  const creationDate = ticket.created_at || ticket.created;

  if (!creationDate) return null;

  const createdDate = dayjs(creationDate);
  const expiryDate = createdDate.add(expirationDays, "day");
  const daysRemaining = expiryDate.diff(dayjs(), "day");

  return daysRemaining;
};

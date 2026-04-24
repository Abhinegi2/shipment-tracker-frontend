export const STATUS_COLORS = {
  "In Transit": { bg: "#EFF6FF", color: "#1D4ED8", dot: "#3B82F6" },
  "Delivered": { bg: "#F0FDF4", color: "#15803D", dot: "#22C55E" },
  "Reached": { bg: "#F0F9FF", color: "#0369A1", dot: "#0EA5E9" },
  "Dispatched": { bg: "#FFF7ED", color: "#C2410C", dot: "#F97316" },
  "Created": { bg: "#F9FAFB", color: "#374151", dot: "#9CA3AF" },
  "Out for Delivery": { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
};

export const StatusBadge = ({ status }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS["Created"];
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
};

export const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
    <div style={{ width: 32, height: 32, border: "3px solid #E2E8F0", borderTop: "3px solid #2563EB", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli","Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry"
];

export const ITEM_CATEGORIES = [
  "Electronics","Documents","Furniture","Clothing","Medical Supplies",
  "Industrial Equipment","Food & Perishables","Automotive Parts",
  "Books & Stationery","Sports Equipment","General Cargo","Other"
];

export const LOCATIONS = ["Delhi","Mumbai","Bangalore","Chennai","Kolkata","Hyderabad","Pune","Jaipur","Dehradun","Vizag","Nagpur","Guwahati","Tehri"];
export const STATUSES = ["Created","Dispatched","In Transit","Reached","Out for Delivery","Delivered"];

export const inputStyle = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0",
  borderRadius: 8, fontSize: 13, outline: "none", color: "#1E293B", background: "#fff",
  boxSizing: "border-box",
};

export const FormField = ({ label, required, children }) => (
  <div>
    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
      {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
    </label>
    {children}
  </div>
);

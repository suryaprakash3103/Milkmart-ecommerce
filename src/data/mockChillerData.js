export const initialChillerTelemetry = {
  averageChillerTemp: 3.8, // Celsius
  bulkMilkCoolerVats: [
    { id: "BMC-01", name: "A2 Gir Raw Vat", temp: 3.6, capacityLiters: 5000, currentLiters: 4250, status: "Optimal" },
    { id: "BMC-02", name: "Murrah Buffalo Vat", temp: 3.9, capacityLiters: 4000, currentLiters: 3100, status: "Optimal" },
    { id: "BMC-03", name: "Standardized Toned Vat", temp: 4.0, capacityLiters: 6000, currentLiters: 5400, status: "Optimal" },
    { id: "BMC-04", name: "Organic Curd Culture Vat", temp: 4.2, capacityLiters: 2000, currentLiters: 1850, status: "Optimal" }
  ],
  todayProcurement: {
    totalLitersReceived: 14600,
    morningMilkTime: "04:30 AM",
    avgFatPercentage: 5.4,
    avgSNF: 8.9,
    bacterialCountGrade: "Grade A (<10,000 CFU/ml)",
    adulterationTests: "100% Passed (Aflatoxin, Detergent, Starch, Urea: Negative)"
  }
};

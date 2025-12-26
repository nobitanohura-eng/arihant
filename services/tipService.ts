
export const tipService = {
  getInsights: (pickup: string, drop: string, passengerCount: number) => {
    const insights = [
      "Carry your ID proof as it might be required for hotel check-ins or pilgrimage sites.",
      "Inform the driver in advance if you plan to visit Baidyanath Temple for specific timing.",
      "For outstation trips to Ranchi or Dhanbad, we recommend leaving early to avoid city traffic."
    ];

    if (passengerCount > 7) {
      insights.push("Since you're a large group, our Force Traveller is already being prepared with extra luggage space.");
    } else {
      insights.push("Our compact sedans are perfectly sanitized and ideal for Giridih's city maneuvers.");
    }

    const locations = (pickup + drop).toLowerCase();
    if (locations.includes('ranchi') || locations.includes('airport')) {
      insights.push("Allow at least 4-5 hours for the Giridih-Ranchi journey depending on current road conditions.");
    }
    
    if (locations.includes('deoghar') || locations.includes('temple')) {
      insights.push("Pilgrimage special: Our drivers are familiar with the best darshan timings and routes.");
    }

    return insights.slice(0, 3).join("\n• ");
  }
};

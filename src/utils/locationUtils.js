export const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
];

export const validatePhone = (phone) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
};

export const fetchLocationFromPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) return null;

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (data && data[0].Status === "Success") {
            const details = data[0].PostOffice[0];
            return {
                city: details.District,
                state: details.State,
                country: 'India' // API is India specific
            };
        }
    } catch (error) {
        console.error("Error fetching pincode details:", error);
    }
    return null;
};
export const getEstimatedDeliveryDate = (state) => {
    const today = new Date();
    let minDays = 3;
    let maxDays = 5;

    // Simplified logic for India
    const metroStates = ["Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "West Bengal"];
    const remoteStates = ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura", "Andaman and Nicobar Islands", "Lakshadweep"];

    if (state === "Delhi") { // Assuming warehouse is in Delhi
        minDays = 1;
        maxDays = 2;
    } else if (metroStates.includes(state)) {
        minDays = 3;
        maxDays = 4;
    } else if (remoteStates.includes(state)) {
        minDays = 6;
        maxDays = 9;
    } else {
        minDays = 4;
        maxDays = 6;
    }

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    const options = { day: 'numeric', month: 'short' };
    return `${minDate.toLocaleDateString('en-IN', options)} - ${maxDate.toLocaleDateString('en-IN', options)}`;
};

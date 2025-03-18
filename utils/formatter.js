function formatToE164(phoneNumber, countryCode = "55") {
    const digitsOnly = phoneNumber.replace(/\D/g, "");

    if (digitsOnly.startsWith(countryCode)) {
        return `+${digitsOnly}`;
    }

    return `+${countryCode}${digitsOnly}`;
}

function digitsOnly(str) {
    const digitsOnly = str.replace(/\D/g, "");
    return digitsOnly;
}

module.exports = { formatToE164, digitsOnly }
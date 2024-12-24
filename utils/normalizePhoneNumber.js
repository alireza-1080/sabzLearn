const normalizedPhoneNumber = (phoneNumber) => {
  return phoneNumber.replace(/\D/g, '');
};

export default normalizedPhoneNumber;
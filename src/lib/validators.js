export function validateRegister({ displayName, email, password, confirmPassword, role }) {
  const errors = {};

  if (displayName.length < 3) {
    errors.displayName = "Nama tampilan minimal 3 karakter.";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.email = "Format email tidak valid.";
  }

  if (password.length < 8) {
    errors.password = "Password minimal 8 karakter.";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Konfirmasi password tidak cocok.";
  }

  if (role !== "member" && role !== "curator") {
    errors.role = "Peran tidak valid.";
  }

  return errors;
}
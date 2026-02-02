export const validateId = (id: any, fieldName: string = "ID"): number => {
  const parsedId = parseInt(id)
  if (isNaN(parsedId) || parsedId <= 0) {
    throw new Error(`Invalid ${fieldName}: must be a positive integer`)
  }
  return parsedId
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (
  password: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export const sanitizeString = (input: any): string => {
  if (typeof input !== "string") {
    throw new Error("Invalid input: must be a string")
  }
  return input.trim()
}

export const validatePositiveNumber = (
  value: any,
  fieldName: string,
): number => {
  const num = parseFloat(value)
  if (isNaN(num) || num <= 0) {
    throw new Error(`Invalid ${fieldName}: must be a positive number`)
  }
  return num
}

export const validateStringLength = (
  str: string,
  minLength: number,
  maxLength: number,
  fieldName: string,
): string => {
  if (typeof str !== "string") {
    throw new Error(`Invalid ${fieldName}: must be a string`)
  }
  const trimmed = str.trim()
  if (trimmed.length < minLength || trimmed.length > maxLength) {
    throw new Error(
      `Invalid ${fieldName}: must be between ${minLength} and ${maxLength} characters`,
    )
  }
  return trimmed
}

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$|^\d{10,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))
}

export const validatePostalCode = (
  postalCode: string,
  country: string = "BR",
): boolean => {
  const patterns: Record<string, RegExp> = {
    BR: /^\d{5}-?\d{3}$/,
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i,
  }
  const pattern = patterns[country.toUpperCase()] || patterns["BR"]
  return pattern.test(postalCode.trim())
}

export const sanitizeHtml = (input: string): string => {
  if (typeof input !== "string") {
    throw new Error("Invalid input: must be a string")
  }
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
    .trim()
}

export const validateObjectId = (id: string): boolean => {
  return typeof id === "string" && id.length > 0 && /^[a-zA-Z0-9_-]+$/.test(id)
}

export const validateQuantity = (quantity: any): number => {
  const num = parseInt(quantity)
  if (isNaN(num) || num <= 0 || num > 1000) {
    throw new Error(
      "Invalid quantity: must be a positive integer not exceeding 1000",
    )
  }
  return num
}

export const validatePrice = (price: any): number => {
  const num = parseFloat(price)
  if (isNaN(num) || num < 0 || num > 999999.99) {
    throw new Error(
      "Invalid price: must be a positive number not exceeding 999999.99",
    )
  }
  return Math.round(num * 100) / 100
}

const COLOR_TRANSLATIONS: Record<string, string> = {
  branco: "white",
  preto: "black",
  azul: "blue",
  vermelho: "red",
  verde: "green",
  amarelo: "yellow",
  cinza: "gray",
  castanho: "brown",
  rosa: "pink",
  roxo: "purple",
  laranja: "orange",
}

export const normalizeColor = (color: string): string => {
  const normalized = color.trim().toLowerCase()
  return COLOR_TRANSLATIONS[normalized] ?? normalized
}

export const validateColor = (color: string): boolean => {
  const normalizedColor = normalizeColor(color)
  const colorRegex =
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^(red|blue|green|yellow|black|white|gray|brown|pink|purple|orange)$/i
  return colorRegex.test(normalizedColor)
}

export const validateSize = (size: any): number => {
  const num = parseInt(size)
  if (isNaN(num) || num < 20 || num > 60) {
    throw new Error("Invalid size: must be between 20 and 60")
  }
  return num
}

export const validateOrderStatus = (status: string): boolean => {
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]
  return validStatuses.includes(status.toLowerCase())
}

export const validatePaymentMethod = (method: string): boolean => {
  const validMethods = ["card", "paypal", "bank_transfer", "cash"]
  return validMethods.includes(method.toLowerCase())
}

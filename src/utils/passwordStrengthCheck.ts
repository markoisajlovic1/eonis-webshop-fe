export type PasswordStrength = 'weak' | 'medium' | 'strong'

export interface PasswordStrengthResult {
  strength: PasswordStrength
  label: string
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  if (password.length === 0) return { strength: 'weak', label: '' }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { strength: 'weak', label: 'Slaba lozinka' }
  if (score <= 2) return { strength: 'medium', label: 'Srednje jaka lozinka' }
  return { strength: 'strong', label: 'Jaka lozinka' }
}

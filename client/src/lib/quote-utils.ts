export function formatCurrency(amount: number): string {
  return `R$ ${amount.toFixed(2).replace('.', ',')}`;
}

export function formatPhone(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if format doesn't match
}

export function calculateTotal(services: Array<{ price: number }>): number {
  return services.reduce((sum, service) => sum + service.price, 0);
}

export function generateServiceOrder(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${year}${month}${day}${random}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

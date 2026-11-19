/** Link `wa.me` con il messaggio già scritto: nessun dato passa da noi. */
export function linkWhatsApp(numero: string, testo: string): string {
  const cifre = numero.replace(/[\s+().-]/g, '');
  if (!/^\d{8,15}$/.test(cifre)) throw new Error(`numero WhatsApp non valido: «${numero}»`);
  return `https://wa.me/${cifre}?text=${encodeURIComponent(testo)}`;
}

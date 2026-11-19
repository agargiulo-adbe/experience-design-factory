/**
 * Edizione da distribuire: un telefono non apre il deck ma la pagina breve.
 * Telefono = puntatore grossolano e lato corto sotto i 600px (vale anche in
 * orizzontale); un tablet o un computer entrano nel deck. Chi ha scelto
 * «Apri comunque qui» resta nel deck per la sessione.
 */
export function deveRinviare(p: { larghezza: number; altezza: number; coarse: boolean; apriComunque: boolean }): boolean {
  return !p.apriComunque && p.coarse && Math.min(p.larghezza, p.altezza) < 600;
}

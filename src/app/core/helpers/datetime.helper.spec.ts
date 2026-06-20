import { nowAsDatetimeLocalValue, toApiDateTime } from './datetime.helper';

describe('datetime.helper', () => {
  describe('toApiDateTime', () => {
    it('convierte un valor datetime-local a un ISO string UTC', () => {
      const local = '2026-07-01T10:30';

      const resultado = toApiDateTime(local);

      expect(resultado).toBe(new Date(local).toISOString());
      expect(resultado.endsWith('Z')).toBe(true);
    });
  });

  describe('nowAsDatetimeLocalValue', () => {
    it('devuelve un valor con formato datetime-local (YYYY-MM-DDTHH:mm)', () => {
      const valor = nowAsDatetimeLocalValue();

      expect(valor).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('representa el instante actual en hora local', () => {
      const valor = nowAsDatetimeLocalValue();

      // El formato datetime-local no incluye segundos, asi que la diferencia
      // puede ser de hasta 60s dependiendo del segundo exacto en que se truncó.
      const diffMs = Math.abs(new Date(valor).getTime() - Date.now());
      expect(diffMs).toBeLessThan(60_000);
    });
  });
});

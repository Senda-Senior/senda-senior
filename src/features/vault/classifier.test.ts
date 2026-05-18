import { classifyFileName, setUserOverrides, clearOverrideCache } from './classifier';

describe('Vault Classifier', () => {
  beforeEach(() => {
    clearOverrideCache();
  });

  test('classifies juridico documents correctly', () => {
    const result = classifyFileName('contrato_prestacao_servicos.pdf');
    expect(result.category).toBe('juridico');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  test('classifies saude documents correctly', () => {
    const result = classifyFileName('laudo_exame_sangue.pdf');
    expect(result.category).toBe('saude');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  test('classifies newly added seguros documents correctly', () => {
    const result = classifyFileName('apolice_seguros_vida.pdf');
    expect(result.category).toBe('seguros');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  test('classifies newly added previdencia documents correctly', () => {
    const result = classifyFileName('extrato_inss_beneficio.pdf');
    expect(result.category).toBe('previdencia');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  test('classifies newly added familia documents correctly', () => {
    const result = classifyFileName('certidao_nascimento.pdf');
    expect(result.category).toBe('familia');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  test('uses fuzzy matching for similar filenames', () => {
    // Test with a slight variation
    const result = classifyFileName('apolice_de_seguros_vida.pdf');
    expect(result.category).toBe('seguros');
    expect(result.confidence).toBeGreaterThan(0.3); // Lower confidence due to fuzzy matching
  });

  test('handles unknown files', () => {
    const result = classifyFileName('random_document.pdf');
    expect(result.category).toBe('outros');
    expect(result.confidence).toBeLessThan(0.5);
  });

  test('respects user overrides', () => {
    // Set a user override
    setUserOverrides('test-user', [
      {
        userId: 'test-user',
        pattern: 'custom_term',
        category: 'juridico',
        weight: 10,
        createdAt: new Date().toISOString(),
      },
    ]);

    const result = classifyFileName('custom_term_document.pdf', 'test-user');
    expect(result.category).toBe('juridico');
    expect(result.confidence).toBeGreaterThan(0.8); // High confidence due to override
  });

  test('clear override cache works', () => {
    // Set override
    setUserOverrides('test-user', [
      {
        userId: 'test-user',
        pattern: 'test',
        category: 'juridico',
        weight: 10,
        createdAt: new Date().toISOString(),
      },
    ]);

    // Verify it works
    let result = classifyFileName('test_file.pdf', 'test-user');
    expect(result.category).toBe('juridico');

    // Clear cache
    clearOverrideCache('test-user');

    // Should fall back to normal classification
    result = classifyFileName('test_file.pdf', 'test-user');
    expect(result.category).toBe('outros'); // No longer matches override
  });
});
